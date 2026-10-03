import { test, expect, type Page } from "@playwright/test"

/*
 * Screenshot tests for every page, interaction and animation, on desktop and mobile
 * (projects in playwright.config.ts).
 *
 * Determinism:
 * - The WebGL shader background changes every frame, so it is hidden (the page falls back to
 *   its solid colour). It has its own non-screenshot test at the bottom.
 * - Animations are frozen at exact times: view-transition and CSS animations are paused and
 *   seeked with the Web Animations API, so "mid-animation" frames are identical every run.
 * - All images are loaded eagerly and decoded before any screenshot.
 */

declare global {
  interface Window {
    __vt: ViewTransition | null
  }
}

// Ring (square image: tall, scrolls, centred) and Dyson (landscape-ish).
const RING = 0
const DYSON = 1

async function load(page: Page, path = "/", { background = false } = {}) {
  // Expose each view transition so tests can wait for it and freeze it.
  await page.addInitScript(() => {
    window.__vt = null
    const start = document.startViewTransition?.bind(document)
    if (!start) return
    document.startViewTransition = ((arg: never) => {
      const transition = start(arg)
      window.__vt = transition
      return transition
    }) as typeof document.startViewTransition
  })
  await page.goto(path)
  if (!background)
    await page.addStyleTag({ content: "#background { display: none }" })
  await page.evaluate(async () => {
    const images = [...document.images]
    for (const image of images) image.loading = "eager"
    await Promise.all(images.map((image) => image.decode().catch(() => {})))
    // Skip the page-load entrance animations (they have their own test).
    for (const animation of document.getAnimations()) animation.finish()
  })
}

/**
 * Clicks a project card the way a mouse does, but deterministically: hover first and let the
 * card's hover transitions (tilt, brightness, glow) finish, so the "before" snapshot of the
 * view transition doesn't catch them at a random point.
 */
async function openCard(page: Page, index: number) {
  const target = card(page, index)
  await target.hover()
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a instanceof CSSTransition)
        .map((a) => a.finished),
    ),
  )
  await target.click()
}

const card = (page: Page, index: number) =>
  page.locator(`[data-dialog="project-${index}"]`)
const dialog = (page: Page, index: number) => page.locator(`#project-${index}`)

/** Runs `action`, waits for the view transition it starts, and pauses all of its animations. */
async function startAndFreeze(page: Page, action: () => Promise<void>) {
  await page.evaluate(() => (window.__vt = null))
  await action()
  await page.waitForFunction(() => window.__vt !== null)
  await page.evaluate(async () => {
    await window.__vt!.ready
    for (const a of document.documentElement.getAnimations({ subtree: true }))
      if (
        (a.effect as KeyframeEffect | null)?.pseudoElement?.startsWith(
          "::view-transition",
        )
      )
        a.pause()
  })
}

/** Seeks the frozen view transition to `ms` milliseconds. */
async function seekTransition(page: Page, ms: number) {
  await page.evaluate((ms) => {
    for (const a of document.documentElement.getAnimations({ subtree: true }))
      if (
        (a.effect as KeyframeEffect | null)?.pseudoElement?.startsWith(
          "::view-transition",
        )
      )
        a.currentTime = ms
  }, ms)
}

/** Lets the frozen view transition run to the end. */
async function finishTransition(page: Page) {
  await page.evaluate(async () => {
    for (const a of document.documentElement.getAnimations({ subtree: true }))
      if (
        (a.effect as KeyframeEffect | null)?.pseudoElement?.startsWith(
          "::view-transition",
        )
      )
        a.finish()
    await window.__vt!.finished
  })
}

/** Pauses and seeks plain CSS animations with the given animation-name. */
async function seekCssAnimation(page: Page, name: string, ms: number) {
  await page.evaluate(
    ([name, ms]) => {
      for (const a of document.getAnimations())
        if ((a as CSSAnimation).animationName === name) {
          a.pause()
          a.currentTime = ms
        }
    },
    [name, ms] as const,
  )
}

// Frozen mid-animation frames: don't fast-forward them. View-transition snapshots are scaled on
// the GPU, which varies by a few pixels between runs, so allow a small absolute budget (a real
// regression such as card text vanishing is thousands of pixels).
const shot = { animations: "allow", maxDiffPixels: 250 } as const
const still = { animations: "disabled" } as const // settled states

test.describe("pages", () => {
  test("home, full page", async ({ page }) => {
    await load(page)
    await expect(page).toHaveScreenshot("home.png", {
      ...still,
      fullPage: true,
    })
  })

  test("404", async ({ page }) => {
    await load(page, "/404.html")
    await expect(page).toHaveScreenshot("404.png", still)
  })
})

test.describe("page-load entrance animation", () => {
  for (const ms of [0, 300, 600, 1000]) {
    test(`at ${ms}ms`, async ({ page }) => {
      // Stop the animation clock before the page loads (Chromium DevTools), otherwise a slow
      // load lets the 1s entrance finish before the test can pause it.
      const cdp = await page.context().newCDPSession(page)
      await cdp.send("Animation.enable")
      await cdp.send("Animation.setPlaybackRate", { playbackRate: 0 })
      await page.goto("/")
      await page.addStyleTag({ content: "#background { display: none }" })
      await page.evaluate((ms) => {
        for (const a of document.getAnimations()) {
          a.pause()
          a.currentTime = ms
        }
      }, ms)
      await expect(page).toHaveScreenshot(`entrance-${ms}.png`, shot)
    })
  }
})

test.describe("hover and focus (pointer devices)", () => {
  test.skip(({ isMobile }) => isMobile, "no hover on touch screens")

  test("link card: spotlight, tilt, external icon", async ({ page }) => {
    await load(page)
    const link = page.locator("a.spotlight").first()
    const box = (await link.boundingBox())!
    await page.mouse.move(box.x + 90, box.y + 70)
    await expect(link.locator("..").locator("..")).toHaveScreenshot(
      "hover-link-card.png",
      still,
    )
  })

  test("project card: spotlight, tilt, full-brightness image", async ({
    page,
  }) => {
    await load(page)
    await card(page, DYSON).scrollIntoViewIfNeeded()
    const box = (await card(page, DYSON).boundingBox())!
    await page.mouse.move(box.x + box.width - 60, box.y + 60)
    await expect(page).toHaveScreenshot("hover-project-card.png", still)
  })

  test("skill pill", async ({ page }) => {
    await load(page)
    const pill = page.locator("li", { hasText: /^kotlin$/i })
    await pill.hover()
    await expect(pill.locator("..")).toHaveScreenshot(
      "hover-skill-pill.png",
      still,
    )
  })

  test("source link reveals arrow", async ({ page }) => {
    await load(page)
    const source = page.getByRole("link", { name: "Source" })
    await source.hover()
    await expect(source).toHaveScreenshot("hover-source-link.png", still)
  })

  test("project card keyboard focus", async ({ page }) => {
    await load(page)
    await page.keyboard.press("Tab")
    await card(page, DYSON).focus()
    await expect(page).toHaveScreenshot("focus-project-card.png", still)
  })
})

test.describe("project card expand (open)", () => {
  test("frames", async ({ page }) => {
    await load(page)
    await startAndFreeze(page, () => openCard(page, DYSON))
    for (const ms of [0, 100, 225, 350, 450]) {
      await seekTransition(page, ms)
      await expect(page).toHaveScreenshot(`open-${ms}ms.png`, shot)
    }
    await finishTransition(page)
    await expect(dialog(page, DYSON)).toBeVisible()
    await expect(page).toHaveScreenshot("open-done.png", still)
  })

  test("square image starts centred, text visible", async ({ page }) => {
    await load(page)
    await openCard(page, RING)
    await page.evaluate(() => window.__vt?.finished)
    const area = dialog(page, RING).locator("[data-image]")
    const { scrollTop, max } = await area.evaluate((el) => ({
      scrollTop: el.scrollTop,
      max: el.scrollHeight - el.clientHeight,
    }))
    expect(Math.abs(scrollTop - max / 2)).toBeLessThanOrEqual(1)
    await expect(dialog(page, RING).locator("p").last()).toBeInViewport({
      ratio: 1,
    })
    await expect(page).toHaveScreenshot("open-square-centred.png", still)
  })

  test("square image scrolled to the bottom", async ({ page }) => {
    await load(page)
    await openCard(page, RING)
    await page.evaluate(() => window.__vt?.finished)
    await dialog(page, RING)
      .locator("[data-image]")
      .evaluate((el) => (el.scrollTop = el.scrollHeight))
    await expect(page).toHaveScreenshot("open-square-scrolled.png", still)
  })

  test("empty slot keeps its place in the grid", async ({ page, isMobile }) => {
    test.skip(isMobile, "the mobile sheet covers the whole grid")
    await load(page)
    // Volumetric lighting is in the right column, so its slot shows beside the dialog.
    await openCard(page, 7)
    await page.evaluate(() => window.__vt?.finished)
    await expect(card(page, 7)).toHaveAttribute("data-expanded")
    await expect(page).toHaveScreenshot("open-empty-slot.png", still)
  })
})

test.describe("project card collapse (close)", () => {
  test("frames via the X button", async ({ page }) => {
    await load(page)
    await openCard(page, DYSON)
    await page.evaluate(() => window.__vt?.finished)

    await startAndFreeze(page, () =>
      dialog(page, DYSON).locator("[data-close]").click(),
    )
    for (const ms of [0, 100, 200, 300]) {
      await seekTransition(page, ms)
      await expect(page).toHaveScreenshot(`close-${ms}ms.png`, shot)
    }
    await finishTransition(page)

    // After landing, the small card's text fades in and slides up.
    for (const ms of [0, 125, 250]) {
      await seekCssAnimation(page, "card-text-enter", ms)
      await expect(card(page, DYSON)).toHaveScreenshot(
        `close-text-enter-${ms}ms.png`,
        shot,
      )
    }
    await page.evaluate(() => {
      for (const a of document.getAnimations()) a.finish()
    })
    await expect(dialog(page, DYSON)).toBeHidden()
    await expect(card(page, DYSON)).not.toHaveAttribute("data-expanded")
    await expect(page).toHaveScreenshot("close-done.png", still)
  })

  test("Escape closes", async ({ page }) => {
    await load(page)
    await openCard(page, DYSON)
    await page.evaluate(() => window.__vt?.finished)
    await page.keyboard.press("Escape")
    await page.evaluate(() => window.__vt?.finished)
    await expect(dialog(page, DYSON)).toBeHidden()
  })

  test("backdrop click closes", async ({ page, isMobile }) => {
    test.skip(isMobile, "the mobile sheet has no visible backdrop")
    await load(page)
    await openCard(page, DYSON)
    await page.evaluate(() => window.__vt?.finished)
    await page.mouse.click(10, 450)
    await page.evaluate(() => window.__vt?.finished)
    await expect(dialog(page, DYSON)).toBeHidden()
  })
})

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" })

  test("card opens instantly, no view transition", async ({ page }) => {
    await load(page)
    await openCard(page, DYSON)
    await expect(dialog(page, DYSON)).toBeVisible()
    expect(await page.evaluate(() => window.__vt)).toBeNull()
    await expect(page).toHaveScreenshot("reduced-motion-open.png", still)
  })
})

test.describe("animated background", () => {
  // Not a screenshot test: the shader output depends on time.
  const region = { x: 0, y: 0, width: 300, height: 120 }

  test("renders and animates", async ({ page }) => {
    await load(page, "/", { background: true })
    await expect(page.locator("#background canvas")).toHaveCount(1)
    const a = await page.screenshot({ clip: region })
    await page.waitForTimeout(1500)
    const b = await page.screenshot({ clip: region })
    expect(a.equals(b)).toBe(false)
  })

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" })
    test("holds still", async ({ page }) => {
      await load(page, "/", { background: true })
      await page.waitForTimeout(500)
      const a = await page.screenshot({ clip: region })
      await page.waitForTimeout(1500)
      const b = await page.screenshot({ clip: region })
      expect(a.equals(b)).toBe(true)
    })
  })
})

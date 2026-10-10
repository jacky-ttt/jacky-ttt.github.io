import { test as base, expect, type Page } from "@playwright/test"

/**
 * textScale: the browser's default font size as a multiple of 16px (Chrome "Font size", Android text
 * scaling). The *-200 projects use 2, so every test also runs at 200% (WCAG 1.4.4). It's set through
 * CDP before the page loads; only a fullPage screenshot resets it, so no test uses fullPage.
 */
const test = base.extend<{ textScale: number }>({
  textScale: [1, { option: true }],
  page: async ({ page, textScale }, use) => {
    if (textScale !== 1) {
      const cdp = await page.context().newCDPSession(page)
      await cdp.send("Page.enable")
      await cdp.send("Page.setFontSizes", {
        fontSizes: { standard: 16 * textScale, fixed: 13 * textScale },
      })
    }
    await use(page)
    // Guard: a silent reset would store a "200%" baseline that is really at 100%.
    if (textScale !== 1 && page.url().startsWith("http"))
      expect(
        await page.evaluate(
          () => getComputedStyle(document.documentElement).fontSize,
        ),
      ).toBe(`${16 * textScale}px`)
  },
})

/*
 * Screenshot tests for every page, interaction and animation, on desktop and mobile
 * (projects in playwright.config.ts).
 *
 * Determinism:
 * - The dot-grid background's wave loops forever, so the background is hidden (the page falls
 *   back to its solid colour). It has its own non-screenshot test at the bottom.
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

async function load(page: Page, path = "/") {
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
  // Full height by growing the viewport, not fullPage (which resets the font-size setting).
  const growToPage = async (page: Page) =>
    page.setViewportSize({
      width: page.viewportSize()!.width,
      height: await page.evaluate(() => document.documentElement.scrollHeight),
    })

  test("home, full page", async ({ page }) => {
    await load(page)
    await growToPage(page)
    await expect(page).toHaveScreenshot("home.png", still)
  })

  test("404, full page", async ({ page }) => {
    await load(page, "/404.html")
    await growToPage(page)
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

  test("wave toggle shows a border", async ({ page }) => {
    await load(page)
    const toggle = page.locator("#wave-toggle")
    await toggle.hover()
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .filter((a) => a instanceof CSSTransition)
          .map((a) => a.finished),
      ),
    )
    await expect(toggle).toHaveScreenshot("hover-wave-toggle.png", still)
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

  test("square image starts centred, text visible", async ({
    page,
    textScale,
  }) => {
    await load(page)
    await openCard(page, RING)
    await page.evaluate(() => window.__vt?.finished)
    const area = dialog(page, RING).locator("[data-image]")
    const { scrollTop, max } = await area.evaluate((el) => ({
      scrollTop: el.scrollTop,
      max: el.scrollHeight - el.clientHeight,
    }))
    expect(Math.abs(scrollTop - max / 2)).toBeLessThanOrEqual(1)
    // The image never pushes the text box off screen. At 200% a long write-up scrolls inside it,
    // so only at 100% must the last paragraph be fully visible without scrolling.
    await expect(dialog(page, RING).locator(".shrink-0")).toBeInViewport({
      ratio: 1,
    })
    if (textScale === 1)
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

// Long write-ups scroll inside the dialog (at 200% on phones, most of them do).
test("dialog text scrolled to the end", async ({ page }) => {
  await load(page)
  await openCard(page, DYSON)
  await page.evaluate(() => window.__vt?.finished)
  await dialog(page, DYSON)
    .locator(".shrink-0")
    .evaluate((text) => (text.scrollTop = text.scrollHeight))
  await expect(page).toHaveScreenshot("open-text-end.png", still)
})

// Scrollable dialog text fades out at the bottom until the end is reached (scroll-driven, so
// `still` would finish it away: this screenshot leaves animations running).
test("dialog text fades while there is more below", async ({ page }) => {
  await load(page)
  await openCard(page, DYSON)
  await page.evaluate(() => window.__vt?.finished)
  const text = dialog(page, DYSON).locator("[data-scroll-fade]")
  const state = () =>
    text.evaluate((el) => ({
      scrollable: el.scrollHeight > el.clientHeight,
      fade: parseFloat(getComputedStyle(el).getPropertyValue("--scroll-fade")),
    }))
  const top = await state()
  if (top.scrollable) expect(top.fade).toBeGreaterThan(0)
  else expect(top.fade).toBe(0)
  await expect(page).toHaveScreenshot("open-text-fade.png", {
    animations: "allow",
  })
  await text.evaluate((el) => (el.scrollTop = el.scrollHeight))
  await expect.poll(async () => (await state()).fade).toBe(0)
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

  test("Back closes the card and stays on the page", async ({ page }) => {
    await load(page)
    await openCard(page, DYSON)
    await page.evaluate(() => window.__vt?.finished)
    await page.goBack()
    await page.evaluate(() => window.__vt?.finished)
    await expect(dialog(page, DYSON)).toBeHidden()
    expect(new URL(page.url()).pathname).toBe("/")
  })

  test("closing with X consumes the history entry", async ({ page }) => {
    await load(page)
    const length = await page.evaluate(() => history.length)
    await openCard(page, DYSON)
    await page.evaluate(() => window.__vt?.finished)
    await dialog(page, DYSON).locator("[data-close]").click()
    await expect(dialog(page, DYSON)).toBeHidden()
    // The entry is still in the forward stack, but we're back on the original one.
    expect(await page.evaluate(() => history.state)).toBeNull()
    expect(await page.evaluate(() => history.length)).toBe(length + 1)
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

test("page behind an open card doesn't scroll", async ({ page }) => {
  await load(page)
  await openCard(page, DYSON)
  await expect(dialog(page, DYSON)).toBeVisible()
  const before = await page.evaluate(() => scrollY)
  // Over the backdrop (desktop), then over the dialog text, which chains to the page on mobile.
  await page.mouse.move(5, 5)
  await page.mouse.wheel(0, 1000)
  await dialog(page, DYSON).locator(".shrink-0").hover()
  await page.mouse.wheel(0, 2000)
  await page.waitForTimeout(300)
  expect(await page.evaluate(() => scrollY)).toBe(before)
})

// WCAG 1.4.4 (meaningful in the *-200 projects, harmless at 100%): nothing scrolls sideways or clips.
test("no sideways scroll or clipped text", async ({ page }) => {
  for (const path of ["/", "/404.html"]) {
    await load(page, path)
    const result = await page.evaluate(() => ({
      overflowX:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      clipped: [...document.querySelectorAll("h1, h2, h3, a, button")]
        .filter(
          (e) => e.scrollWidth > e.clientWidth + 1 && !e.closest("dialog"),
        )
        .filter((e) => getComputedStyle(e).overflowX === "hidden")
        .map((e) => e.textContent!.trim()),
    }))
    expect(result).toEqual({ overflowX: 0, clipped: [] })
  }
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
  // Not a screenshot test: the wave loops forever, so check the animation itself.
  const waveRunning = (page: Page) =>
    page.evaluate(() =>
      document
        .getAnimations()
        .some(
          (a) =>
            (a as CSSAnimation).animationName === "dot-wave" &&
            a.playState === "running",
        ),
    )

  // Plain goto: load() finishes every animation, which throws on the infinite wave.
  test("wave runs", async ({ page }) => {
    await page.goto("/")
    expect(await waveRunning(page)).toBe(true)
  })

  test("pause button stops the wave, and is remembered", async ({ page }) => {
    await page.goto("/")
    const toggle = page.locator("#wave-toggle")
    await toggle.click()
    await expect(toggle).toHaveText("Play animation")
    expect(await waveRunning(page)).toBe(false)
    await page.reload()
    await expect(toggle).toHaveText("Play animation")
    expect(await waveRunning(page)).toBe(false)
    await toggle.click()
    await expect(toggle).toHaveText("Pause animation")
    expect(await waveRunning(page)).toBe(true)
  })

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" })
    test("no wave, no pause button", async ({ page }) => {
      await page.goto("/")
      expect(await waveRunning(page)).toBe(false)
      await expect(page.locator("#wave-toggle")).toBeHidden()
    })
  })
})

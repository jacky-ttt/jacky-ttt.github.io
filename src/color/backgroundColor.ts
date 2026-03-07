export const getBgColors = <T>(
  projects: T[],
  startColor: string,
  endColor: string,
): string[] => {
  if (projects.length === 0) return []

  return projects.map((_: T, index: number) => {
    const percentage =
      projects.length === 1 ? 0 : Math.pow(index / (projects.length - 1), 2)

    const {
      r: startColorR,
      g: startColorG,
      b: startColorB,
    } = getRGBColor(startColor)
    const { r: endColorR, g: endColorG, b: endColorB } = getRGBColor(endColor)

    const bgColorRed: number = Math.floor(
      startColorR + percentage * (endColorR - startColorR),
    )
    const bgColorGreen: number = Math.floor(
      startColorG + percentage * (endColorG - startColorG),
    )
    const bgColorBlue: number = Math.floor(
      startColorB + percentage * (endColorB - startColorB),
    )
    const newBgColor: string = `#${bgColorRed.toString(16).padStart(2, "0")}${bgColorGreen
      .toString(16)
      .padStart(2, "0")}${bgColorBlue.toString(16).padStart(2, "0")}`

    return newBgColor
  })
}

export const getRGBColor = (hex: string) => {
  const color = hex.replace(/#/g, "")
  // rgb values
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)

  return { r, g, b }
}

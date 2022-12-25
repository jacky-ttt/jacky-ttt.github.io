export const getBgColors = (projects: any[], startColor: string, endColor: string): string[] => {
  return projects.map((_: any, index: number) => {
    const percentage = Math.pow(index / (projects.length - 1), 2)

    const { r: startColorR, g: startColorG, b: startColorB } = getRGBColor(startColor)
    const { r: endColorR, g: endColorG, b: endColorB } = getRGBColor(endColor)

    const bgColorRed: number = Math.floor(startColorR + percentage * Math.abs((startColorR - endColorR)))
    const bgColorGreen: number = Math.floor(startColorG + percentage * Math.abs((startColorG - endColorG)))
    const bgColorBlue: number = Math.floor(startColorB + percentage * Math.abs((startColorB - endColorB)))
    const newBgColor: string = `#${bgColorRed.toString(16) + bgColorGreen.toString(16) + bgColorBlue.toString(16)}`

    return newBgColor
  })
}

export const getRGBColor = (hex: string) => {
  let color = hex.replace(/#/g, "")
  // rgb values
  var r = parseInt(color.substring(0, 2), 16)
  var g = parseInt(color.substring(2, 4), 16)
  var b = parseInt(color.substring(4, 6), 16)

  return { r, g, b }
}
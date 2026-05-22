import type { PaletteColor, PixelData } from '@/types'

/**
 * 使用加权欧几里得距离计算颜色相似度
 * 权重参考人眼对不同颜色通道的敏感度
 */
export function colorDistance(c1: PixelData, c2: PaletteColor): number {
  const rMean = (c1.r + c2.rgb[0]) / 2
  const deltaR = c1.r - c2.rgb[0]
  const deltaG = c1.g - c2.rgb[1]
  const deltaB = c1.b - c2.rgb[2]

  // 加权RGB距离，更好地模仿人眼感知
  const wR = 2 + rMean / 256
  const wG = 4
  const wB = 2 + (255 - rMean) / 256

  return Math.sqrt(wR * deltaR * deltaR + wG * deltaG * deltaG + wB * deltaB * deltaB)
}

/**
 * 在色盘中查找最匹配的颜色
 */
export function findClosestColor(
  pixel: PixelData,
  palette: PaletteColor[]
): PaletteColor {
  let minDist = Infinity
  let closest = palette[0]

  for (const color of palette) {
    const dist = colorDistance(pixel, color)
    if (dist < minDist) {
      minDist = dist
      closest = color
    }
  }

  return closest
}

/**
 * 批量匹配颜色（使用缓存优化）
 */
export function createColorMatcher(palette: PaletteColor[]) {
  const cache = new Map<string, PaletteColor>()

  function getKey(pixel: PixelData): string {
    // 对每个通道做4级量化以增加缓存命中率
    const r = Math.round(pixel.r / 4) * 4
    const g = Math.round(pixel.g / 4) * 4
    const b = Math.round(pixel.b / 4) * 4
    return `${r},${g},${b}`
  }

  return function match(pixel: PixelData): PaletteColor {
    const key = getKey(pixel)
    if (cache.has(key)) {
      return cache.get(key)!
    }
    const result = findClosestColor(pixel, palette)
    cache.set(key, result)
    return result
  }
}

/**
 * 计算两个颜色之间的对比度（用于判断色号标签文字颜色）
 */
export function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

/**
 * RGB转HSL，用于颜色调整
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}
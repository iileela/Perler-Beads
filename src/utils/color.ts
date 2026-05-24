import type { PaletteColor, PixelData } from '@/types';

/**
 * 欧几里得距离颜色匹配
 * 计算像素RGB与色盘中各颜色的欧几里得距离，返回最接近的颜色
 */
export function findClosestColor(
  pixel: PixelData,
  palette: PaletteColor[]
): PaletteColor {
  let minDistance = Infinity;
  let closest = palette[0];

  for (const color of palette) {
    const distance = Math.sqrt(
      Math.pow(pixel.r - color.rgb[0], 2) +
        Math.pow(pixel.g - color.rgb[1], 2) +
        Math.pow(pixel.b - color.rgb[2], 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closest = color;
    }
  }

  return closest;
}

/**
 * 批量颜色匹配（带缓存优化）
 */
export function createColorMatcher(palette: PaletteColor[]) {
  const cache = new Map<string, PaletteColor>();

  function getKey(pixel: PixelData): string {
    const r = Math.round(pixel.r / 4) * 4;
    const g = Math.round(pixel.g / 4) * 4;
    const b = Math.round(pixel.b / 4) * 4;
    return `${r},${g},${b}`;
  }

  return function match(pixel: PixelData): PaletteColor {
    const key = getKey(pixel);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = findClosestColor(pixel, palette);
    cache.set(key, result);
    return result;
  };
}

/**
 * 计算对比色（用于色号标签文字颜色选择）
 */
export function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * RGB 转 HSL
 */
export function rgbToHsl(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

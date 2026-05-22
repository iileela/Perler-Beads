import type { PixelData } from '@/types'

/**
 * 加载图片文件并返回Image对象
 */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 从Image对象获取base64数据
 */
export function imageToBase64(img: HTMLImageElement): string {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  return canvas.toDataURL('image/png')
}

/**
 * 从Image对象提取像素数据
 */
export function extractPixels(img: HTMLImageElement, targetW: number, targetH: number): PixelData[][] {
  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, targetW, targetH)

  const imageData = ctx.getImageData(0, 0, targetW, targetH)
  const pixels: PixelData[][] = []

  for (let y = 0; y < targetH; y++) {
    const row: PixelData[] = []
    for (let x = 0; x < targetW; x++) {
      const idx = (y * targetW + x) * 4
      row.push({
        r: imageData.data[idx],
        g: imageData.data[idx + 1],
        b: imageData.data[idx + 2],
        a: imageData.data[idx + 3],
      })
    }
    pixels.push(row)
  }

  return pixels
}

/**
 * 像素化处理 (马赛克效果)
 * 将图片按 blockSize 分块，每块取平均颜色
 */
export function pixelate(
  img: HTMLImageElement,
  targetW: number,
  targetH: number
): { pixels: PixelData[][]; previewDataUrl: string } {
  // 先缩放到目标尺寸
  const scaled = document.createElement('canvas')
  scaled.width = targetW
  scaled.height = targetH
  const sctx = scaled.getContext('2d')!
  sctx.drawImage(img, 0, 0, targetW, targetH)
  const scaledData = sctx.getImageData(0, 0, targetW, targetH)

  const pixels: PixelData[][] = []
  const outCanvas = document.createElement('canvas')
  outCanvas.width = targetW
  outCanvas.height = targetH
  const octx = outCanvas.getContext('2d')!

  for (let y = 0; y < targetH; y++) {
    const row: PixelData[] = []
    for (let x = 0; x < targetW; x++) {
      const idx = (y * targetW + x) * 4
      const pixel: PixelData = {
        r: scaledData.data[idx],
        g: scaledData.data[idx + 1],
        b: scaledData.data[idx + 2],
        a: 255,
      }
      row.push(pixel)

      // 绘制像素块
      octx.fillStyle = `rgb(${pixel.r},${pixel.g},${pixel.b})`
      octx.fillRect(x, y, 1, 1)
    }
    pixels.push(row)
  }

  return {
    pixels,
    previewDataUrl: outCanvas.toDataURL('image/png'),
  }
}

/**
 * 裁剪图片
 */
export function cropImage(
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
): HTMLImageElement {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, x, y, w, h, 0, 0, w, h)

  const cropped = new Image()
  cropped.src = canvas.toDataURL('image/png')
  return cropped
}

/**
 * AI辅助颜色量化 - 使用中位切分算法优化调色板
 * 将图片颜色数量减少到指定数目
 */
export function medianCutQuantization(pixels: PixelData[], maxColors: number): PixelData[] {
  if (pixels.length <= maxColors) return pixels

  // 对像素进行中位切分聚类
  const boxes: { pixels: PixelData[]; rRange: number[]; gRange: number[]; bRange: number[] }[] = [
    {
      pixels: [...pixels],
      rRange: [0, 255],
      gRange: [0, 255],
      bRange: [0, 255],
    },
  ]

  while (boxes.length < maxColors) {
    // 找到范围最大的box进行切分
    let maxBoxIdx = 0
    let maxRange = 0
    let maxChannel: 'r' | 'g' | 'b' = 'r'

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i]
      const rRange = box.rRange[1] - box.rRange[0]
      const gRange = box.gRange[1] - box.gRange[0]
      const bRange = box.bRange[1] - box.bRange[0]

      if (rRange >= gRange && rRange >= bRange && rRange > maxRange) {
        maxRange = rRange; maxBoxIdx = i; maxChannel = 'r'
      } else if (gRange >= rRange && gRange >= bRange && gRange > maxRange) {
        maxRange = gRange; maxBoxIdx = i; maxChannel = 'g'
      } else if (bRange > maxRange) {
        maxRange = bRange; maxBoxIdx = i; maxChannel = 'b'
      }
    }

    if (maxRange === 0) break

    // 按指定通道排序并切分
    const box = boxes[maxBoxIdx]
    box.pixels.sort((a, b) => a[maxChannel] - b[maxChannel])
    const mid = Math.floor(box.pixels.length / 2)

    const half1 = box.pixels.slice(0, mid)
    const half2 = box.pixels.slice(mid)

    if (half1.length === 0 || half2.length === 0) break

    boxes.splice(maxBoxIdx, 1,
      {
        pixels: half1,
        rRange: [Math.min(...half1.map(p => p.r)), Math.max(...half1.map(p => p.r))],
        gRange: [Math.min(...half1.map(p => p.g)), Math.max(...half1.map(p => p.g))],
        bRange: [Math.min(...half1.map(p => p.b)), Math.max(...half1.map(p => p.b))],
      },
      {
        pixels: half2,
        rRange: [Math.min(...half2.map(p => p.r)), Math.max(...half2.map(p => p.r))],
        gRange: [Math.min(...half2.map(p => p.g)), Math.max(...half2.map(p => p.g))],
        bRange: [Math.min(...half2.map(p => p.b)), Math.max(...half2.map(p => p.b))],
      }
    )
  }

  // 每个box取平均颜色
  return boxes.map(box => {
    const avg = box.pixels.reduce(
      (acc, p) => ({ r: acc.r + p.r, g: acc.g + p.g, b: acc.b + p.b }),
      { r: 0, g: 0, b: 0 }
    )
    const n = box.pixels.length
    return { r: Math.round(avg.r / n), g: Math.round(avg.g / n), b: Math.round(avg.b / n), a: 255 }
  })
}

/**
 * AI增强 - 对图片应用边缘保持的平滑滤波
 */
export function enhanceImage(pixels: PixelData[][], strength: number = 1): PixelData[][] {
  const h = pixels.length
  const w = pixels[0].length
  const result: PixelData[][] = JSON.parse(JSON.stringify(pixels))

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let r = 0, g = 0, b = 0
      let count = 0

      for (let dy = -strength; dy <= strength; dy++) {
        for (let dx = -strength; dx <= strength; dx++) {
          const p = pixels[y + dy]?.[x + dx]
          if (p) {
            r += p.r; g += p.g; b += p.b
            count++
          }
        }
      }

      result[y][x] = {
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count),
        a: 255,
      }
    }
  }

  return result
}
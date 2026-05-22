import type { MatchedPixel, MaterialItem, ExportOptions } from '@/types'
import { getContrastColor } from './color'

/**
 * 生成拼豆图纸PNG
 */
export function generatePatternPNG(
  grid: MatchedPixel[][],
  options: ExportOptions
): string {
  const h = grid.length
  const w = grid[0].length
  const cellSize = options.gridSize
  const labelSize = cellSize * 0.35
  const canvasW = w * cellSize
  const canvasH = h * cellSize

  const canvas = document.createElement('canvas')
  canvas.width = canvasW
  canvas.height = canvasH
  const ctx = canvas.getContext('2d')!

  // 绘制格子
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const cell = grid[y][x]
      const px = x * cellSize
      const py = y * cellSize

      // 填充颜色
      ctx.fillStyle = cell.beadHex
      ctx.fillRect(px, py, cellSize, cellSize)

      // 绘制网格线
      if (options.showGrid) {
        ctx.strokeStyle = 'rgba(0,0,0,0.15)'
        ctx.lineWidth = 0.5
        ctx.strokeRect(px + 0.5, py + 0.5, cellSize - 1, cellSize - 1)
      }

      // 绘制色号标签
      if (options.showLabels) {
        ctx.fillStyle = getContrastColor(cell.beadHex)
        ctx.font = `${Math.max(labelSize, 7)}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(cell.beadCode, px + cellSize / 2, py + cellSize / 2)
      }
    }
  }

  return canvas.toDataURL('image/png')
}

/**
 * 生成预览用的Canvas渲染
 */
export function renderPatternToCanvas(
  canvas: HTMLCanvasElement,
  grid: MatchedPixel[][],
  cellSize: number
): void {
  const h = grid.length
  const w = grid[0].length
  canvas.width = w * cellSize
  canvas.height = h * cellSize
  const ctx = canvas.getContext('2d')!

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const cell = grid[y][x]
      ctx.fillStyle = cell.beadHex
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      ctx.strokeStyle = 'rgba(0,0,0,0.1)'
      ctx.lineWidth = 0.5
      ctx.strokeRect(x * cellSize + 0.5, y * cellSize + 0.5, cellSize - 1, cellSize - 1)
    }
  }
}

/**
 * 计算材料消耗清单
 */
export function calculateMaterialList(grid: MatchedPixel[][]): MaterialItem[] {
  const countMap = new Map<string, { name: string; hex: string; count: number }>()

  for (const row of grid) {
    for (const cell of row) {
      if (!countMap.has(cell.beadCode)) {
        countMap.set(cell.beadCode, { name: cell.beadName, hex: cell.beadHex, count: 0 })
      }
      countMap.get(cell.beadCode)!.count++
    }
  }

  const list: MaterialItem[] = Array.from(countMap.entries()).map(([code, data]) => ({
    code,
    name: data.name,
    hex: data.hex,
    count: data.count,
  }))

  // 按数量从大到小排序
  list.sort((a, b) => b.count - a.count)

  return list
}

/**
 * 生成PDF图纸（使用jsPDF）
 */
export async function generatePatternPDF(
  grid: MatchedPixel[][],
  options: ExportOptions
): Promise<Blob> {
  const { jsPDF } = await import('jspdf')

  const h = grid.length
  const w = grid[0].length
  // 计算合适的cellSize，使图纸适合A4纸
  const maxW = 190 // mm (A4 width minus margins)
  const maxH = 277 // mm (A4 height minus margins)
  const cellSize = Math.min(Math.floor(maxW / w), Math.floor(maxH / h), 10)

  const doc = new (jsPDF as any)({
    orientation: w > h ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const offsetX = (doc.internal.pageSize.getWidth() - w * cellSize) / 2
  const offsetY = (doc.internal.pageSize.getHeight() - h * cellSize) / 2

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const cell = grid[y][x]
      const px = offsetX + x * cellSize
      const py = offsetY + y * cellSize

      // 填充颜色
      doc.setFillColor(
        parseInt(cell.beadHex.slice(1, 3), 16),
        parseInt(cell.beadHex.slice(3, 5), 16),
        parseInt(cell.beadHex.slice(5, 7), 16)
      )
      doc.rect(px, py, cellSize, cellSize, 'F')

      // 网格线
      if (options.showGrid) {
        doc.setDrawColor(0, 0, 0)
        doc.setLineWidth(0.05)
        doc.rect(px, py, cellSize, cellSize, 'S')
      }

      // 色号标签
      if (options.showLabels && cellSize >= 4) {
        const textColor = getContrastColor(cell.beadHex)
        const tc = textColor === '#000000' ? [0, 0, 0] : [255, 255, 255]
        doc.setTextColor(tc[0], tc[1], tc[2])
        doc.setFontSize(Math.max(cellSize * 0.25, 3))
        doc.text(cell.beadCode, px + cellSize / 2, py + cellSize / 2, {
          align: 'center',
          baseline: 'middle',
        })
      }
    }
  }

  // 图例
  if (options.showLegend) {
    doc.addPage()
    const legend = calculateMaterialList(grid)
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('材料清单', 15, 20)

    doc.setFontSize(10)
    let ly = 30
    doc.text('色号', 15, ly)
    doc.text('颜色', 40, ly)
    doc.text('名称', 60, ly)
    doc.text('数量', 120, ly)
    ly += 6

    for (const item of legend) {
      if (ly > 270) {
        doc.addPage()
        ly = 20
      }
      doc.setFillColor(
        parseInt(item.hex.slice(1, 3), 16),
        parseInt(item.hex.slice(3, 5), 16),
        parseInt(item.hex.slice(5, 7), 16)
      )
      doc.rect(15, ly - 3, 5, 5, 'F')
      doc.setDrawColor(0, 0, 0)
      doc.rect(15, ly - 3, 5, 5, 'S')

      doc.setTextColor(0, 0, 0)
      doc.text(item.code, 25, ly)
      doc.text(item.name, 60, ly)
      doc.text(String(item.count), 120, ly)
      ly += 6
    }
  }

  return doc.output('blob')
}

/**
 * 导出材料清单为CSV文本
 */
export function exportMaterialListCSV(items: MaterialItem[]): string {
  const header = '色号,名称,Hex色值,数量'
  const rows = items.map(item => `${item.code},${item.name},${item.hex},${item.count}`)
  return [header, ...rows].join('\n')
}

/**
 * 导出材料清单为文本（人类可读格式）
 */
export function exportMaterialListText(items: MaterialItem[]): string {
  const lines = ['拼豆材料消耗清单', '='.repeat(40), '']
  let total = 0
  for (const item of items) {
    lines.push(`${item.code}  ${item.name.padEnd(18)} ${String(item.count).padStart(5)} 颗  ${item.hex}`)
    total += item.count
  }
  lines.push('')
  lines.push('-'.repeat(40))
  lines.push(`总计: ${total} 颗拼豆`)
  lines.push(`颜色种类: ${items.length}`)
  return lines.join('\n')
}
import type { MatchedPixel, MaterialItem, ExportOptions } from '@/types';
import { getContrastColor } from './color';

/** 拼豆标准尺寸：2.6mm（迷你豆）和 5mm（标准豆） */
export const BEAD_SIZES_MM = [2.6, 5] as const;
export const DEFAULT_BEAD_SIZE_MM = 2.6;

/** 将 mm 单位映射为屏幕预览的像素大小（基于 96 DPI 近似） */
export function mmToPreviewPx(mm: number): number {
  return Math.round(mm * 3.78);
}

/**
 * 生成高清拼豆图纸 PNG
 * 使用 devicePixelRatio 提升导出清晰度，消除模糊
 */
export function generatePatternPNG(
  grid: MatchedPixel[][],
  options: ExportOptions
): string {
  const h = grid.length;
  const w = grid[0].length;
  const cellSize = options.gridSize;
  const scale = Math.max(2, Math.min(4, Math.floor(256 / Math.max(w, h)))); // 自适应高清倍数
  const canvasW = w * cellSize * scale;
  const canvasH = h * cellSize * scale;

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d')!;

  // 关键：禁用平滑，保持像素边缘锐利
  ctx.imageSmoothingEnabled = false;
  ctx.scale(scale, scale);

  const labelFontSize = Math.max(cellSize * 0.35, 0);
  const drawLabels = options.showLabels && labelFontSize >= 6;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const cell = grid[y][x];
      const px = x * cellSize;
      const py = y * cellSize;

      // 填充颜色（像素化边缘，无抗锯齿）
      ctx.fillStyle = cell.beadHex;
      ctx.fillRect(px, py, cellSize, cellSize);

      // 网格线
      if (options.showGrid) {
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([]);
        ctx.strokeRect(px + 0.25, py + 0.25, cellSize - 0.5, cellSize - 0.5);
      }

      // 色号标签
      if (drawLabels) {
        const contrast = getContrastColor(cell.beadHex);
        ctx.fillStyle = contrast;
        ctx.font = `bold ${labelFontSize}px "Segoe UI", "Microsoft YaHei", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cell.beadCode, px + cellSize / 2, py + cellSize / 2);
      }
    }
  }

  return canvas.toDataURL('image/png');
}

/**
 * 生成预览用的 Canvas 渲染
 * 每个像素渲染为圆形，背景为白色
 */
export function renderPatternToCanvas(
  canvas: HTMLCanvasElement,
  grid: MatchedPixel[][],
  cellSize: number,
  showGrid = true,
  showLabels = true
): void {
  const h = grid.length;
  const w = grid[0].length;
  const pad = cellSize * 0.5; // 四周留白半格
  canvas.width = w * cellSize + pad * 2;
  canvas.height = h * cellSize + pad * 2;

  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // 白色背景
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const radius = cellSize * 0.42; // 圆形半径，略小于半格以留间隙
  const labelFontSize = Math.max(cellSize * 0.32, 0);
  const drawLabels = showLabels && labelFontSize >= 5;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const cell = grid[y][x];
      const cx = pad + x * cellSize + cellSize / 2;
      const cy = pad + y * cellSize + cellSize / 2;

      // 绘制圆形
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = cell.beadHex;
      ctx.fill();

      // 网格线（圆形描边）
      if (showGrid) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0,0,0,0.18)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // 色号标签
      if (drawLabels) {
        ctx.fillStyle = getContrastColor(cell.beadHex);
        ctx.font = `bold ${labelFontSize}px "Segoe UI", "Microsoft YaHei", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cell.beadCode, cx, cy);
      }
    }
  }
}

/**
 * 计算材料消耗清单
 */
export function calculateMaterialList(grid: MatchedPixel[][]): MaterialItem[] {
  const countMap = new Map<
    string,
    { name: string; hex: string; count: number }
  >();

  for (const row of grid) {
    for (const cell of row) {
      if (!countMap.has(cell.beadCode)) {
        countMap.set(cell.beadCode, {
          name: cell.beadName,
          hex: cell.beadHex,
          count: 0
        });
      }
      countMap.get(cell.beadCode)!.count++;
    }
  }

  const list: MaterialItem[] = Array.from(countMap.entries()).map(
    ([code, data]) => ({
      code,
      name: data.name,
      hex: data.hex,
      count: data.count
    })
  );

  list.sort((a, b) => b.count - a.count);
  return list;
}

/**
 * 将材料清单渲染为 Canvas 图片（避免 PDF 中文乱码）
 * 返回 dataURL 和画布高度（用于PDF嵌入）
 */
function renderMaterialListToCanvas(items: MaterialItem[]): {
  dataUrl: string;
  canvasHeight: number;
} {
  const rowHeight = 24;
  const canvasWidth = 520;
  const headerHeight = 40;
  const footerHeight = 30;
  const canvasHeight = headerHeight + items.length * rowHeight + footerHeight;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d')!;

  // 白色背景
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 标题
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 16px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('材料消耗清单', 15, 26);

  // 表头
  const headerY = headerHeight;
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(15, headerY - 14, canvasWidth - 30, 20);

  ctx.fillStyle = '#333333';
  ctx.font = 'bold 11px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillText('色号', 20, headerY + 1);
  ctx.fillText('颜色', 80, headerY + 1);
  ctx.fillText('名称', 128, headerY + 1);
  ctx.fillText('数量', 340, headerY + 1);
  ctx.fillText('占比', 420, headerY + 1);

  // 分隔线
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(15, headerY + 10);
  ctx.lineTo(canvasWidth - 15, headerY + 10);
  ctx.stroke();

  // 数据行
  const total = items.reduce((sum, i) => sum + i.count, 0);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const y = headerHeight + 10 + i * rowHeight + 10;

    // 颜色方块
    ctx.fillStyle = item.hex;
    ctx.fillRect(20, y - 6, 12, 12);
    ctx.strokeStyle = '#d1d5db';
    ctx.strokeRect(20, y - 6, 12, 12);

    ctx.fillStyle = '#1a1a1a';
    ctx.font = '11px "Microsoft YaHei", "Segoe UI", sans-serif';
    ctx.fillText(item.code, 40, y + 3);

    // 名称（英文，无需中文）
    ctx.fillText(item.name, 128, y + 3);

    // 数量
    ctx.font = 'bold 11px "Microsoft YaHei", "Segoe UI", sans-serif';
    ctx.fillText(String(item.count), 340, y + 3);

    // 占比
    const pct = ((item.count / total) * 100).toFixed(1);
    ctx.font = '11px "Microsoft YaHei", "Segoe UI", sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(`${pct}%`, 420, y + 3);

    // 行分隔线
    if (i < items.length - 1) {
      ctx.strokeStyle = '#f3f4f6';
      ctx.beginPath();
      ctx.moveTo(15, y + 10);
      ctx.lineTo(canvasWidth - 15, y + 10);
      ctx.stroke();
    }
  }

  // 底部统计
  const footerY = canvasHeight - footerHeight + 12;
  ctx.strokeStyle = '#d1d5db';
  ctx.beginPath();
  ctx.moveTo(15, footerY - 5);
  ctx.lineTo(canvasWidth - 15, footerY - 5);
  ctx.stroke();

  ctx.fillStyle = '#1a1a1a';
  ctx.font = '11px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillText(
    `总计：${total} 颗拼豆    颜色种类：${items.length}`,
    20,
    footerY + 12
  );

  return {
    dataUrl: canvas.toDataURL('image/png'),
    canvasHeight
  };
}

/**
 * 生成 PDF 图纸
 * 材料清单使用 Canvas 渲染嵌入，彻底避免中文乱码
 */
export async function generatePatternPDF(
  grid: MatchedPixel[][],
  options: ExportOptions
): Promise<Blob> {
  const { jsPDF } = await import('jspdf');

  const h = grid.length;
  const w = grid[0].length;

  // 使用 options.gridSize 作为每个 bead 的实际 mm 尺寸
  const beadMM = options.gridSize;

  // 图纸实际物理尺寸
  const drawingWidthMM = w * beadMM;
  const drawingHeightMM = h * beadMM;

  // A4 可用区域
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const availableW = pageWidth - margin * 2;
  const availableH = pageHeight - margin * 2;

  // 如果图纸太大，自动缩放
  let finalBeadMM = beadMM;
  if (drawingWidthMM > availableW || drawingHeightMM > availableH) {
    const scaleW = availableW / drawingWidthMM;
    const scaleH = availableH / drawingHeightMM;
    finalBeadMM = beadMM * Math.min(scaleW, scaleH);
  }

  const finalW = w * finalBeadMM;
  const finalH = h * finalBeadMM;
  const offsetX = (pageWidth - finalW) / 2;
  const offsetY = (pageHeight - finalH) / 2;

  const doc = new (jsPDF as any)('p', 'mm', 'a4');

  // 绘制图纸
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const cell = grid[y][x];
      const px = offsetX + x * finalBeadMM;
      const py = offsetY + y * finalBeadMM;

      doc.setFillColor(
        parseInt(cell.beadHex.slice(1, 3), 16),
        parseInt(cell.beadHex.slice(3, 5), 16),
        parseInt(cell.beadHex.slice(5, 7), 16)
      );
      doc.rect(px, py, finalBeadMM, finalBeadMM, 'F');

      if (options.showGrid) {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.03);
        doc.rect(px, py, finalBeadMM, finalBeadMM, 'S');
      }

      if (options.showLabels && finalBeadMM >= 1.8) {
        const textColor = getContrastColor(cell.beadHex);
        const tc = textColor === '#000000' ? [0, 0, 0] : [255, 255, 255];
        doc.setTextColor(tc[0], tc[1], tc[2]);
        doc.setFontSize(Math.max(finalBeadMM * 0.28, 1.5));
        doc.text(cell.beadCode, px + finalBeadMM / 2, py + finalBeadMM / 2, {
          align: 'center',
          baseline: 'middle'
        });
      }
    }
  }

  // 材料清单页 —— 使用 Canvas 渲染为图片嵌入，避免中文乱码
  if (options.showLegend) {
    doc.addPage();
    const legend = calculateMaterialList(grid);
    const { dataUrl, canvasHeight } = renderMaterialListToCanvas(legend);

    // Canvas 宽度 520px → 映射到 PDF 约 180mm
    const imgWidth = 180;
    const imgHeight = (canvasHeight / 520) * imgWidth;
    const imgX = (pageWidth - imgWidth) / 2;
    const imgY = 15;

    doc.addImage(dataUrl, 'PNG', imgX, imgY, imgWidth, imgHeight);
  }

  return doc.output('blob');
}

/**
 * 导出材料清单为 CSV 文本
 */
export function exportMaterialListCSV(items: MaterialItem[]): string {
  const header = '色号,名称,Hex色值,数量';
  const rows = items.map(
    (item) => `${item.code},${item.name},${item.hex},${item.count}`
  );
  return [header, ...rows].join('\n');
}

/**
 * 导出材料清单为文本
 */
export function exportMaterialListText(items: MaterialItem[]): string {
  const lines = ['拼豆材料消耗清单', '='.repeat(40), ''];
  let total = 0;
  for (const item of items) {
    lines.push(
      `${item.code}  ${item.name.padEnd(18)} ${String(item.count).padStart(5)} 颗  ${item.hex}`
    );
    total += item.count;
  }
  lines.push('');
  lines.push('-'.repeat(40));
  lines.push(`总计: ${total} 颗拼豆`);
  lines.push(`颜色种类: ${items.length}`);
  return lines.join('\n');
}

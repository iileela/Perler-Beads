// 拼豆色盘数据类型定义

export interface PaletteColor {
  code: string; // 色号
  name: string; // 颜色名称
  hex: string; // HEX色值
  rgb: [number, number, number];
}

export interface BrandPalette {
  name: string; // 品牌名称
  colors: PaletteColor[];
}

export interface PixelData {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface MatchedPixel extends PixelData {
  beadCode: string;
  beadName: string;
  beadHex: string;
}

export interface ProjectData {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  originalImage?: string;
  processedImage?: string;
  pixelWidth: number;
  pixelHeight: number;
  matchedGrid: MatchedPixel[][];
  thumbnail?: string;
}

export interface MaterialItem {
  code: string;
  name: string;
  hex: string;
  count: number;
}

export interface ExportOptions {
  format: 'png' | 'pdf';
  showGrid: boolean;
  showLabels: boolean;
  gridSize: number;
  showLegend: boolean;
}

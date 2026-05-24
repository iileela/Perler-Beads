import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  ProjectData,
  MatchedPixel,
  MaterialItem,
  PixelData
} from '@/types';
import { getPaletteColors } from '@/data/palettes';
import { createColorMatcher } from '@/utils/color';
import { extractPixels, pixelate, enhanceImage } from '@/utils/image';
import { calculateMaterialList } from '@/utils/pattern';

export const useProjectStore = defineStore('project', () => {
  // 当前步骤: 1=上传, 2=像素化, 3=匹配, 4=导出
  const currentStep = ref(1);
  const isProcessing = ref(false);
  const processingMessage = ref('');

  // 原始图片
  const originalImage = ref<HTMLImageElement | null>(null);
  const originalDataUrl = ref('');

  // 像素化参数
  const pixelWidth = ref(48);
  const pixelHeight = ref(48);
  const lockAspectRatio = ref(true);
  const originalAspectRatio = ref(1);
  const enableAIEnhance = ref(true);
  const enhanceStrength = ref(1);
  const pixelatedPixels = ref<PixelData[][]>([]);
  const pixelatedPreview = ref('');

  // 色盘匹配
  const matchedGrid = ref<MatchedPixel[][]>([]);
  const materialList = ref<MaterialItem[]>([]);

  // 手动调整
  const manualOverrides = ref<Map<string, string>>(new Map());

  // 项目历史
  const projects = ref<ProjectData[]>(loadProjectsFromStorage());

  // 计算属性
  const totalBeads = computed(() => {
    return materialList.value.reduce((sum, item) => sum + item.count, 0);
  });

  const colorCount = computed(() => materialList.value.length);

  const gridDimensions = computed(() => {
    if (matchedGrid.value.length === 0) return { w: 0, h: 0 };
    return { w: matchedGrid.value[0].length, h: matchedGrid.value.length };
  });

  // 加载本地存储
  function loadProjectsFromStorage(): ProjectData[] {
    try {
      const data = localStorage.getItem('perler-beads-projects');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function saveProjectsToStorage() {
    localStorage.setItem(
      'perler-beads-projects',
      JSON.stringify(projects.value)
    );
  }

  // 设置原始图片
  function setOriginalImage(img: HTMLImageElement, dataUrl: string) {
    originalImage.value = img;
    originalDataUrl.value = dataUrl;
    originalAspectRatio.value = img.width / img.height;

    // 根据原始宽高比自动计算初始像素尺寸（短边=48，长边按比例）
    const MAX_INIT = 200;
    const MIN_INIT = 8;
    if (originalAspectRatio.value >= 1) {
      // 横图：宽度=48，高度按比例
      pixelWidth.value = Math.min(MAX_INIT, Math.max(MIN_INIT, 48));
      pixelHeight.value = Math.min(
        MAX_INIT,
        Math.max(
          MIN_INIT,
          Math.round(pixelWidth.value / originalAspectRatio.value)
        )
      );
    } else {
      // 竖图：高度=48，宽度按比例
      pixelHeight.value = Math.min(MAX_INIT, Math.max(MIN_INIT, 48));
      pixelWidth.value = Math.min(
        MAX_INIT,
        Math.max(
          MIN_INIT,
          Math.round(pixelHeight.value * originalAspectRatio.value)
        )
      );
    }

    currentStep.value = 2;
    // 重置后续步骤
    pixelatedPixels.value = [];
    pixelatedPreview.value = '';
    matchedGrid.value = [];
    materialList.value = [];
  }

  // 根据宽高比锁定，自动计算另一维度
  function setPixelWidth(w: number) {
    pixelWidth.value = Math.max(8, Math.min(200, w));
    if (lockAspectRatio.value && originalAspectRatio.value > 0) {
      pixelHeight.value = Math.max(
        8,
        Math.min(200, Math.round(pixelWidth.value / originalAspectRatio.value))
      );
    }
  }

  function setPixelHeight(h: number) {
    pixelHeight.value = Math.max(8, Math.min(200, h));
    if (lockAspectRatio.value && originalAspectRatio.value > 0) {
      pixelWidth.value = Math.max(
        8,
        Math.min(200, Math.round(pixelHeight.value * originalAspectRatio.value))
      );
    }
  }

  function setPixelSize(w: number, h: number) {
    if (lockAspectRatio.value && originalAspectRatio.value > 0) {
      pixelWidth.value = Math.max(8, Math.min(200, w));
      pixelHeight.value = Math.max(
        8,
        Math.min(200, Math.round(pixelWidth.value / originalAspectRatio.value))
      );
    } else {
      pixelWidth.value = Math.max(8, Math.min(200, w));
      pixelHeight.value = Math.max(8, Math.min(200, h));
    }
  }

  // 执行像素化
  async function doPixelate() {
    if (!originalImage.value) return;
    isProcessing.value = true;
    processingMessage.value = '正在进行像素化处理...';

    // 模拟AI处理延迟
    await new Promise((r) => setTimeout(r, 300));

    const result = pixelate(
      originalImage.value,
      pixelWidth.value,
      pixelHeight.value
    );

    let pixels = result.pixels;
    if (enableAIEnhance.value) {
      processingMessage.value = 'AI图像增强中...';
      await new Promise((r) => setTimeout(r, 200));
      pixels = enhanceImage(pixels, enhanceStrength.value);
    }

    pixelatedPixels.value = pixels;
    pixelatedPreview.value = result.previewDataUrl;
    currentStep.value = 3;
    isProcessing.value = false;
    processingMessage.value = '';
  }

  // 执行色盘匹配
  async function doColorMatch() {
    if (pixelatedPixels.value.length === 0) return;
    isProcessing.value = true;
    processingMessage.value = '正在进行颜色匹配...';

    const palette = getPaletteColors();
    const matcher = createColorMatcher(palette);
    const grid: MatchedPixel[][] = [];

    for (const row of pixelatedPixels.value) {
      const matchedRow: MatchedPixel[] = [];
      for (const pixel of row) {
        const match = matcher(pixel);
        matchedRow.push({
          ...pixel,
          beadCode: match.code,
          beadName: match.name,
          beadHex: match.hex
        });
      }
      grid.push(matchedRow);
    }

    // 应用手动覆盖
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const key = `${x},${y}`;
        const overrideCode = manualOverrides.value.get(key);
        if (overrideCode) {
          const color = palette.find((c) => c.code === overrideCode);
          if (color) {
            grid[y][x].beadCode = color.code;
            grid[y][x].beadName = color.name;
            grid[y][x].beadHex = color.hex;
          }
        }
      }
    }

    matchedGrid.value = grid;
    materialList.value = calculateMaterialList(grid);
    currentStep.value = 4;
    isProcessing.value = false;
    processingMessage.value = '';

    // 自动保存项目
    await saveCurrentProject();
  }

  // 手动覆盖颜色
  function overrideColor(x: number, y: number, beadCode: string) {
    manualOverrides.value.set(`${x},${y}`, beadCode);
    doColorMatch();
  }

  // 保存当前项目
  async function saveCurrentProject() {
    if (matchedGrid.value.length === 0) return;

    const project: ProjectData = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: `项目 ${new Date().toLocaleString('zh-CN')}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      originalImage: originalDataUrl.value,
      processedImage: pixelatedPreview.value,
      pixelWidth: pixelWidth.value,
      pixelHeight: pixelHeight.value,
      matchedGrid: matchedGrid.value
    };

    project.thumbnail = pixelatedPreview.value;

    const existingIdx = projects.value.findIndex(
      (p) =>
        p.originalImage === originalDataUrl.value &&
        p.pixelWidth === pixelWidth.value
    );
    if (existingIdx >= 0) {
      projects.value[existingIdx] = {
        ...projects.value[existingIdx],
        ...project
      };
    } else {
      projects.value.unshift(project);
    }

    if (projects.value.length > 20) {
      projects.value = projects.value.slice(0, 20);
    }

    saveProjectsToStorage();
  }

  // 加载项目
  function loadProject(project: ProjectData) {
    pixelWidth.value = project.pixelWidth;
    pixelHeight.value = project.pixelHeight;
    matchedGrid.value = project.matchedGrid;
    materialList.value = calculateMaterialList(project.matchedGrid);
    currentStep.value = 4;
  }

  // 删除项目
  function deleteProject(id: string) {
    projects.value = projects.value.filter((p) => p.id !== id);
    saveProjectsToStorage();
  }

  // 重置
  function reset() {
    currentStep.value = 1;
    originalImage.value = null;
    originalDataUrl.value = '';
    originalAspectRatio.value = 1;
    lockAspectRatio.value = true;
    pixelWidth.value = 48;
    pixelHeight.value = 48;
    pixelatedPixels.value = [];
    pixelatedPreview.value = '';
    matchedGrid.value = [];
    materialList.value = [];
    manualOverrides.value.clear();
  }

  return {
    currentStep,
    isProcessing,
    processingMessage,
    originalImage,
    originalDataUrl,
    pixelWidth,
    pixelHeight,
    lockAspectRatio,
    originalAspectRatio,
    enableAIEnhance,
    enhanceStrength,
    pixelatedPixels,
    pixelatedPreview,
    matchedGrid,
    materialList,
    manualOverrides,
    projects,
    totalBeads,
    colorCount,
    gridDimensions,
    setOriginalImage,
    setPixelWidth,
    setPixelHeight,
    setPixelSize,
    doPixelate,
    doColorMatch,
    overrideColor,
    saveCurrentProject,
    loadProject,
    deleteProject,
    reset
  };
});

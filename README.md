# 拼豆图纸生成器 (Perler Beads Pattern Generator)

基于 Vue 3 的拼豆网页生产工具，集成 AI 图像处理功能，实现从图片上传到实体拼豆图纸生成的完整工作流程。

## 功能特性

- **图片上传与预处理**：支持 JPG / PNG / WebP / BMP 格式，拖拽或点击上传
- **AI 像素化处理**：自动将普通图片转换为马赛克效果，可自定义像素尺寸
- **色盘匹配系统**：内置 Perler / Artkal / Hama 三种品牌色盘（各 50 色），精确颜色映射
- **手动颜色微调**：点击图纸像素，从色盘中手动替换颜色
- **图纸生成与导出**：PNG 高清图纸（带网格线和色号） + PDF 文档（含材料清单）
- **材料消耗清单**：自动统计各颜色拼豆用量，支持 TXT / CSV 导出和购物清单复制
- **历史项目管理**：本地存储自动保存，最多保留 20 个项目

## 技术栈

| 技术       | 版本 |
| ---------- | ---- |
| Vue 3      | ^3.5 |
| Vite       | ^6.0 |
| TypeScript | ~5.6 |
| Pinia      | ^2.1 |
| Vue Router | ^4.4 |
| jsPDF      | ^2.5 |

## 本地运行

### 环境要求

- **Node.js** >= 18.0
- **npm** >= 9.0

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/iileela/Perler-Beads.git
cd Perler-Beads

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

启动后访问浏览器控制台输出的本地地址（默认为 http://localhost:5173/）。

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录下，可直接部署到任意静态文件服务器。

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
Perler-Beads/
├── public/
│   └── vite.svg                  # 网站图标
├── index.html                    # 入口 HTML
├── package.json                  # 项目配置与依赖
├── vite.config.ts                # Vite 构建配置
├── tsconfig.json                 # TypeScript 配置
└── src/
    ├── main.ts                   # 应用入口（注册 Pinia + Router）
    ├── App.vue                   # 根组件（导航栏）
    ├── router/
    │   └── index.ts              # 路由配置
    ├── stores/
    │   └── project.ts            # Pinia 核心状态管理
    ├── types/
    │   └── index.ts              # TypeScript 类型定义
    ├── data/
    │   └── palettes.ts           # 三品牌色盘数据
    ├── utils/
    │   ├── color.ts              # 颜色匹配算法
    │   ├── image.ts              # 图像处理（像素化 / AI 增强）
    │   └── pattern.ts            # 图纸生成 / 导出 / 材料清单
    ├── components/
    │   ├── ImageUploader.vue     # 图片上传组件
    │   ├── PixelationControls.vue # 像素化参数设置
    │   ├── PaletteMatcher.vue    # 色盘匹配与手动微调
    │   ├── PatternPreview.vue    # 图纸预览与导出
    │   └── MaterialList.vue      # 材料消耗清单
    ├── views/
    │   ├── Workbench.vue         # 主工作台（4 步流程）
    │   ├── History.vue           # 历史项目管理
    │   └── Help.vue              # 帮助文档
    └── styles/
        └── global.css            # 全局样式与响应式
```

## 使用指南

### 三步核心操作

```
上传图片 → 设置像素 → 导出图纸
```

1. **上传图片**：在工作台页面拖拽或点击上传图片
2. **设置像素尺寸**：选择预设尺寸（29x29 / 48x48 / 64x64 等）或手动输入，开启 AI 增强效果更佳
3. **导出图纸**：选择 Perler / Artkal / Hama 品牌，自动匹配颜色后导出 PNG 或 PDF

### 颜色匹配

- 默认使用**加权欧几里得距离算法**，权重参考人眼对不同颜色通道的敏感度
- 匹配不满意时，可点击图纸上的像素点，从色盘中选择替换颜色

### 导出格式

| 格式      | 用途                          |
| --------- | ----------------------------- |
| PNG       | 高清图纸，适合屏幕查看        |
| PDF       | A4 打印版，含材料清单页       |
| TXT / CSV | 材料消耗清单，可用 Excel 打开 |

## 常见问题

**Q: 为什么 `npm install` 特别慢？**

A: 可使用国内镜像加速：

```bash
npm install --registry=https://registry.npmmirror.com
```

**Q: 图片处理时浏览器卡顿？**

A: 建议将像素尺寸控制在 100 以内，超过 100x100 的大图会消耗较多计算资源。

## License

MIT

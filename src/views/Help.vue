<template>
  <div class="help-page">
    <div class="container">
      <h1>帮助文档</h1>
      <p class="subtitle">拼豆图纸生成器使用指南</p>

      <div class="help-sections">
        <section class="card help-section">
          <h2>快速入门</h2>
          <ol class="steps-list">
            <li>
              <strong>上传图片</strong>
              <p>在"工作台"页面，点击上传区域或拖拽图片文件到页面中。支持 JPG、PNG、WebP、BMP 等常见格式。</p>
            </li>
            <li>
              <strong>设置像素尺寸</strong>
              <p>设置目标图纸的宽度和高度（拼豆数量）。数值越大图纸越精细，但也需要更多的拼豆。可以使用快速预设或手动输入数值。</p>
            </li>
            <li>
              <strong>选择品牌色盘</strong>
              <p>选择您使用的拼豆品牌（Perler、Artkal 或 Hama），系统会自动将图片颜色匹配到该品牌最接近的色号。</p>
            </li>
            <li>
              <strong>预览与微调</strong>
              <p>查看匹配结果，点击像素点可手动调整颜色选择。确认满意后进入导出步骤。</p>
            </li>
            <li>
              <strong>导出图纸</strong>
              <p>选择导出 PNG 图片图纸或 PDF 文档（包含材料清单）。PDF 格式适合打印后对照制作。</p>
            </li>
          </ol>
        </section>

        <section class="card help-section">
          <h2>AI 图像增强功能</h2>
          <p>本工具内置 AI 图像处理能力，包括：</p>
          <ul>
            <li><strong>像素化处理：</strong>将普通图片转换为马赛克风格，适配拼豆像素化需求。</li>
            <li><strong>边缘平滑滤波：</strong>在像素化处理后自动进行噪声过滤，减少色彩噪点。</li>
            <li><strong>颜色量化：</strong>使用中位切分算法优化色彩分布，使匹配后的图案更加自然。</li>
          </ul>
          <p>您可以在"像素化设置"步骤中调整 AI 增强强度参数。</p>
        </section>

        <section class="card help-section">
          <h2>颜色匹配算法</h2>
          <p>系统使用加权欧几里得距离算法进行颜色匹配，权重参考人眼对不同颜色通道的敏感度（红色 2-3x、绿色 4x、蓝色 2-3x），确保匹配结果更符合人眼视觉感知。</p>
          <p>匹配过程采用内存缓存优化，大幅提升处理速度。</p>
        </section>

        <section class="card help-section">
          <h2>拼豆品牌色盘</h2>
          <table class="brand-table">
            <thead>
              <tr>
                <th>品牌</th>
                <th>色号前缀</th>
                <th>颜色数量</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Perler</td>
                <td><code>Pxx</code></td>
                <td>50色</td>
                <td>最常见的拼豆品牌，颜色丰富</td>
              </tr>
              <tr>
                <td>Artkal</td>
                <td><code>Axx</code></td>
                <td>50色</td>
                <td>国内常用品牌，与Perler兼容</td>
              </tr>
              <tr>
                <td>Hama</td>
                <td><code>Hxx</code></td>
                <td>50色</td>
                <td>欧洲主流品牌，色系更柔和</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="card help-section">
          <h2>导出格式说明</h2>
          <ul>
            <li><strong>PNG 图纸：</strong>带网格线和色号标记的高清图，适合屏幕查看和标记。</li>
            <li><strong>PDF 文档：</strong>A4格式，包含图纸页和材料清单页，适合打印。</li>
            <li><strong>材料清单(TXT)：</strong>纯文本格式的材料消耗清单。</li>
            <li><strong>材料清单(CSV)：</strong>可用Excel/WPS打开的表格格式。</li>
            <li><strong>购物清单：</strong>复制到剪贴板，可直接粘贴到记事本或购物应用中使用。</li>
          </ul>
        </section>

        <section class="card help-section">
          <h2>常见问题</h2>
          <div class="faq-item">
            <h4>Q: 图片应该选多大尺寸？</h4>
            <p>A: 建议设置 29x29（小板）、48x48（中板）或 58x58（大板）。更大尺寸需要更多拼豆。</p>
          </div>
          <div class="faq-item">
            <h4>Q: 为什么匹配结果有色差？</h4>
            <p>A: 实体拼豆颜色有限，算法会匹配最接近的颜色。您可以使用手动微调功能调整不理想的匹配。</p>
          </div>
          <div class="faq-item">
            <h4>Q: 数据保存在哪里？</h4>
            <p>A: 所有项目数据保存在浏览器的本地存储中。清除浏览器数据会导致项目丢失，请及时导出重要项目。</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.help-page {
  padding: 24px 16px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.help-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.help-section h2 {
  font-size: 18px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.help-section h4 {
  font-size: 14px;
  margin-bottom: 4px;
}

.help-section p, .help-section li {
  font-size: 14px;
  line-height: 1.8;
}

.steps-list {
  padding-left: 24px;
}

.steps-list li {
  margin-bottom: 12px;
}

.steps-list strong {
  display: block;
  margin-bottom: 2px;
}

.help-section ul {
  padding-left: 20px;
}

.help-section li {
  margin-bottom: 6px;
}

.brand-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.brand-table th, .brand-table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.brand-table th {
  background: #f9fafb;
}

.faq-item {
  padding: 12px 0;
}

.faq-item + .faq-item {
  border-top: 1px solid var(--border);
}
</style>
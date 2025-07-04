import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';

async function convertHtmlToImage() {
  console.log('开始执行 HTML 到图片的转换...');

  let browser;
  try {
    // 启动 Puppeteer，它会下载并使用一个绑定版本的 Chromium
    console.log('正在启动浏览器...');
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    // 读取 HTML 文件内容
    const htmlPath = path.resolve(__dirname, '../source/cursor-1.2.html');
    console.log(`正在读取 HTML 文件: ${htmlPath}`);
    const htmlContent = await fs.readFile(htmlPath, 'utf-8');

    // 在页面中设置 HTML 内容
    await page.setContent(htmlContent, {
      // 等待直到网络空闲，确保所有资源（如字体）都已加载
      waitUntil: 'networkidle0'
    });

    // 设置视口大小以确保渲染完整的桌面视图
    await page.setViewport({
      width: 1280, // 足够宽以容纳内容
      height: 1024,
      deviceScaleFactor: 2 // 2倍缩放以获得更高清的截图
    });

    const outputPath = 'html-output.png';
    console.log(`正在截取页面并保存到: ${outputPath}`);

    // 对整个页面进行截图
    await page.screenshot({
      path: outputPath,
      fullPage: true // 确保截取整个页面的高度
    });

    console.log(`✅ 转换成功！图片已保存为 ${outputPath}`);

  } catch (error) {
    console.error('转换过程中发生错误:', error);
  } finally {
    if (browser) {
      console.log('正在关闭浏览器...');
      await browser.close();
    }
  }
}

convertHtmlToImage(); 

const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("@playwright/test");

async function main() {
  const directory = path.resolve(__dirname, "public/icons");
  const svg = await fs.readFile(path.join(directory, "hunarloop.svg"), "utf8");
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage();
    for (const size of [192, 512]) {
      const png = await page.evaluate(async ({ source, size }) => {
        const image = new Image();
        image.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(source)));
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        canvas.getContext("2d").drawImage(image, 0, 0, size, size);
        return canvas.toDataURL("image/png").split(",")[1];
      }, { source: svg, size });
      await fs.writeFile(path.join(directory, `hunarloop-${size}.png`), Buffer.from(png, "base64"));
    }
  } finally { await browser.close(); }
}

main().catch((error) => { process.stderr.write(String(error) + "\n"); process.exitCode = 1; });

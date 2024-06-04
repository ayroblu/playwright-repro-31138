import { chromium } from "playwright";
import { cacheAllRoutes } from "./cache.ts";

const url =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 800, height: 600 },
  });
  await cacheAllRoutes(context);
  console.log("started browser");
  await Promise.all(
    Array(20)
      .fill(null)
      .map(async () => {
        const page = await context.newPage();
        await page.goto(url);
        await page.evaluate(
          (delay) => new Promise((resolve) => setTimeout(resolve, delay)),
          10000,
        );
      }),
  );
  await context.close();
} catch (err) {
  console.error("Error", err);
}
await browser.close();
console.log("closed browser, it should quit at this point but it doesn't");

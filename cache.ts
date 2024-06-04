import type { APIResponse, BrowserContext } from "playwright";

const routeCache = new Map<string, APIResponse>();

/** This function is just to overload the devtools <-> chrome inter connect, the caching itself is not important */
export async function cacheAllRoutes(context: BrowserContext) {
  await context.route(/.*/, async (route, request) => {
    const url = request.url();
    console.log("url", url);
    const cachedResponse = routeCache.get(url);
    if (cachedResponse) {
      try {
        await route.fulfill({ response: cachedResponse });
      } catch (err) {
        console.error("failed to fulfill:", err);
      }
    } else {
      try {
        const response = await route.fetch({ url });
        if (response.ok()) {
          routeCache.set(url, response);
        }
        await route.fulfill({ response });
      } catch (err) {
        console.error("!! failed to fetch", err);
        await route.continue().catch(() => {});
      }
    }
  });
}

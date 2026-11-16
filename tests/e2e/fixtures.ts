import { expect, test as base } from "@playwright/test";

/**
 * Wartet nach jeder Navigation, bis React die Seite übernommen hat (`data-hydrated`).
 * Ohne das kann ein früher Klick auf ein Formularfeld durch die Hydration zurückgesetzt werden.
 */
export const test = base.extend({
  page: async ({ page }, provide) => {
    const waitHydrated = () =>
      page.waitForFunction(() => document.documentElement.dataset.hydrated === "true", undefined, { timeout: 20_000 });

    const goto = page.goto.bind(page);
    page.goto = (async (url: string, options?: Parameters<typeof goto>[1]) => {
      const response = await goto(url, options);
      await waitHydrated();
      return response;
    }) as typeof page.goto;

    const reload = page.reload.bind(page);
    page.reload = (async (options?: Parameters<typeof reload>[0]) => {
      const response = await reload(options);
      await waitHydrated();
      return response;
    }) as typeof page.reload;

    await provide(page);
  },
});

export { expect };

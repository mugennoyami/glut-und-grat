import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./fixtures";

/**
 * Automatische Prüfung mit axe-core (WCAG 2.x A/AA): Kontraste, Labels, ARIA, Landmarken.
 * Ersetzt keine manuelle Prüfung mit Screenreader und Tastatur, fängt aber die häufigsten Fehler ab.
 */
const pages = ["/", "/messer", "/messer/zunder", "/schaerfservice", "/massarbeit", "/werkstatt", "/kontakt", "/warenkorb", "/kasse", "/impressum"];

for (const path of pages) {
  test(`axe: ${path} hat keine Verstöße (WCAG A/AA)`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    // Einblend-Animationen abschließen lassen, damit Kontrastwerte stimmen
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length}× – ${v.nodes[0]?.target.join(" ")}`);
    expect(summary).toEqual([]);
  });
}

test("axe: Warenkorb-Schublade mit Inhalt", async ({ page }) => {
  await page.goto("/messer/funke");
  await page.getByTestId("add-to-cart").click();
  await expect(page.getByRole("dialog", { name: "Warenkorb" })).toBeVisible();
  await page.waitForTimeout(600);
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes[0]?.target.join(" ")}`)).toEqual([]);
});

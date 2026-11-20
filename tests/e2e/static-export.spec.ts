import { expect, test, tick } from "./fixtures";

/**
 * Prüft den statischen Export für GitHub Pages (`npm run build:pages`, ausgeliefert unter einem Basis-Pfad).
 * Läuft nur mit PW_STATIC_BASE_URL, z. B. http://localhost:4000/glut-und-grat/ (siehe README).
 * URLs sind bewusst relativ ("messer/"), damit der Basis-Pfad erhalten bleibt.
 */
test.skip(!process.env.PW_STATIC_BASE_URL, "PW_STATIC_BASE_URL nicht gesetzt");

test.describe("Statischer Export (GitHub Pages)", () => {
  test("lädt Seite, Schriften und Styles unter dem Basis-Pfad ohne Fehler", async ({ page }) => {
    const failed: string[] = [];
    const errors: string[] = [];
    page.on("response", (r) => {
      if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
    });
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });

    await page.goto("./");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Für deine nächste\s*Legende\./);
    // Tailwind/CSS wurde geladen (warmes Schwarz als Hintergrund)
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe("rgb(17, 15, 14)");
    // Schrift aus dem eigenen Export
    const fonts = await page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family);
    });
    expect(fonts.join(",")).toMatch(/Fraunces/);

    expect(failed).toEqual([]);
    expect(errors).toEqual([]);
  });

  test("Navigation und Direktaufruf von Unterseiten bleiben im Basis-Pfad", async ({ page, baseURL }) => {
    const base = new URL(baseURL!).pathname; // z. B. /glut-und-grat/
    await page.goto("./");
    await page.getByRole("navigation", { name: "Hauptnavigation" }).getByRole("link", { name: "Rüstkammer", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${base}ruestkammer/$`));
    await page.getByRole("link", { name: "Zunder ansehen" }).click();
    await expect(page).toHaveURL(new RegExp(`${base}messer/zunder/$`));
    await expect(page.getByRole("heading", { level: 1, name: "Zunder" })).toBeVisible();

    await page.goto("messer/esse/");
    await expect(page.getByRole("heading", { level: 1, name: "Esse" })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { level: 1, name: "Esse" })).toBeVisible();
  });

  test("unbekannte Adresse zeigt die 404-Seite", async ({ page }) => {
    const response = await page.goto("gibt-es-nicht/");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("erkaltet");
  });

  test("Warenkorb funktioniert und bleibt nach Neuladen erhalten", async ({ page }) => {
    await page.goto("messer/funke/");
    await page.getByTestId("add-to-cart").click();
    const drawer = page.getByRole("dialog", { name: "Warenkorb" });
    await expect(drawer.getByTestId("total")).toHaveText(/103,90/);
    await page.keyboard.press("Escape");
    await page.goto("warenkorb/");
    await expect(page.getByTestId("cart-lines")).toContainText("Funke");
    await page.getByRole("button", { name: /Menge erhöhen/ }).click();
    await expect(page.getByRole("complementary").getByTestId("total")).toHaveText(/201,90/);
    await page.reload();
    await expect(page.getByTestId("cart-count")).toHaveText("2");
  });

  test("Demo-Kasse rechnet im Browser, benennt das offen und ruft keine API auf", async ({ page }) => {
    const apiCalls: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/api/")) apiCalls.push(r.url());
    });
    await page.goto("messer/funke/");
    await page.getByTestId("add-to-cart").click();
    await page.goto("kasse/");
    await expect(page.getByTestId("demo-banner")).toContainText("keine echte Bestellung");
    await expect(page.getByText(/statische Demo ohne Server/)).toBeVisible();
    await page.getByLabel(/^Name/).fill("Erika Beispiel");
    await page.getByLabel(/^E-Mail/).fill("erika@beispiel.de");
    await page.getByLabel(/^Straße/).fill("Musterweg 1");
    await page.getByLabel(/^PLZ/).fill("12345");
    await page.getByLabel(/^Ort/).fill("Musterstadt");
    await tick(page.getByLabel(/Ich weiß, dass dies ein Demo-Durchlauf ist/));
    await page.getByTestId("demo-submit").click();
    const done = page.getByTestId("demo-done");
    await expect(done).toContainText("Statische Demo ohne Server");
    await expect(done).toContainText("keine Bestellung angelegt");
    await expect(done.getByTestId("total")).toHaveText(/103,90/);
    expect(apiCalls).toEqual([]);
  });

  test("Formulare behaupten keinen Versand und senden nichts", async ({ page }) => {
    const apiCalls: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/api/")) apiCalls.push(r.url());
    });
    await page.goto("schaerfservice/");
    await expect(page.getByText(/Das Absenden ist hier noch nicht aktiv/)).toBeVisible();
    await page.getByLabel(/Klingentyp/).selectOption("kueche-europaeisch");
    await page.getByLabel(/Anzahl/).fill("2");
    await page.getByLabel(/Ungefähre Klingenlänge/).fill("20");
    await page.getByText("Stumpf, sonst unversehrt").click();
    await page.getByLabel(/^Name/).fill("Erika Beispiel");
    await page.getByLabel(/^E-Mail/).fill("erika@beispiel.de");
    await tick(page.getByLabel(/Ich bin damit einverstanden/));
    await page.getByRole("button", { name: "Schärfanfrage absenden" }).click();
    const alert = page.getByRole("alert").filter({ hasText: "Nicht gesendet." });
    await expect(alert).toBeVisible();
    await expect(alert).toContainText("weder gesendet noch gespeichert");
    await expect(page.getByText("Anfrage übermittelt")).toHaveCount(0);
    expect(apiCalls).toEqual([]);
  });

  test("Werkstatt nennt David als Betreiber, ohne erfundene Biografie", async ({ page }) => {
    await page.goto("werkstatt/");
    await expect(page.getByRole("heading", { level: 2, name: "David" })).toBeVisible();
    await expect(page.getByText(/betreibe Glut & Grat allein/)).toBeVisible();
    await expect(page.getByText(/bewusst keine erfundene Biografie/)).toBeVisible();
  });

  test("Suchmaschinen sind ausgesperrt (noindex)", async ({ page }) => {
    await page.goto("./");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});

for (const slug of ["ruestungen", "schwerter", "larp", "katana"]) {
  test(`Kollektion ${slug} ist statisch erreichbar und behält den Anfragekontext`, async ({ page, baseURL }) => {
    const response = await page.goto(`ruestkammer/${slug}/`);
    expect(response?.status()).toBe(200);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.getByRole("link", { name: "Interesse anfragen" }).click();
    await expect(page).toHaveURL(url => url.pathname === `${new URL(baseURL!).pathname}massarbeit/`);
    await expect(page.getByLabel(/Ausgangsprodukt/)).toHaveValue(slug);
    await expect(page.getByRole("checkbox", { name: "Ausrüstung / Sortimentswunsch" })).toBeChecked();
  });
}

import { expect, test } from "./fixtures";

const pages = [
  "/",
  "/messer",
  "/messer/funke",
  "/messer/esse",
  "/messer/zunder",
  "/schaerfservice",
  "/massarbeit",
  "/werkstatt",
  "/kontakt",
  "/warenkorb",
  "/kasse",
  "/impressum",
  "/datenschutz",
  "/agb",
  "/widerruf",
];

test.describe("Seiten", () => {
  for (const path of pages) {
    test(`${path}: lädt ohne Fehler und ohne horizontalen Überlauf`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      expect(errors).toEqual([]);
    });
  }
});

test.describe("Startseite", () => {
  test("enthält Headline, beide Handlungsoptionen und höchstens drei Messer", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Aus Feuer geformt\.\s*Für deinen Alltag gemacht\./);
    await expect(page.getByRole("link", { name: "Messer entdecken" })).toHaveAttribute("href", "/messer");
    await expect(page.getByRole("link", { name: "Schärfservice anfragen" }).first()).toHaveAttribute("href", "/schaerfservice#anfrage");
    const knives = page.locator("#messer").getByRole("link", { name: "Zum Messer" });
    expect(await knives.count()).toBeLessThanOrEqual(3);
    expect(await knives.count()).toBe(3);
    await expect(page.locator("#schaerfservice")).toBeVisible();
    await expect(page.locator("#massarbeit")).toBeVisible();
    await expect(page.locator("#werkstatt")).toBeVisible();
    await expect(page.locator("#faq")).toBeVisible();
    await expect(page.locator("#kontakt")).toBeVisible();
  });

  test("Demo-Hinweis ist sichtbar, Footer verlinkt Rechtsseiten als Platzhalter", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("note").first()).toContainText("keine echten Angebote");
    for (const name of ["Impressum", "Datenschutz", "AGB", "Widerruf & Rückgabe"]) {
      await expect(page.getByRole("contentinfo").getByRole("link", { name })).toBeVisible();
    }
    await page.goto("/impressum");
    await expect(page.getByText("kein Rechtstext")).toBeVisible();
  });

  test("FAQ lässt sich per Tastatur öffnen", async ({ page }) => {
    await page.goto("/");
    const first = page.locator("#faq summary").first();
    await first.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#faq details").first()).toHaveAttribute("open", "");
  });

  test("Tastatur: Skip-Link führt zum Inhalt und Fokus ist sichtbar", async ({ page, isMobile }) => {
    test.skip(Boolean(isMobile), "Tastaturtest nur am Desktop");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Zum Inhalt springen" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("Navigation enthält Messer, Schärfservice, Maßarbeit, Werkstatt und Warenkorb", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) await page.getByRole("button", { name: "Menü öffnen" }).click();
    const nav = isMobile ? page.getByRole("navigation", { name: "Mobile Navigation" }) : page.getByRole("navigation", { name: "Hauptnavigation" });
    for (const name of ["Messer", "Schärfservice", "Maßarbeit", "Werkstatt"]) {
      await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
    }
    if (isMobile) await page.keyboard.press("Escape");
    await expect(page.getByTestId("cart-button")).toBeVisible();
  });

  test("reduzierte Bewegung: Inhalte sind sofort sichtbar, Funken ausgeblendet", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("[data-reveal='hidden']")).toHaveCount(0);
    await expect(page.locator(".ember").first()).toBeHidden();
    await context.close();
  });
});

test.describe("API", () => {
  test("Zahlungs-Webhook ist ohne Konfiguration abgeschaltet", async ({ request }) => {
    const res = await request.post("/api/webhooks/payments", { data: { id: "x" } });
    expect(res.status()).toBe(501);
  });

  test("Preise aus dem Browser werden ignoriert", async ({ request }) => {
    const res = await request.post("/api/checkout/quote", {
      data: { lines: [{ productId: "esse", options: {}, quantity: 1, unitPriceCents: 1 }] },
    });
    const body = await res.json();
    expect(body.quote.subtotalCents).toBe(16800);
    expect(body.quote.totalCents).toBe(17390);
  });

  test("robots.txt sperrt die Vorschau für Suchmaschinen", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(await res.text()).toMatch(/Disallow: \//);
  });
});

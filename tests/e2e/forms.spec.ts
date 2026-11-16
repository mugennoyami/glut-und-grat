import { expect, test } from "./fixtures";

test.describe("Schärfformular", () => {
  test("zeigt bei fehlenden Angaben Fehler mit Labels, Zusammenfassung und aria-invalid", async ({ page }) => {
    await page.goto("/schaerfservice");
    await expect(page.getByText(/Das Absenden ist hier noch nicht aktiv/)).toBeVisible();
    await page.getByRole("button", { name: "Schärfanfrage absenden" }).click();

    const summary = page.getByRole("alert").filter({ hasText: "Bitte prüfe" });
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
    await expect(page.getByLabel(/Klingentyp/)).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel(/Ungefähre Klingenlänge/)).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Bitte wähle einen Klingentyp.").first()).toBeVisible();
    await expect(page.getByText("Bitte bestätige den Hinweis zur Verarbeitung deiner Angaben.").first()).toBeVisible();
  });

  test("Fehler-Link springt zum Feld", async ({ page }) => {
    await page.goto("/schaerfservice");
    await page.getByRole("button", { name: "Schärfanfrage absenden" }).click();
    await page.getByRole("button", { name: "Bitte wähle einen Klingentyp." }).click();
    await expect(page.getByLabel(/Klingentyp/)).toBeFocused();
  });

  test("Zahlenfelder werden geprüft (Anzahl, Länge)", async ({ page }) => {
    await page.goto("/schaerfservice");
    await page.getByLabel(/Anzahl/).fill("0");
    await page.getByLabel(/Ungefähre Klingenlänge/).fill("abc");
    await page.getByRole("button", { name: "Schärfanfrage absenden" }).click();
    await expect(page.getByText("Mindestens ein Messer.").first()).toBeVisible();
    await expect(page.getByText("Bitte gib die ungefähre Klingenlänge in Zentimetern an.").first()).toBeVisible();
  });

  test("Schwert zeigt Prüfhinweis; gültige Anfrage wird ohne Backend NICHT als gesendet gemeldet", async ({ page }) => {
    await page.goto("/schaerfservice");
    await page.getByLabel(/Klingentyp/).selectOption("schwert");
    await expect(page.getByText(/nur nach individueller Prüfung angenommen/)).toBeVisible();

    await page.getByLabel(/Anzahl/).fill("1");
    await page.getByLabel(/Ungefähre Klingenlänge/).fill("72,5");
    await page.getByText("Kleine Scharten oder Ausbrüche").click();
    await page.getByLabel(/Besondere Wünsche/).fill("Einhändig geführt, Rost an der Spitze.");
    await page.getByLabel(/^Name/).fill("Erika Beispiel");
    await page.getByLabel(/^E-Mail/).fill("erika@beispiel.de");
    await page.getByLabel(/Ich bin damit einverstanden/).check({ force: true });

    const requests: { status: number }[] = [];
    page.on("response", (r) => {
      if (r.url().endsWith("/api/inquiries") && r.request().method() === "POST") requests.push({ status: r.status() });
    });

    await page.getByRole("button", { name: "Schärfanfrage absenden" }).click();
    const alert = page.getByRole("alert").filter({ hasText: "Nicht gesendet." });
    await expect(alert).toBeVisible();
    await expect(alert).toContainText("weder gesendet noch gespeichert");
    await expect(page.getByText("Anfrage übermittelt")).toHaveCount(0);
    expect(requests.map((r) => r.status)).toEqual([503]);

    // Eingaben bleiben im Tab erhalten
    await expect(page.getByLabel(/^Name/)).toHaveValue("Erika Beispiel");
    await expect(page.getByLabel(/Ungefähre Klingenlänge/)).toHaveValue("72,5");
    // … aber nicht im Browser-Speicher
    const keys = await page.evaluate(() => Object.keys(window.localStorage).concat(Object.keys(window.sessionStorage)));
    expect(keys.filter((k) => !k.startsWith("glutgrat.cart"))).toEqual([]);
    const stored = await page.evaluate(() => JSON.stringify({ ...window.localStorage, ...window.sessionStorage }));
    expect(stored).not.toContain("erika");
  });
});

test.describe("Maßarbeit-Formular", () => {
  test("übernimmt das Produkt aus der Adresse und validiert Pflichtfelder", async ({ page }) => {
    await page.goto("/massarbeit?produkt=esse");
    await expect(page.getByLabel(/Ausgangsprodukt/)).toHaveValue("esse");
    await page.getByRole("button", { name: "Projekt anfragen" }).click();
    await expect(page.getByText("Bitte wähle, ob es um Griff, Scheide oder beides geht.").first()).toBeVisible();
    await expect(page.getByText("Bitte wähle mindestens ein Material oder „Beratung gewünscht“.").first()).toBeVisible();
    await expect(page.getByText("Bitte wähle einen Stil.").first()).toBeVisible();
    await expect(page.getByText("Bitte wähle einen Budgetrahmen.").first()).toBeVisible();
    await expect(page.getByText(/Bitte beschreibe dein Projekt in mindestens 20 Zeichen/).first()).toBeVisible();
  });

  test("vollständige Anfrage ohne Backend: ehrliche Rückmeldung, Kopierfunktion", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => {});
    await page.goto("/massarbeit");
    await page.getByLabel(/Ausgangsprodukt/).selectOption("zunder");
    await page.getByRole("group", { name: /Was soll gestaltet werden/ }).getByText("Griff", { exact: true }).click();
    await page.getByRole("group", { name: /Materialwunsch/ }).getByText("Walnuss", { exact: true }).click();
    await page.getByRole("radiogroup", { name: /^Stil/ }).getByText("Klassisch", { exact: true }).click();
    await page.getByLabel(/Budgetrahmen/).selectOption("100-200");
    await page.getByLabel(/Beschreibung/).fill("Ein dunkler Griff mit schmalem Kupferring, dazu eine schlichte Scheide.");
    await page.getByLabel(/^Name/).fill("Erika Beispiel");
    await page.getByLabel(/^E-Mail/).fill("erika@beispiel.de");
    await page.getByLabel(/Ich bin damit einverstanden/).check({ force: true });
    await page.getByRole("button", { name: "Projekt anfragen" }).click();

    await expect(page.getByRole("alert").filter({ hasText: "Nicht gesendet." })).toBeVisible();
    await expect(page.getByText("Anfrage übermittelt")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Anfrage als Text kopieren" })).toBeVisible();
  });
});

test.describe("Kontaktformular", () => {
  test("auf der Startseite: Validierung und ehrliches Ergebnis", async ({ page }) => {
    await page.goto("/#kontakt");
    await page.getByRole("button", { name: "Nachricht absenden" }).click();
    await expect(page.getByText(/Bitte schreib mindestens 10 Zeichen|Bitte schreib uns/).first()).toBeVisible();

    await page.getByLabel(/^Nachricht/).fill("Eine Frage zum Schärfservice bitte.");
    await page.getByLabel(/^Name/).fill("Erika Beispiel");
    await page.getByLabel(/^E-Mail/).fill("erika@beispiel.de");
    await page.getByLabel(/Ich bin damit einverstanden/).check({ force: true });
    await page.getByRole("button", { name: "Nachricht absenden" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Nicht gesendet." })).toBeVisible();
  });
});

import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const nbsp = (s: string | null) => (s ?? "").replace(/\u00a0/g, " ").trim();

async function addFunke(page: Page, opts: { holz?: RegExp } = {}) {
  await page.goto("/messer/funke");
  if (opts.holz) await page.getByRole("radio", { name: opts.holz }).check({ force: true });
  await page.getByTestId("add-to-cart").click();
}

test.describe("Produktseite", () => {
  test("zeigt Daten, Galerie und Beispiel-Hinweise", async ({ page }) => {
    await page.goto("/messer/esse");
    await expect(page.getByRole("heading", { level: 1, name: "Esse" })).toBeVisible();
    await expect(page.getByText("Klingenlänge").first()).toBeVisible();
    await expect(page.getByText("120 mm").first()).toBeVisible();
    await expect(page.getByText("245 mm").first()).toBeVisible();
    await expect(page.getByText(/Beispielangabe/).first()).toBeVisible();
    await expect(page.getByText(/Konzeptdarstellung/).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Bild 3 von 4/ })).toBeVisible();
    await page.getByRole("button", { name: /Bild 4 von 4/ }).click();
    await expect(page.getByText("4 / 4 · Maße")).toBeVisible();
  });

  test("Preis folgt der Variantenwahl; nicht verfügbare Variante ist gesperrt", async ({ page }) => {
    await page.goto("/messer/esse");
    const price = page.getByTestId("product-price");
    await expect(price).toHaveText(/168,00/);
    await page.getByRole("radio", { name: /Räuchereiche/ }).check({ force: true });
    await expect(price).toHaveText(/178,00/);
    await page.getByRole("radio", { name: /Klingenschutz aus Leder/ }).check({ force: true });
    await expect(price).toHaveText(/202,00/);
    await expect(page.getByRole("radio", { name: /Esche/ })).toBeDisabled();
  });

  test("unbekannte Produkte führen auf die 404-Seite", async ({ page }) => {
    const response = await page.goto("/messer/gibt-es-nicht");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("erkaltet");
  });
});

test.describe("Warenkorb", () => {
  test("Hinzufügen öffnet die Schublade mit korrekten Summen und Zähler", async ({ page }) => {
    await addFunke(page);
    const drawer = page.getByRole("dialog", { name: "Warenkorb" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText("Funke").first()).toBeVisible();
    await expect(drawer.getByTestId("subtotal")).toHaveText(/98,00/);
    await expect(drawer.getByTestId("total")).toHaveText(/103,90/);
    await drawer.getByRole("button", { name: /schließen/ }).click();
    await expect(page.getByTestId("cart-count")).toHaveText("1");
  });

  test("Schublade schließt mit Escape", async ({ page }) => {
    await addFunke(page);
    const drawer = page.getByRole("dialog", { name: "Warenkorb" });
    await expect(drawer).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  });

  test("Mengen ändern, Summen stimmen, Entfernen leert den Warenkorb", async ({ page }) => {
    await addFunke(page, { holz: /Räuchereiche/ }); // 98 + 6 = 104
    await page.goto("/warenkorb");
    await expect(page.getByTestId("subtotal")).toHaveText(/104,00/);
    await expect(page.getByTestId("total")).toHaveText(/109,90/);

    await page.getByRole("button", { name: /Menge erhöhen/ }).click();
    await expect(page.getByTestId("subtotal")).toHaveText(/208,00/);
    await expect(page.getByTestId("total")).toHaveText(/213,90/);
    await expect(page.getByTestId("cart-count")).toHaveText("2");

    await page.getByRole("button", { name: /Menge verringern/ }).click();
    await expect(page.getByTestId("subtotal")).toHaveText(/104,00/);

    await page.getByRole("button", { name: /aus dem Warenkorb entfernen/ }).click();
    await expect(page.getByTestId("cart-empty")).toBeVisible();
    await expect(page.getByTestId("cart-count")).toHaveCount(0);
  });

  test("Maximalmenge wird begrenzt", async ({ page }) => {
    await addFunke(page);
    await page.goto("/warenkorb");
    const plus = page.getByRole("button", { name: /Menge erhöhen|Maximale Menge erreicht/ });
    for (let i = 0; i < 8; i += 1) {
      if (await plus.isDisabled()) break;
      await plus.click();
    }
    await expect(page.getByRole("button", { name: /Maximale Menge erreicht/ })).toBeDisabled();
    await expect(page.getByTestId("cart-count")).toHaveText("5"); // Funke: max. 5
  });

  test("bleibt über Seitenwechsel, Neuladen und neue Tabs desselben Browsers erhalten", async ({ page, context }) => {
    await addFunke(page);
    await page.goto("/werkstatt");
    await expect(page.getByTestId("cart-count")).toHaveText("1");
    await page.reload();
    await expect(page.getByTestId("cart-count")).toHaveText("1");

    // „Browserneustart“: neue Seite im selben Browserprofil
    const reopened = await context.newPage();
    await reopened.goto("/warenkorb");
    await reopened.waitForFunction(() => document.documentElement.dataset.hydrated === "true");
    await expect(reopened.getByTestId("cart-lines")).toContainText("Funke");
    await expect(reopened.getByTestId("total")).toHaveText(/103,90/);

    const stored = await reopened.evaluate(() => window.localStorage.getItem("glutgrat.cart.v1"));
    expect(stored).not.toBeNull();
    expect(stored).not.toMatch(/price|cents|€/i); // es werden keine Preise gespeichert
  });

  test("manipulierter Speicher wird bereinigt", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      window.localStorage.setItem(
        "glutgrat.cart.v1",
        JSON.stringify([
          { productId: "funke", options: { griff: "walnuss" }, quantity: 2 },
          { productId: "boese", options: {}, quantity: 1 },
          { productId: "esse", options: { griff: "esche" }, quantity: 1 },
          { productId: "zunder", options: {}, quantity: 9999 },
        ]),
      );
    });
    await page.goto("/warenkorb");
    await expect(page.getByTestId("cart-lines").getByRole("listitem")).toHaveCount(2);
    await expect(page.getByTestId("cart-count")).toHaveText("5"); // 2 Funke + 3 Zunder (Maximum)
  });
});

test.describe("Demo-Kasse", () => {
  test("ist eindeutig als Demo gekennzeichnet, validiert und löst nichts aus", async ({ page }) => {
    await addFunke(page);
    await page.goto("/kasse");

    await expect(page.getByTestId("demo-banner")).toContainText("Demo-Kasse – keine echte Bestellung");
    await expect(page.getByText(/keine echten Zahlungsdaten/)).toBeVisible();
    await expect(page.getByText(/Summen vom Server/)).toBeVisible();
    await expect(page.getByRole("complementary").getByTestId("total")).toHaveText(/103,90/);

    // Es dürfen nur Positionen an den Server gehen – keine Kontaktdaten, keine Preise.
    const sent: string[] = [];
    page.on("request", (req) => {
      if (req.method() === "POST" && req.url().includes("/api/")) sent.push(req.postData() ?? "");
    });

    await page.getByTestId("demo-submit").click();
    await expect(page.getByRole("alert").first()).toContainText("Bitte prüfe");

    await page.getByLabel(/^Name/).fill("Erika Beispiel");
    await page.getByLabel(/^E-Mail/).fill("erika@beispiel.de");
    await page.getByLabel(/^Straße/).fill("Musterweg 1");
    await page.getByLabel(/^PLZ/).fill("12345");
    await page.getByLabel(/^Ort/).fill("Musterstadt");
    await page.getByLabel(/Ich weiß, dass dies ein Demo-Durchlauf ist/).check({ force: true });
    await page.getByTestId("demo-submit").click();

    const done = page.getByTestId("demo-done");
    await expect(done).toBeVisible();
    await expect(done).toContainText("keine Bestellung angelegt");
    await expect(done).toContainText("keine Zahlung ausgelöst");
    expect(nbsp(await done.getByTestId("total").textContent())).toBe("103,90 €");

    expect(sent.length).toBeGreaterThan(0);
    for (const body of sent) {
      expect(body).not.toContain("Erika");
      expect(body).not.toContain("erika@");
      expect(body).not.toContain("Musterweg");
      expect(body).not.toMatch(/priceCents|unitPrice|total/i);
    }
  });

  test("leerer Warenkorb führt zurück zum Shop", async ({ page }) => {
    await page.goto("/kasse");
    await expect(page.getByTestId("checkout-empty")).toBeVisible();
  });
});

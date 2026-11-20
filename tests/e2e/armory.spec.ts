import { expect, test, tick } from "./fixtures";

for (const slug of ["ruestungen", "schwerter", "larp", "katana"]) {
  test(`${slug}: geplante Kollektion führt zur passenden Anfrage, nicht zur Kasse`, async ({ page }) => {
    await page.goto(`/ruestkammer/${slug}`);
    await expect(page.getByText(/Kollektion .* · In Planung/)).toBeVisible();
    await expect(page.getByTestId("add-to-cart")).toHaveCount(0);
    await page.getByRole("link", { name: "Interesse anfragen" }).click();
    await expect(page.getByLabel("Ausgangsprodukt", { exact: false })).toHaveValue(slug);
    await expect(page.getByRole("checkbox", { name: "Ausrüstung / Sortimentswunsch" })).toBeChecked();
    await tick(page.getByRole("checkbox", { name: "Noch offen – Beratung gewünscht" }));
    await tick(page.getByRole("radio", { name: "Fantasy / Rollenspiel" }));
    await page.getByLabel(/Budgetrahmen/).selectOption("offen");
    await page.getByLabel(/Beschreibung/).fill("Ich plane einen Charakter für einen Mittelaltermarkt und wünsche Beratung zur Ausrüstung.");
    await page.getByLabel(/^Name/).fill("Erika Beispiel");
    await page.getByLabel(/^E-Mail/).fill("erika@beispiel.de");
    await tick(page.getByLabel(/Ich bin damit einverstanden/));
    await page.getByRole("button", { name: "Projekt anfragen" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Nicht gesendet." })).toBeVisible();
    await expect(page.getByRole("button", { name: /Anfrage als Text kopieren/ })).toBeVisible();
  });
}

test("Rüstkammer verbindet Kategorien mit dem bestehenden Demo-Shop", async ({ page }) => {
  await page.goto("/ruestkammer");
  await page.getByRole("link", { name: "Messer im Demo-Shop", exact: true }).click();
  await page.getByRole("link", { name: "Zunder ansehen" }).click();
  await page.getByTestId("add-to-cart").click();
  await expect(page.getByRole("dialog", { name: "Warenkorb" })).toContainText("Zunder");
});

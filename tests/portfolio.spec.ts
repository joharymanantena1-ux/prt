import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const sizes = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];

/* L'écran d'accueil ne se joue qu'à la première visite : on le marque comme vu
   pour tous les tests, sauf ceux qui l'étudient (ils lèvent le drapeau eux-mêmes,
   les scripts d'init s'exécutant dans l'ordre d'ajout). */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("portfolio-intro-seen", "1"),
  );
});

for (const width of sizes) {
  test(`layout and navigation at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1080 });
    await page.addInitScript(() =>
      localStorage.setItem("cookie-consent", "denied"),
    );
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const action = page.locator(".hero-actions .button-primary");
    const box = await action.boundingBox();
    expect(box!.y + box!.height).toBeLessThan(width < 768 ? 620 : 1000);
    await expect(page.locator("#accueil")).not.toContainText("Disponible");
    for (const id of [
      "accueil",
      "projets",
      "apropos",
      "competences",
      "parcours",
      "contact",
    ]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id} h1, #${id} h2`).first()).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.locator(".archive-toggle").click();
    await expect(page.locator(".archive-content")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator(".archive-toggle").click();
    if (width < 768) {
      await page
        .getByRole("button", { name: "Ouvrir le menu", exact: true })
        .click();
      await expect(page.locator("#mobile-menu")).toBeVisible();
      await page.locator('#mobile-menu a[href="#projets"]').click();
      await expect(page.locator("#mobile-menu")).not.toBeVisible();
      await expect(page).toHaveURL(/#projets$/);
      await expect
        .poll(() =>
          page
            .locator("#projets")
            .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
        )
        .toBe(80);
    }
    expect(errors).toEqual([]);
  });
}

test("mobile dialog traps focus, closes with Escape and restores scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  const trigger = page.getByRole("button", {
    name: "Ouvrir le menu",
    exact: true,
  });
  await trigger.click();
  await expect(
    page.getByRole("button", { name: "Fermer le menu", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  expect(
    await page.evaluate(
      () => document.activeElement?.closest("dialog") !== null,
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  await trigger.click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator("#mobile-menu")).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("archive separates professional work from an academic modal", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  await page.locator(".archive-toggle").click();

  const pro = page.locator(".archive-group").first();
  const academic = page.locator(".archive-academic");
  await expect(pro.locator("h3")).toContainText(
    "Autres missions professionnelles",
  );
  await expect(pro.locator(".archive-row")).toHaveCount(10);
  // Les études de cas racontées au-dessus ne sont pas répétées ici.
  await expect(pro).not.toContainText("BeautyBay – Web & Mobile");

  // La formation tient en cinq lignes d'aperçu : aucun détail sur la page.
  await expect(academic.locator("h3")).toContainText("31 projets");
  await expect(academic.locator(".academic-preview li")).toHaveCount(5);
  await expect(academic.locator(".archive-row")).toHaveCount(0);
  await expect(academic).not.toContainText("Objectif :");

  // La recherche des missions ne touche pas l'aperçu.
  await page.getByRole("searchbox").fill("Shopify");
  await expect(pro.locator(".archive-row")).toHaveCount(4);
  await expect(academic.locator(".academic-preview li")).toHaveCount(5);
  await page.getByRole("searchbox").fill("no-such-project");
  await expect(pro.locator(".archive-row")).toHaveCount(0);
  await expect(pro.locator(".archive-empty")).toBeVisible();
  await page.getByRole("searchbox").fill("");
  await expect(pro.locator(".archive-row")).toHaveCount(10);
});

test("the academic modal opens, filters, traps focus and closes three ways", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  await page.locator(".archive-toggle").click();

  const modal = page.locator(".modal");
  const open = page.getByRole("button", {
    name: "Voir les projets académiques",
  });
  const close = page.getByRole("button", {
    name: "Fermer les projets académiques",
  });

  await expect(modal).toBeHidden();
  await open.click();
  await expect(modal).toBeVisible();
  await expect(modal.getByRole("heading", { level: 2 })).toHaveText(
    "Projets académiques",
  );
  // Tout le détail vit dans la modale : thèmes, objectif, acquis, 31 projets.
  await expect(modal.locator(".theme-block")).toHaveCount(5);
  await expect(modal.locator(".theme-goal").first()).toContainText(
    "Objectif :",
  );
  await expect(modal.locator(".theme-learned").first()).toContainText(
    "Ce que j\u2019en retiens",
  );
  await expect(modal.locator(".archive-row")).toHaveCount(31);
  // L'arrière-plan ne défile plus derrière la modale.
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );

  // Recherche propre à la modale.
  const search = modal.getByRole("searchbox");
  await search.fill("Huffman");
  await expect(modal.locator(".archive-row")).toHaveCount(1);
  await modal.locator(".archive-row summary").click();
  await expect(modal.locator(".archive-row")).toContainText("compression");
  await search.fill("aucun-projet");
  await expect(modal.locator(".archive-empty")).toBeVisible();
  await expect(modal.locator('[role="status"]')).toContainText("0 projets");
  await search.fill("");

  // Le focus reste dans la modale.
  await close.focus();
  await page.keyboard.press("Shift+Tab");
  expect(
    await page.evaluate(
      () => document.activeElement?.closest("dialog") !== null,
    ),
  ).toBe(true);

  // 1. Échap
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  await expect(open).toBeFocused();

  // 2. le bouton de fermeture
  await open.click();
  await expect(modal).toBeVisible();
  await close.click();
  await expect(modal).toBeHidden();

  // 3. le clic sur le fond
  await open.click();
  await expect(modal).toBeVisible();
  await page.mouse.click(6, 6);
  await expect(modal).toBeHidden();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("the academic modal fills the screen on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  await page.locator(".archive-toggle").click();
  await page
    .getByRole("button", { name: "Voir les projets académiques" })
    .click();
  const modal = page.locator(".modal");
  await expect(modal).toBeVisible();
  const box = (await modal.boundingBox())!;
  expect(box.width).toBe(390);
  expect(box.height).toBeGreaterThan(820);
  // L'en-tête et la fermeture restent visibles quand on parcourt la liste.
  await modal.locator(".modal-body").evaluate((el) => el.scrollBy(0, 1200));
  await expect(
    page.getByRole("button", { name: "Fermer les projets académiques" }),
  ).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("language and theme persist; English and light mode fit the narrowest screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  await page.getByRole("button", { name: "Switch to English" }).click();
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator(".hero-title")).toHaveText(
    "Code.Purpose.Real impact.",
  );
  for (const id of [
    "accueil",
    "projets",
    "apropos",
    "competences",
    "parcours",
    "contact",
  ]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("brand marks load and keep the client names readable", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Refuser", exact: true }).click();

  // Le mur de logos clients : les noms restent dans le DOM pour les lecteurs
  // d'écran (et en repli si le navigateur ne masque pas).
  const wall = page.locator(".client-names");
  for (const name of [
    "Paul Beuscher",
    "Musier Paris",
    "The Cool Republic",
    "Finger in the Nose",
  ]) {
    await expect(wall).toContainText(name);
  }
  await expect(wall.locator(".brand-mark")).toHaveCount(4);

  // Les missions professionnelles portent leur marque, alignées sur la même
  // gouttière ; les projets académiques n'en ont pas.
  await page.locator(".archive-toggle").click();
  const pro = page.locator(".archive-group").first();
  await expect(pro.locator(".archive-row-mark")).toHaveCount(10);
  await expect(pro.locator(".archive-row-mark .brand-mark")).toHaveCount(8);
  await expect(page.locator(".archive-academic .archive-row-mark")).toHaveCount(
    0,
  );

  // Chaque masque doit vraiment se charger : un asset renommé ne casse rien
  // visiblement, la marque disparaît juste en silence.
  const urls = await page
    .locator(".brand-mark")
    .evaluateAll((els) => [
      ...new Set(
        els.map((el) =>
          getComputedStyle(el).maskImage.replace(/^url\("?|"?\)$/g, ""),
        ),
      ),
    ]);
  expect(urls.length).toBeGreaterThan(4);
  for (const url of urls) {
    expect(url, "mask-image must be set").toMatch(/^https?:/);
    const response = await page.request.get(url);
    expect(response.status(), `${url} should be served`).toBe(200);
  }
});

test("scroll reveals end up visible and never keep content hidden", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  // Below the fold, blocks start hidden; walking the page must reveal them all.
  await expect(
    page.locator('.reveal[data-revealed="false"]').first(),
  ).toBeAttached();
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
  });
  // Marge large : sous charge, la traversée de la page et les transitions de
  // 0,65 s peuvent dépasser le délai d'attente par défaut.
  await expect
    .poll(() => page.locator('.reveal[data-revealed="false"]').count(), {
      timeout: 20000,
    })
    .toBe(0);
  // …and the fade must actually finish, not stay stuck mid-transition.
  await expect
    .poll(
      () =>
        page
          .locator(".reveal")
          .evaluateAll(
            (els) =>
              els.filter((el) => Number(getComputedStyle(el).opacity) < 1)
                .length,
          ),
      { timeout: 20000 },
    )
    .toBe(0);
});

test("an unknown path renders the branded 404 instead of the portfolio", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/cette-page-nexiste-pas");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "n’existe pas",
  );
  await expect(page.locator("#accueil")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: /Retour au portfolio/ }),
  ).toHaveAttribute("href", "/");
  expect(errors).toEqual([]);
});

test.describe("welcome screen", () => {
  // Les scripts d'init s'ajoutent dans l'ordre : celui-ci défait le drapeau
  // posé par le beforeEach, on retrouve donc une première visite.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() =>
      localStorage.removeItem("portfolio-intro-seen"),
    );
  });

  test("plays on the first visit, can be skipped, and never replays", async ({
    page,
  }) => {
    await page.goto("/");
    const intro = page.locator("#intro");
    await expect(intro).toBeVisible();
    // Le hero est déjà rendu dessous : l'écran couvre, il ne bloque pas le rendu.
    await expect(page.locator(".hero-title")).toHaveCount(1);
    await expect(intro).toContainText("Johary Manantena");
    await expect(
      page.getByRole("dialog", { name: "Écran d’accueil" }),
    ).toBeVisible();

    const skip = page.getByRole("button", { name: "Passer" });
    await expect(skip).toBeVisible();
    await skip.click();
    await expect(intro).toHaveCount(0);
    // La page redevient défilable et la navigation fonctionne.
    expect(
      await page.evaluate(() =>
        document.documentElement.classList.contains("intro-active"),
      ),
    ).toBe(false);
    await page.locator('.hero-actions a[href="#projets"]').click();
    await expect(page).toHaveURL(/#projets$/);

    // Une seule fois par navigateur.
    expect(
      await page.evaluate(() => localStorage.getItem("portfolio-intro-seen")),
    ).toBe("1");
    await page.goto("/");
    await expect(page.locator("#intro")).toHaveCount(0);
  });

  test("closes on its own and stays out of the way", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#intro")).toBeVisible();
    // 5,6 s d'animation puis 0,5 s de sortie.
    await expect(page.locator("#intro")).toHaveCount(0, { timeout: 9000 });
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  });

  test("passes a WCAG audit while it is on screen", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const theme of ["dark", "light"]) {
      await page.addInitScript(
        (t) => localStorage.setItem("portfolio-theme", t),
        theme,
      );
      await page.goto("/");
      await expect(page.locator("#intro")).toBeVisible();
      // On audite l'état posé : pendant le fondu d'entrée, axe mesure le
      // contraste d'un texte encore à opacité 0 et signale un faux positif.
      await page.waitForTimeout(1900);
      const audit = await new AxeBuilder({ page })
        .include("#intro")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(audit.violations, `intro in ${theme} mode`).toEqual([]);
    }
  });

  test("never plays under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("#intro")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test("analytics makes no request before consent and refusal persists", async ({
  page,
}) => {
  const analytics: string[] = [];
  page.on("request", (request) => {
    if (/googletagmanager|google-analytics/.test(request.url()))
      analytics.push(request.url());
  });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Accepter", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  await page.reload();
  await expect(page.locator(".cookie-banner")).toHaveCount(0);
  expect(analytics).toEqual([]);
});

test("analytics loads after explicit acceptance", async ({ page }) => {
  await page.route("https://www.googletagmanager.com/**", (route) =>
    route.fulfill({ body: "", contentType: "text/javascript" }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Accepter", exact: true }).click();
  await expect(page.locator("#portfolio-analytics")).toHaveCount(1);
  expect(
    await page.evaluate(() => localStorage.getItem("cookie-consent")),
  ).toBe("granted");
});

for (const status of ["success", "failure"] as const) {
  test(`contact form handles ${status} without sending real messages`, async ({
    page,
  }) => {
    let payload: Record<string, string> | undefined;
    await page.route("**/.netlify/functions/contact", async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({
        status: status === "success" ? 200 : 500,
        json: { result: status === "success" ? "success" : "error" },
      });
    });
    await page.goto("/");
    await page.getByRole("button", { name: "Refuser", exact: true }).click();
    await page.locator(".contact-form-details summary").click();
    await page.getByLabel("Nom", { exact: true }).fill("Portfolio QA");
    await page.getByLabel("Email", { exact: true }).fill("test@example.com");
    await page.getByLabel("Sujet", { exact: true }).fill("Interface test");
    await page
      .getByLabel("Message", { exact: true })
      .fill("This message is intercepted by the browser test.");
    await page.locator('input[name="consent"]').check();
    await page.getByRole("button", { name: "Envoyer le message" }).click();
    await expect(page.locator(".form-submit p")).toContainText(
      status === "success" ? "Merci" : "Erreur",
    );
    expect(payload?.name).toBe("Portfolio QA");
    expect(payload?.company).toBe("");
    if (status === "failure")
      await expect(page.getByLabel("Message", { exact: true })).not.toHaveValue(
        "",
      );
  });
}

for (const width of [390, 1440]) {
  for (const theme of ["dark", "light"]) {
    test(`WCAG audit at ${width}px in ${theme} mode with reduced motion`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(
        (theme) => localStorage.setItem("portfolio-theme", theme),
        theme,
      );
      await page.goto("/");
      await page.getByRole("button", { name: "Refuser", exact: true }).click();
      await page.locator(".contact-form-details summary").click();
      await page.locator(".archive-toggle").click();
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(audit.violations).toEqual([]);

      // La modale, une fois ouverte, est auditée à part (le reste de la page
      // est inerte, axe n'y verrait plus rien).
      await page
        .getByRole("button", { name: "Voir les projets académiques" })
        .click();
      await expect(page.locator(".modal")).toBeVisible();
      const modalAudit = await new AxeBuilder({ page })
        .include(".modal")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(modalAudit.violations).toEqual([]);
      expect(
        await page
          .locator(".hero-line > span")
          .first()
          .evaluate((el) => getComputedStyle(el).animationName),
      ).toBe("none");
    });
  }
}

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
    // La liste des missions vit sur la page : on déplie un détail au passage.
    await expect(page.locator(".mission-row")).toHaveCount(10);
    await page.locator(".mission-row summary").first().click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator(".mission-row summary").first().click();
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

test("case studies show little text and open a detailed, browsable modal", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Refuser", exact: true }).click();

  // La vitrine reste légère : nom, accroche, trois technos, un bouton.
  const panels = page.locator(".showcase-panel");
  await expect(panels).toHaveCount(3);
  for (const name of ["BeautyBay", "Levitation", "Konecta"]) {
    await expect(
      page
        .locator(".showcase")
        .getByRole("heading", { level: 3, name, exact: true }),
    ).toBeVisible();
  }
  await expect(page.locator(".showcase")).not.toContainText("L’enjeu");
  await expect(panels.first().locator(".showcase-tags li")).toHaveCount(3);

  // Tout le panneau est cliquable, pas seulement le bouton : on clique sur le
  // nom, en haut de la pile (avant que le panneau suivant ne le recouvre).
  const modal = page.locator(".modal-case");
  await page.evaluate(() => {
    const top = document
      .querySelector(".showcase")!
      .getBoundingClientRect().top;
    window.scrollTo({ top: scrollY + top - 140, behavior: "instant" });
  });
  const title = await panels.first().locator("h3").boundingBox();
  await page.mouse.click(title!.x + 20, title!.y + title!.height / 2);
  await expect(modal).toBeVisible();
  await expect(modal.getByRole("heading", { level: 2 })).toHaveText(
    "BeautyBay",
  );
  await expect(modal.locator(".case-story")).toContainText("L’enjeu");
  await expect(
    modal.getByRole("link", { name: /Voir le site/ }),
  ).toHaveAttribute("href", "https://www.beautybay.com");

  // D'une étude de cas à l'autre sans refermer ; le focus reste en place.
  const next = modal.locator(".case-detail-nav button").last();
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(modal.getByRole("heading", { level: 2 })).toHaveText(
    "Levitation",
  );
  await expect(next).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(modal.getByRole("heading", { level: 2 })).toHaveText("Konecta");
  await expect(modal).toContainText("Présentation sur demande");
  await page.keyboard.press("Enter");
  await expect(modal.getByRole("heading", { level: 2 })).toHaveText(
    "BeautyBay",
  );

  // Échap ferme et rend le focus au bouton du panneau d'origine.
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();
  await expect(panels.first().locator(".showcase-open")).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");

  // Pile formée (les trois panneaux collés) : en remontant au clavier, le
  // bouton du premier panneau ne doit pas rester caché sous les autres.
  await page.setViewportSize({ width: 1440, height: 900 });
  // Défilement instantané : sinon on mesurerait un bouton encore hors écran.
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  await panels.last().locator(".showcase-open").focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Shift+Tab");
  const first = panels.first().locator(".showcase-open");
  await expect(first).toBeFocused();
  const box = (await first.boundingBox())!;
  const covered = await page.evaluate(
    ({ x, y }) =>
      !document
        .elementFromPoint(x, y)
        ?.closest(".showcase-item")
        ?.contains(document.activeElement),
    { x: box.x + box.width / 2, y: box.y + box.height / 2 },
  );
  expect(covered, "focused button hidden under another panel").toBe(false);
});

test("professional missions stay on the page, coursework lives in the modal", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Refuser", exact: true }).click();

  // Les missions sont lisibles sans ouvrir quoi que ce soit.
  const missions = page.locator(".mission-list");
  await expect(missions.getByRole("heading", { level: 3 })).toHaveText(
    "Autres missions professionnelles",
  );
  await expect(missions.locator(".mission-row")).toHaveCount(10);
  // Les études de cas racontées au-dessus ne sont pas répétées ici.
  await expect(missions).not.toContainText("BeautyBay – Web & Mobile");
  // Aucun projet de formation sur la page.
  await expect(page.locator("#projets")).not.toContainText("ProjetKidoro");
  await expect(page.locator("#projets")).not.toContainText("Objectif :");

  // Le détail d'une mission est accessible au clic, et refermable.
  const first = missions.locator(".mission-row").first();
  await expect(first.locator(".mission-detail")).toBeHidden();
  await first.locator("summary").click();
  await expect(first.locator(".mission-detail")).toBeVisible();
  await expect(first).toContainText("Shopify");
  await first.locator("summary").click();
  await expect(first.locator(".mission-detail")).toBeHidden();

  // La recherche filtre la liste.
  await page.getByRole("searchbox").fill("Shopify");
  await expect(missions.locator(".mission-row")).toHaveCount(4);
  await expect(missions.locator('[role="status"]')).toContainText("4 missions");
  await page.getByRole("searchbox").fill("aucune-mission");
  await expect(missions.locator(".mission-row")).toHaveCount(0);
  await expect(missions.locator(".archive-empty")).toBeVisible();
  await page.getByRole("searchbox").fill("");
  await expect(missions.locator(".mission-row")).toHaveCount(10);
});

test("the academic modal opens, filters, traps focus and closes three ways", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  const modal = page.locator(".modal-academic");
  const open = page.getByRole("button", {
    name: "Voir mes projets académiques",
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

  // Filtre par famille : six pastilles, dont « Toutes ».
  const chips = modal.locator(".filter-chips button");
  await expect(chips).toHaveCount(6);
  await expect(chips.first()).toHaveAttribute("aria-pressed", "true");
  await chips.nth(1).click();
  await expect(chips.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(modal.locator(".archive-row")).toHaveCount(7);
  await expect(modal.locator(".theme-block")).toHaveCount(1);
  await chips.first().click();
  await expect(modal.locator(".archive-row")).toHaveCount(31);

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
  await page
    .getByRole("button", { name: "Voir mes projets académiques" })
    .click();
  const modal = page.locator(".modal-academic");
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
  const missions = page.locator(".mission-list");
  await expect(missions.locator(".mission-mark")).toHaveCount(10);
  await expect(missions.locator(".mission-mark .brand-mark")).toHaveCount(8);

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
  // …ainsi que les logos incrustés dans les maquettes des études de cas.
  const artLogos = await page
    .locator(".showcase-svg image")
    .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
  expect(artLogos.length).toBe(2);
  urls.push(...artLogos.map((href) => new URL(href!, page.url()).href));
  expect(urls.length).toBeGreaterThan(4);
  for (const url of urls) {
    expect(url, "mask-image must be set").toMatch(/^https?:/);
    const response = await page.request.get(url);
    expect(response.status(), `${url} should be served`).toBe(200);
  }
});

test("the navigation marks the section being read", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  const nav = page.locator(".desktop-nav");
  const current = () =>
    page.evaluate(
      () =>
        document.querySelector('.site-header [aria-current="true"]')
          ?.textContent ?? null,
    );
  const goTo = (id: string) =>
    page.evaluate((target) => {
      const el = document.getElementById(target)!;
      window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 100);
    }, id);

  // Dans le hero, aucune section de la navigation n'est active.
  expect(await current()).toBeNull();
  await goTo("projets");
  await expect(nav.getByRole("link", { name: "Projets" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await goTo("parcours");
  await expect(nav.getByRole("link", { name: "Parcours" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect(nav.getByRole("link", { name: "Projets" })).not.toHaveAttribute(
    "aria-current",
  );
  await goTo("contact");
  await expect(page.locator(".nav-contact")).toHaveAttribute(
    "aria-current",
    "true",
  );
});

test("the navigation indicator slides under the section being read", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  const nav = page.locator(".desktop-nav");
  const bar = page.locator(".nav-indicator");
  const goTo = (id: string) =>
    page.evaluate((target) => {
      const el = document.getElementById(target)!;
      window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 100);
    }, id);
  const opacity = () =>
    bar.evaluate((el) => Number(getComputedStyle(el).opacity));
  // L'écart entre la barre et le lien, une fois le glissement terminé.
  const offset = (name: string) =>
    page.evaluate((label) => {
      const link = [...document.querySelectorAll(".desktop-nav a")].find(
        (a) => a.textContent === label,
      )!;
      const a = link.getBoundingClientRect();
      const b = document
        .querySelector(".nav-indicator")!
        .getBoundingClientRect();
      return Math.abs(a.left - b.left) + Math.abs(a.width - b.width);
    }, name);

  // Dans le hero, aucun lien n'est actif : pas de barre.
  expect(await opacity()).toBe(0);
  await goTo("projets");
  await expect.poll(opacity).toBe(1);
  await expect.poll(() => offset("Projets")).toBeLessThan(1);
  // Expertise n'a pas de lien : la barre s'efface sur place…
  await goTo("competences");
  await expect.poll(opacity).toBe(0);
  // … et reparaît sous Parcours.
  await goTo("parcours");
  await expect.poll(opacity).toBe(1);
  await expect.poll(() => offset("Parcours")).toBeLessThan(1);
  await expect(nav.getByRole("link", { name: "Parcours" })).toHaveAttribute(
    "aria-current",
    "true",
  );
});

test("section titles compose line by line and still read as one sentence", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  const title = page.locator("#about-title");
  await expect(title).toHaveText("Comprendre. Construire. Faire avancer.");
  const lift = () =>
    title
      .locator(".title-line > span")
      .evaluateAll((els) =>
        els.map((el) => new DOMMatrix(getComputedStyle(el).transform).m42),
      );
  // Sous la ligne de flottaison, chaque ligne attend sous son masque.
  const hidden = await lift();
  expect(hidden).toHaveLength(3);
  expect(hidden.every((y) => y > 0)).toBe(true);
  // À l'arrivée, elles montent toutes à leur place.
  await page.evaluate(() => {
    const el = document.getElementById("about-title")!;
    window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 300);
  });
  await expect
    .poll(async () => (await lift()).every((y) => y === 0))
    .toBe(true);
});

test("the hero recedes in three planes as it scrolls away", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  const shift = (selector: string) =>
    page
      .locator(selector)
      .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);
  await page.evaluate(() => window.scrollTo(0, 400));
  // Le fond (plaque) recule plus que la photo ; le texte, lui, avance.
  await expect.poll(() => shift(".portrait-art")).toBeGreaterThan(30);
  const plate = await shift(".portrait-art");
  const photo = await shift(".hero-portrait picture");
  const copy = await shift(".hero-copy");
  expect(photo).toBeGreaterThan(0);
  expect(plate).toBeGreaterThan(photo);
  expect(copy).toBeLessThan(0);
});

test("the timeline draws itself as it is read", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Refuser", exact: true }).click();
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  const progress = () =>
    page.locator(".timeline").evaluate((el) => {
      const m = getComputedStyle(el, "::after").transform;
      return m === "none"
        ? 1
        : Number(m.match(/matrix\(([^)]+)\)/)![1].split(",")[3]);
    });
  const litDots = () =>
    page
      .locator(".timeline-entry")
      .evaluateAll(
        (els) =>
          els.filter(
            (el) =>
              getComputedStyle(el, "::before").backgroundColor ===
              getComputedStyle(document.querySelector(".timeline")!, "::after")
                .backgroundColor,
          ).length,
      );

  // Avant la frise : rien de tracé, aucune étape allumée.
  await page.evaluate(() => {
    const t = document.querySelector(".timeline")!;
    window.scrollTo(0, t.getBoundingClientRect().top + scrollY - innerHeight);
  });
  await expect.poll(progress).toBeLessThan(0.05);
  expect(await litDots()).toBe(0);

  // Frise lue en entier : ligne complète, toutes les étapes allumées.
  await page.evaluate(() => {
    const t = document.querySelector(".timeline")!;
    window.scrollTo(0, t.getBoundingClientRect().bottom + scrollY);
  });
  await expect.poll(progress).toBeGreaterThan(0.99);
  await expect
    .poll(litDots)
    .toBe(await page.locator(".timeline-entry").count());
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

      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(audit.violations).toEqual([]);

      // La modale, une fois ouverte, est auditée à part (le reste de la page
      // est inerte, axe n'y verrait plus rien).
      await page
        .getByRole("button", { name: "Voir mes projets académiques" })
        .click();
      await expect(page.locator(".modal-academic")).toBeVisible();
      const modalAudit = await new AxeBuilder({ page })
        .include(".modal-academic")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(modalAudit.violations).toEqual([]);
      await page.keyboard.press("Escape");

      // La modale d'étude de cas, auditée de même.
      await page.locator(".showcase-open").first().focus();
      await page.keyboard.press("Enter");
      await expect(page.locator(".modal-case")).toBeVisible();
      const caseAudit = await new AxeBuilder({ page })
        .include(".modal-case")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(caseAudit.violations).toEqual([]);
      await page.keyboard.press("Escape");

      // Mouvement réduit : aucun plan d'illustration n'est décalé.
      expect(
        await page
          .locator(".showcase-media .layer")
          .evaluateAll((els) =>
            els.every((el) => getComputedStyle(el).transform === "none"),
          ),
      ).toBe(true);
      expect(
        await page
          .locator(".hero-line > span")
          .first()
          .evaluate((el) => getComputedStyle(el).animationName),
      ).toBe("none");
    });
  }
}

import { test, expect } from "@playwright/test";

test("startup feedback remains visible while TSV is loading", async ({
  page,
}) => {
  let release;

  const gate = new Promise(resolve => {
    release = resolve;
  });

  await page.route("**/events.tsv", async route => {
    await gate;
    await route.continue();
  });

  try {
    await page.goto("/", {
      waitUntil: "domcontentloaded",
    });

    await expect(
      page.locator("#startup-status")
    ).toBeVisible();

    await expect(
      page.locator("#startup-message")
    ).toContainText("読み込んでいます");

    release();

    await expect(
      page.locator("#timeline-search")
    ).toBeVisible();

    await expect(
      page.locator("#startup-status")
    ).toHaveCount(0);

  } finally {
    release();
  }
});

test("startup failure displays an error and retry control", async ({
  page,
}) => {
  await page.route("**/events.tsv", route =>
    route.fulfill({
      status: 503,
      contentType: "text/plain",
      body: "Synthetic test failure",
    })
  );

  await page.goto("/");

  const alert = page.getByRole("alert");

  await expect(alert).toContainText(
    "年表データを読み込めませんでした"
  );

  await expect(
    alert.getByRole("button", {
      name: "再読み込み",
      exact: true,
    })
  ).toBeVisible();
});

test("timeline shell precedes TSV completion", async ({
  page,
}) => {
  let release;

  const gate = new Promise(resolve => {
    release = resolve;
  });

  await page.route("**/events.tsv", async route => {
    await gate;
    await route.continue();
  });

  try {
    await page.goto("/", {
      waitUntil: "domcontentloaded",
    });

    await expect(
      page.getByRole("heading", {
        name: "Layering History — 自分史プロジェクション",
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.locator("#timeline-settings")
    ).toBeVisible();

    await expect(
      page.locator("#personal-history")
    ).toBeVisible();

    await expect(
      page.locator("#startup-message")
    ).toContainText("読み込んでいます");

    await expect(
      page.locator("#timeline-search")
    ).toHaveCount(0);

    release();

    await expect(
      page.locator("#timeline-search")
    ).toBeVisible();

    await expect(
      page.locator("#startup-status")
    ).toHaveCount(0);

  } finally {
    release();
  }
});

test("thread shell precedes TSV completion", async ({
  page,
}) => {
  let release;

  const gate = new Promise(resolve => {
    release = resolve;
  });

  await page.route("**/events.tsv", async route => {
    await gate;
    await route.continue();
  });

  try {
    await page.goto("/?threads=1", {
      waitUntil: "domcontentloaded",
    });

    await expect(
      page.getByRole("heading", {
        name: "48のテーマをたどる",
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.locator("#startup-message")
    ).toContainText("読み込んでいます");

    const search = page.getByRole("searchbox", {
      name: "たどるキーワード",
    });

    await expect(search).toHaveCount(0);

    release();

    await expect(search).toBeVisible();

    await expect(
      page.locator("#startup-status")
    ).toHaveCount(0);

  } finally {
    release();
  }
});

test("life settings survive asynchronous startup", async ({
  page,
}) => {
  let release;

  const gate = new Promise(resolve => {
    release = resolve;
  });

  await page.route("**/events.tsv", async route => {
    await gate;
    await route.continue();
  });

  try {
    await page.goto("/", {
      waitUntil: "domcontentloaded",
    });

    const settings = page.locator("#timeline-settings");

    await expect(settings).toBeVisible();

    const toggle = settings.locator(":scope > button");

    if (
      await toggle.getAttribute("aria-expanded") !== "true"
    ) {
      await toggle.click();
    }

    const birthYear = page.getByLabel(
      "誕生年",
      { exact: true }
    );

    await birthYear.fill("1985");
    await birthYear.blur();

    await expect(
      page.locator("#startup-message")
    ).toContainText("読み込んでいます");

    await expect(birthYear).toHaveValue("1985");

    release();

    await expect(
      page.locator("#timeline-search")
    ).toBeVisible();

    await expect(birthYear).toHaveValue("1985");

    await page.unroute("**/events.tsv");

    await page.reload();

    await expect(
      page.locator("#timeline-search")
    ).toBeVisible();

    if (
      await toggle.getAttribute("aria-expanded") !== "true"
    ) {
      await toggle.click();
    }

    await expect(birthYear).toHaveValue("1985");

  } finally {
    release();
  }
});

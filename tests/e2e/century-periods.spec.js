import { test, expect } from "@playwright/test";

test("11–19世紀の期間枠と開閉操作", async ({ page }) => {
  await page.goto("/");

  const parent = page.getByRole("button", {
    name: /^11〜19世紀\s+1001–1900/,
  });

  await expect(parent).toBeVisible();

  // 親期間枠を開く
  await parent.click();
  await expect(parent).toHaveAttribute(
    "aria-expanded", "true"
  );

  // 11〜18世紀の8枠を確認
  for (let century = 11; century <= 18; century++) {
    const from = (century - 1) * 100 + 1;
    const to = century * 100;

    const child = page.getByRole("button", {
      name: new RegExp(
        `^${century}世紀\\s+${from}–${to}`
      ),
    });

    await expect(child).toBeVisible();
  }

  // 19世紀の既存区分は維持
  await expect(page.getByRole("button", {
    name: /^19世紀前半\s+1801–1850/,
  })).toBeVisible();

  await expect(page.getByRole("button", {
    name: /^19世紀後半\s+1851–1900/,
  })).toBeVisible();

  // 子期間枠を個別に開閉
  const sixteenth = page.getByRole("button", {
    name: /^16世紀\s+1501–1600/,
  });

  const wasOpen =
    await sixteenth.getAttribute("aria-expanded");

  await sixteenth.click();

  await expect(sixteenth).toHaveAttribute(
    "aria-expanded",
    wasOpen === "true" ? "false" : "true"
  );

  // 親を閉じて再び開いても子の状態を維持
  const changedState =
    await sixteenth.getAttribute("aria-expanded");

  await parent.click();
  await expect(sixteenth).toHaveCount(0);

  await parent.click();
  await expect(sixteenth).toHaveAttribute(
    "aria-expanded", changedState
  );

  // 全期間枠の一括開閉
  await page.getByRole("button", {
    name: "全期間枠を閉じる",
  }).click();

  await expect(parent).toHaveAttribute(
    "aria-expanded", "false"
  );

  await page.getByRole("button", {
    name: "全期間枠を開く",
  }).click();

  await expect(parent).toHaveAttribute(
    "aria-expanded", "true"
  );

  await expect(sixteenth).toHaveAttribute(
    "aria-expanded", "true"
  );
});

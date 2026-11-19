function result(type, label) {
  return { type, label };
}

const ok = (label) =>
  result("ok", label);

const expected = (label) =>
  result("expected", label);

const blocked = (label) =>
  result("blocked", label);

export function assessIndexingState({
  publicDistributionEnabled,
  hasNoindex,
}) {
  if (hasNoindex) {
    return publicDistributionEnabled
      ? blocked(
          "production Web still contains noindex/nofollow"
        )
      : expected(
          "production Web still contains noindex/nofollow"
        );
  }

  return publicDistributionEnabled
    ? ok("production Web allows indexing")
    : blocked(
        "production Web allows indexing before public release"
      );
}

export function assessDownloadState({
  publicDistributionEnabled,
  status,
}) {
  if (status === 200) {
    return publicDistributionEnabled
      ? ok("public download HTTP 200")
      : blocked(
          "public download is accessible before public release"
        );
  }

  if (
    publicDistributionEnabled === false &&
    status === 401
  ) {
    return expected("public download HTTP 401");
  }

  return blocked(
    `public download HTTP ${status}`
  );
}

export function assessPublicSourceState({
  publicDistributionEnabled,
  visibility,
}) {
  if (visibility === "public") {
    return publicDistributionEnabled
      ? ok(
          "public source GitHub repository is public"
        )
      : blocked(
          "public source GitHub repository is public before public release"
        );
  }

  if (visibility === "private") {
    return publicDistributionEnabled
      ? blocked(
          "public source GitHub repository is still private"
        )
      : expected(
          "public source GitHub repository is still private"
        );
  }

  throw new Error(
    `unknown public source visibility: ${visibility}`
  );
}

export function assessDistributionSetting({
  publicDistributionEnabled,
  liveEnabled,
}) {
  if (liveEnabled === true) {
    return publicDistributionEnabled
      ? ok("public distribution links are enabled")
      : blocked(
          "production publicDistributionEnabled is true before public release"
        );
  }

  return publicDistributionEnabled
    ? blocked(
        "production publicDistributionEnabled is not true"
      )
    : expected(
        "production publicDistributionEnabled is not true"
      );
}

export function assessPublicReleaseState({
  publicDistributionEnabled,
  hasNoindex,
  downloadStatus,
  publicSourceVisibility,
  livePublicDistributionEnabled,
}) {
  return [
    assessIndexingState({
      publicDistributionEnabled,
      hasNoindex,
    }),
    assessDownloadState({
      publicDistributionEnabled,
      status: downloadStatus,
    }),
    assessPublicSourceState({
      publicDistributionEnabled,
      visibility: publicSourceVisibility,
    }),
    assessDistributionSetting({
      publicDistributionEnabled,
      liveEnabled:
        livePublicDistributionEnabled,
    }),
  ];
}

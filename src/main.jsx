import React from "react";
import { createRoot } from "react-dom/client";
import {
  prepareEvents,
  loadEvents,
} from "./events-source";
import {
  loadConfig,
  prepareConfig,
} from "./config-source";
import { recordAccess } from "./access-stats";
import "./styles.css";

async function bootstrap() {
  const eventsResult = prepareEvents().then(
    () => ({
      events: loadEvents(),
      eventsError: false,
    }),
    (error) => {
      console.error(
        "Public events loading failed:", error
      );

      return {
        events: null,
        eventsError: true,
      };
    }
  );

  await prepareConfig();

  const threadWindowMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search)
      .get("threads") === "1";

  const { default: RootApp } = threadWindowMode
    ? await import("./ThreadApp.jsx")
    : await import("./App.jsx");

  const root = createRoot(
    document.getElementById("root")
  );

  const render = (state) => {
    root.render(
      <React.StrictMode>
        <RootApp {...state} />
      </React.StrictMode>
    );
  };

  render({
    events: null,
    eventsError: false,
  });

  const result = await eventsResult;

  render(result);

  if (!result.eventsError) {
    void recordAccess({
      endpoint: loadConfig().accessStats?.endpoint,
    });
  }
}

bootstrap().catch((err) => {
  console.error("Application bootstrap failed:", err);

  const status =
    document.getElementById("startup-status");

  const message =
    document.getElementById("startup-message");

  if (!status || !message) return;

  status.setAttribute("role", "alert");

  message.textContent =
    "年表データを読み込めませんでした。"
    + "通信状態を確認して、もう一度お試しください。";

  const retry = document.createElement("button");

  retry.type = "button";
  retry.textContent = "再読み込み";

  retry.addEventListener("click", () => {
    window.location.reload();
  });

  status.appendChild(retry);
});

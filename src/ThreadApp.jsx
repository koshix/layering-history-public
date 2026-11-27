import { useMemo } from "react";
import {
  loadAppRuntimeState,
} from "./app-runtime.js";
import { buildTimelineLifeContext } from "./timeline-model.js";
import { THREADS } from "./threads.js";
import {
  buildConfiguredThreads,
} from "./thread-model.js";
import useLifeSettings from "./useLifeSettings.js";
import ThreadWindow from "./ThreadWindow.jsx";
import StartupStatus from "./StartupStatus.jsx";

const {
  initialBirth: INITIAL_BIRTH,
  initialMonth: INITIAL_MONTH,
  initialEducation: INITIAL_EDUCATION,
  initialAdultPeriods: INITIAL_ADULT_PERIODS,
  appTitle: APP_TITLE,
  hashtag: HASHTAG,
  shareUrl: SHARE_URL,
} = loadAppRuntimeState([]);

const THREAD_QUERY =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();
const INITIAL_DYNAMIC_QUERY = THREAD_QUERY.get("q") || "";
const OPEN_SHARED_DYNAMIC = THREAD_QUERY.get("play") === "1";

export default function ThreadApp({
  events = null,
  eventsError = false,
}) {
  const configuredThreads = useMemo(
    () => events
      ? buildConfiguredThreads(THREADS, events)
      : [],
    [events]
  );
  const {
    birth,
    month,
    education,
    adultPeriods,
  } = useLifeSettings({
    initialBirth: INITIAL_BIRTH,
    initialMonth: INITIAL_MONTH,
    initialEducation: INITIAL_EDUCATION,
    savedAdultPeriods: INITIAL_ADULT_PERIODS,
  });

  const life = useMemo(
    () =>
      buildTimelineLifeContext({
        birth,
        month,
        education,
        adultPeriods,
      }).life,
    [
      birth,
      month,
      education,
      adultPeriods,
    ]
  );

  if (events === null) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#fafaf8",
        fontFamily: "system-ui, sans-serif",
        color: "#22272e",
      }}>
        <div style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "28px 18px 48px",
        }}>
          <div style={{
            fontSize: 11,
            color: "#8a8f98",
          }}>
            {APP_TITLE}
          </div>

          <h1 style={{
            fontSize: 24,
            color: "#374151",
          }}>
            {THREADS.length}のテーマをたどる
          </h1>

          <StartupStatus error={eventsError} />
        </div>
      </div>
    );
  }

  return (
    <ThreadWindow
      appTitle={APP_TITLE}
      configuredThreads={configuredThreads}
      events={events}
      gradeLabel={life.gradeLabel}
      birth={birth}
      hashtag={HASHTAG}
      shareUrl={SHARE_URL}
      initialQuery={INITIAL_DYNAMIC_QUERY}
      openSharedDynamic={OPEN_SHARED_DYNAMIC}
    />
  );
}

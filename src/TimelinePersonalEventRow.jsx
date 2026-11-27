import {
  eventDisplayPeriod,
  formatEventPeriod,
  formatEventLifeRange,
} from "./event-schema.js";
import { eventId } from "./event-links";
import { CAT } from "./categories";
import Icon from "./Icon";
import TimelineEventRowShell from "./TimelineEventRowShell";

export default function TimelinePersonalEventRow({
  event,
  eraHeadings,
  stage,
  font,
  mono,
  gradeLabel,
  isEventOpen,
  toggleEvent,
  personalEventsSource,
  startEditingPersonalEvent,
  deletePersonalEvent,
  miniBtn,
  gradeBadgeStyle,
  formatEventDate,
}) {
  const id = eventId(event);
  const isOpen = isEventOpen(id);
  const period = eventDisplayPeriod(event);
  const lifeRange = formatEventLifeRange(
    event, gradeLabel
  );

  const headerContent = (
    <>
      <Icon
        name="flag"
        color={CAT.me.bg}
      />
      <span
        style={{
          fontSize: 14,
          lineHeight: 1.55,
          flex: 1,
          minWidth: 0,
          fontWeight: 700,
          color: CAT.me.bg,
        }}
      >
        {event.title}
      </span>
    </>
  );

  return (
    <TimelineEventRowShell
      id={id}
      event={event}
      eraHeadings={eraHeadings}
      stage={stage}
      font={font}
      mono={mono}
      gradeLabel={gradeLabel}
      isOpen={isOpen}
      toggleEvent={toggleEvent}
      gradeBadgeStyle={gradeBadgeStyle}
      background="#f2faf6"
      headerContent={headerContent}
    >
      {isOpen &&
        personalEventsSource === "browser" && (
          <div
            style={{
              display: "flex",
              gap: 8,
              margin:
                "0 4px 8px var(--timeline-detail-indent, 108px)",
            }}
          >
            <button
              type="button"
              onClick={() =>
                startEditingPersonalEvent(
                  event
                )
              }
              style={miniBtn}
            >
              修正
            </button>
            <button
              type="button"
              onClick={() =>
                deletePersonalEvent(event)
              }
              style={{
                ...miniBtn,
                color: "#9b2c2c",
                border:
                  "1px solid #d8a4a4",
                background: "#fff7f7",
              }}
            >
              削除
            </button>
          </div>
        )}

      {isOpen && event.summary && (
        <div
          style={{
            margin:
              "0 4px 10px var(--timeline-detail-indent, 108px)",
            padding: "10px 14px",
            fontSize: 13,
            lineHeight: 1.75,
            color: "#3d4450",
            background: stage.bg,
            borderLeft:
              `3px solid ${CAT.me.bg}`,
            borderRadius:
              "0 8px 8px 0",
          }}
        >
          <div
            style={{
              marginBottom: 6,
              fontSize: 11.5,
              fontWeight: 700,
              color: "#6b7280",
            }}
          >
            {period.hasPeriod ? "期間：" : "日付："}
            <span data-event-date-detail>
              {formatEventPeriod(event, formatEventDate)}
            </span>
            {lifeRange && (
              <div
                data-event-life-range
                style={{
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                人生段階：{lifeRange}
              </div>
            )}
          </div>
          {event.summary}
          {event.note && (
            <div
              style={{
                marginTop: 9,
                padding: "7px 10px",
                border:
                  "1px solid #d8dce2",
                borderRadius: 7,
                background: "#ffffff88",
                color: "#626974",
                fontSize: 11.5,
                lineHeight: 1.65,
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                }}
              >
                補足：
              </span>
              {event.note}
            </div>
          )}
        </div>
      )}
    </TimelineEventRowShell>
  );
}

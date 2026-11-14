import {
  LUCIDE_EVENT_ICONS,
  LUCIDE_FILTER_ICONS,
} from "./lucide-icon-map.js";

export default function Icon({ name, color, size = 18 }) {
  const SvgIcon =
    LUCIDE_EVENT_ICONS[name] ??
    LUCIDE_FILTER_ICONS[name] ??
    LUCIDE_EVENT_ICONS["fallback-work"];

  return (
    <SvgIcon
      size={size}
      color={color ?? "currentColor"}
      strokeWidth={1.7}
      style={{ flexShrink: 0, marginTop: 2 }}
      aria-hidden="true"
    />
  );
}

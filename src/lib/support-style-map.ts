import type { ComfortPreferenceId } from "@/types/support-preferences";
import type { SupportStyleId } from "@/types/couple-profile";

export function comfortsFromSupportStyle(
  style: SupportStyleId | undefined
): ComfortPreferenceId[] {
  switch (style) {
    case "reassurance":
      return ["listening"];
    case "quiet_space":
      return ["quiet_time", "fewer_messages"];
    case "affection":
      return ["hugs_affection"];
    case "conversation":
      return ["listening", "tea_coffee"];
    case "gestures":
      return ["small_surprises"];
    default:
      return ["listening", "quiet_time"];
  }
}

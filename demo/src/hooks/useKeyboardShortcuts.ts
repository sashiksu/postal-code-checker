import { useEffect } from "react";

type Handler = (e: KeyboardEvent) => void;
type Shortcuts = Record<string, Handler>;

/**
 * Binds single-key shortcuts to window `keydown`. Ignores events that come
 * from inputs/textareas/contenteditable (except Escape) and events with
 * meta/ctrl/alt pressed, to stay out of the way of browser shortcuts.
 */
export function useKeyboardShortcuts(shortcuts: Shortcuts): void {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing && e.key !== "Escape") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const handler = shortcuts[e.key];
      if (handler) {
        e.preventDefault();
        handler(e);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcuts]);
}

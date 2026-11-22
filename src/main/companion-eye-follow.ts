import { screen } from "electron";
import { getCompanionWindow, sendToCompanionWindow } from "./companion-window";

const POLL_INTERVAL_MS = 50;

function broadcastCursor() {
   const win = getCompanionWindow();
   if (!win || !win.isVisible()) return;

   const cursor = screen.getCursorScreenPoint();
   const bounds = win.getContentBounds();
   sendToCompanionWindow("cursor", {
      x: cursor.x - bounds.x,
      y: cursor.y - bounds.y
   });
}

export function startCursorTracking(): () => void {
   const timer = setInterval(broadcastCursor, POLL_INTERVAL_MS);
   return () => clearInterval(timer);
}

import { ipcMain, screen } from "electron";
import { getNotchGeometry, getNotchWindow } from "./notch-window";

const POLL_MS = 30;
const CLOSE_DELAY_MS = 150;

export function startNotchHover(): () => void {
   let expanded = false;
   let closeTimer: NodeJS.Timeout | null = null;

   const setExpanded = (value: boolean) => {
      const win = getNotchWindow();
      if (!win || value === expanded) return;
      expanded = value;
      win.setIgnoreMouseEvents(!value);
      win.webContents.send("notch:hover", value);
   };

   const isCursorInside = (size: { width: number; height: number }) => {
      const win = getNotchWindow();
      if (!win) return false;
      const b = win.getBounds();
      const c = screen.getCursorScreenPoint();
      const left = b.x + (b.width - size.width) / 2;
      return (
         c.x >= left &&
         c.x <= left + size.width &&
         c.y >= b.y &&
         c.y <= b.y + size.height
      );
   };

   const tick = () => {
      const { collapsed, expanded: full } = getNotchGeometry();
      const inside = isCursorInside(expanded ? full : collapsed);

      if (inside) {
         if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
         }
         setExpanded(true);
      } else if (expanded && !closeTimer) {
         closeTimer = setTimeout(() => {
            closeTimer = null;
            setExpanded(false);
         }, CLOSE_DELAY_MS);
      }
   };

   ipcMain.handle("notch:get-geometry", () => getNotchGeometry());

   const timer = setInterval(tick, POLL_MS);
   return () => {
      clearInterval(timer);
      if (closeTimer) clearTimeout(closeTimer);
      ipcMain.removeHandler("notch:get-geometry");
   };
}

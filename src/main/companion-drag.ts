import { BrowserWindow, ipcMain, Rectangle, screen } from "electron";

type Point = { x: number; y: number };

let dragOffset: Point | null = null;

const clamp = (v: number, min: number, max: number) =>
   Math.min(Math.max(v, min), max);

function onDragStart(e: Electron.IpcMainEvent) {
   const win = BrowserWindow.fromWebContents(e.sender);
   if (!win) return;

   const cursor = screen.getCursorScreenPoint();
   const [x, y] = win.getPosition();
   dragOffset = { x: cursor.x - x, y: cursor.y - y };
}

function onDragMove(e: Electron.IpcMainEvent) {
   if (!dragOffset) return;
   const win = BrowserWindow.fromWebContents(e.sender);
   if (!win) return;

   const cursor = screen.getCursorScreenPoint();
   const { width, height } = win.getBounds();
   const area: Rectangle = screen.getDisplayNearestPoint(cursor).workArea;

   const x = clamp(
      Math.round(cursor.x - dragOffset.x),
      area.x,
      area.x + area.width - width
   );
   const y = clamp(
      Math.round(cursor.y - dragOffset.y),
      area.y,
      area.y + area.height - height
   );

   win.setBounds({ x, y, width, height });
}

const onDragEnd = () => {
   dragOffset = null;
};

export function registerDragHandlers() {
   ipcMain.on("drag-start", onDragStart);
   ipcMain.on("drag-move", onDragMove);
   ipcMain.on("drag-end", onDragEnd);
}

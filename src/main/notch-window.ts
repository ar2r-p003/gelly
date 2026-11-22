import { BrowserWindow, screen } from "electron";
import { join } from "node:path";
import { loadRenderer } from "./renderer-loader";

type Size = { width: number; height: number };

const NOTCH_WIDTH = 320;
const FALLBACK_NOTCH_HEIGHT = 38;
const EXPANDED: Size = { width: 640, height: 700 };

let notchWindow: BrowserWindow | null = null;
let collapsed: Size = { width: NOTCH_WIDTH, height: FALLBACK_NOTCH_HEIGHT };

export const getNotchGeometry = () => ({ collapsed, expanded: EXPANDED });

export const getNotchWindow = () =>
   notchWindow && !notchWindow.isDestroyed() ? notchWindow : null;

export function createNotchWindow(): BrowserWindow {
   const { bounds, workArea } = screen.getPrimaryDisplay();
   const menuBarHeight = workArea.y - bounds.y;

   collapsed = {
      width: NOTCH_WIDTH,
      height: menuBarHeight > 0 ? menuBarHeight : FALLBACK_NOTCH_HEIGHT
   };

   const x = bounds.x + Math.round((bounds.width - EXPANDED.width) / 2);
   const y = bounds.y;

   const win = new BrowserWindow({
      width: EXPANDED.width,
      height: EXPANDED.height,
      x,
      y,
      show: false,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      resizable: false,
      movable: false,
      hasShadow: false,
      skipTaskbar: true,
      hiddenInMissionControl: true,
      roundedCorners: false,
      enableLargerThanScreen: true,
      type: "panel",
      webPreferences: {
         preload: join(__dirname, "../preload/index.js"),
         contextIsolation: true,
         nodeIntegration: false,
         sandbox: false
      }
   });

   win.setAlwaysOnTop(true, "status");
   win.setIgnoreMouseEvents(true);
   win.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: false,
      skipTransformProcessType: true
   });

   win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
   win.webContents.on("will-navigate", e => e.preventDefault());

   const placeAtTop = () =>
      win.setBounds({ x, y, width: EXPANDED.width, height: EXPANDED.height });

   placeAtTop();
   win.once("ready-to-show", () => {
      placeAtTop();
      win.show();
   });

   win.on("closed", () => {
      if (notchWindow === win) notchWindow = null;
   });

   loadRenderer(win, "notch");

   notchWindow = win;
   return win;
}

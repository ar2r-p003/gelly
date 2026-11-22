import { BrowserWindow, screen } from "electron";
import { join } from "node:path";
import { loadRenderer } from "./renderer-loader";

let companionWindow: BrowserWindow | null = null;

const WINDOW_SIZE = 250;

export const getCompanionWindow = () =>
   companionWindow && !companionWindow.isDestroyed() ? companionWindow : null;

export const sendToCompanionWindow = (channel: string, ...args: unknown[]) =>
   getCompanionWindow()?.webContents.send(channel, ...args);

export function createCompanionWindow(): BrowserWindow {
   const { width, height } = screen.getPrimaryDisplay().workAreaSize;

   const win = new BrowserWindow({
      width: WINDOW_SIZE,
      height: WINDOW_SIZE,
      x: width / 2 - WINDOW_SIZE / 2,
      y: height / 2 - WINDOW_SIZE / 2,
      show: false,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      resizable: false,
      hasShadow: true,
      skipTaskbar: true,
      webPreferences: {
         preload: join(__dirname, "../preload/index.js"),
         contextIsolation: true,
         nodeIntegration: false,
         sandbox: false
      }
   });

   win.setVisibleOnAllWorkspaces(true, {
      visibleOnFullScreen: true,
      skipTransformProcessType: false
   });
   win.setAlwaysOnTop(true, "screen-saver");

   win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
   win.webContents.on("will-navigate", e => e.preventDefault());

   win.on("ready-to-show", () => win.show());
   win.on("blur", () => win.setAlwaysOnTop(true, "screen-saver"));
   win.on("closed", () => {
      if (companionWindow === win) companionWindow = null;
   });

   loadRenderer(win, "companion");

   companionWindow = win;
   return win;
}

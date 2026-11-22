import "./activity-tracker-ipc";
import { app, BrowserWindow } from "electron";
import { electronApp } from "@electron-toolkit/utils";
import { createNotchWindow } from "./notch-window";
import { createCompanionWindow } from "./companion-window";
import { createTray } from "./tray";
import { registerDragHandlers } from "./companion-drag";
import { startCursorTracking } from "./companion-eye-follow";
import { startMusicWatcher } from "./music";
import { startNotchHover } from "./notch-hover";
import { applySettings } from "./settings-ipc";
import { settings } from "./settings-store";
import { startActivityTracking } from "./activity-tracker";

const cleanups: Array<() => void> = [];

function createWindows() {
   createNotchWindow();
   createCompanionWindow();
}

registerDragHandlers();

app.whenReady().then(() => {
   electronApp.setAppUserModelId("com.electron");

   createWindows();
   createTray();
   applySettings(settings.store);

   cleanups.push(
      startCursorTracking(),
      startMusicWatcher(),
      startNotchHover(),
      startActivityTracking()
   );

   app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindows();
   });
});

app.on("window-all-closed", () => {
   if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => cleanups.forEach(fn => fn()));

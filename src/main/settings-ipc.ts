import { app, BrowserWindow, ipcMain } from "electron";
import { settings } from "./settings-store";
import { DEFAULTS, Settings } from "../_shared/settings";

ipcMain.handle("settings:get", () => settings.store);

ipcMain.handle("settings:set", (_e, patch: Partial<Settings>) => {
   for (const key of Object.keys(patch) as (keyof Settings)[]) {
      if (key in DEFAULTS) settings.set(key, patch[key] as never);
   }
   return settings.store;
});

settings.onDidAnyChange(next => {
   for (const w of BrowserWindow.getAllWindows()) {
      w.webContents.send("settings:changed", next);
   }
   applySettings(next);
});

function applyLoginItem(enabled: boolean) {
   if (!app.isPackaged) return;

   const current = app.getLoginItemSettings().openAtLogin;
   if (current === enabled) return;

   app.setLoginItemSettings({ openAtLogin: enabled });
}

export function applySettings(s: Settings) {
   applyLoginItem(s.launchAtLogin);
}

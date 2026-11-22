import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { ActivityAPI, CompanionAPI, NotchAPI, SettingsAPI } from "./types";
import { Settings } from "../_shared/settings";

const companionAPI: CompanionAPI = {
   dragStart: () => ipcRenderer.send("drag-start"),
   dragMove: () => ipcRenderer.send("drag-move"),
   dragEnd: () => ipcRenderer.send("drag-end"),
   onCursor: callback => {
      const handler = (_e: IpcRendererEvent, p: { x: number; y: number }) =>
         callback(p);
      ipcRenderer.on("cursor", handler);
      return () => ipcRenderer.removeListener("cursor", handler);
   },
   onPlayerStateUpdate: callback => {
      const handler = (_e: IpcRendererEvent, value: string) => callback(value);
      ipcRenderer.on("player-state", handler);
      return () => ipcRenderer.removeListener("player-state", handler);
   },
   onCompanionSleep: callback => {
      const handler = (_e: IpcRendererEvent, value: boolean) => callback(value);
      ipcRenderer.on("companion:sleep", handler);
      return () => ipcRenderer.removeListener("companion:sleep", handler);
   },
};
const notchAPI: NotchAPI = {
   getGeometry: () => ipcRenderer.invoke("notch:get-geometry"),
   onHover: callback => {
      const handler = (_e: IpcRendererEvent, value: boolean) => callback(value);
      ipcRenderer.on("notch:hover", handler);
      return () => ipcRenderer.removeListener("notch:hover", handler);
   }
};
const settingsAPI: SettingsAPI = {
   settingsGet: () => ipcRenderer.invoke("settings:get"),
   settingsSet: (patch: Partial<Settings>) =>
      ipcRenderer.invoke("settings:set", patch),
   onSettingsChange: (cb: (s: Settings) => void) => {
      const handler = (_e: IpcRendererEvent, s: Settings) => cb(s);
      ipcRenderer.on("settings:changed", handler);
      return () => ipcRenderer.removeListener("settings:changed", handler);
   }
};
const activityAPI: ActivityAPI = {
   getAnalytics: () => ipcRenderer.invoke("activity:get")
};

if (process.contextIsolated) {
   try {
      contextBridge.exposeInMainWorld("companionAPI", companionAPI);
      contextBridge.exposeInMainWorld("notchAPI", notchAPI);
      contextBridge.exposeInMainWorld("settingsAPI", settingsAPI);
      contextBridge.exposeInMainWorld("activityAPI", activityAPI);
   } catch (error) {
      console.error(error);
   }
}

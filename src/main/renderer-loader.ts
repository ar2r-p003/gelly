import { BrowserWindow } from "electron";
import { join } from "node:path";
import { is } from "@electron-toolkit/utils";

export type RendererPage = "companion" | "notch";

export function loadRenderer(win: BrowserWindow, page: RendererPage) {
   const devUrl = process.env["ELECTRON_RENDERER_URL"];
   if (is.dev && devUrl) {
      win.loadURL(`${devUrl}#/${page}`);
   } else {
      win.loadFile(join(__dirname, "../renderer/index.html"), { hash: `/${page}` });
   }
}

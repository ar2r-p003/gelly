import { app, Menu, nativeImage, Tray } from "electron";
import TrayIcon from "../../resources/tray.png?asset";
import { getCompanionWindow } from "./companion-window";

let tray: Tray | null = null;

const showWindow = () => getCompanionWindow()?.show();
const hideWindow = () => getCompanionWindow()?.hide();
const toggleWindow = () => {
   const win = getCompanionWindow();
   if (win) win.isVisible() ? win.hide() : win.show();
};

export function createTray(): Tray {
   const icon = nativeImage
      .createFromPath(TrayIcon)
      .resize({ width: 20, height: 20 });

   tray = new Tray(icon);
   tray.setToolTip("Gelly");
   tray.setContextMenu(
      Menu.buildFromTemplate([
         { label: "Show Companion", click: showWindow },
         { label: "Hide Companion", click: hideWindow },
         { type: "separator" },
         { label: "Quit App", click: () => app.quit() }
      ])
   );
   tray.on("click", toggleWindow);

   return tray;
}

import Store from "electron-store";
import { DEFAULTS, Settings } from "../_shared/settings";

export const settings = new Store<Settings>({
   name: "settings",
   defaults: DEFAULTS,
   clearInvalidConfig: true,
});

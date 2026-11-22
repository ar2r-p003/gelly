import Store from "electron-store";
import { Analytics, DEFAULTS } from "../_shared/analytics";

export const ActivityStore = new Store<{ day: string; analytics: Analytics }>({
   name: "activity",
   defaults: { day: "", analytics: { ...DEFAULTS } },
   clearInvalidConfig: true
});

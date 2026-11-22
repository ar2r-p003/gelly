import { Settings } from "../_shared/settings";
import { Analytics } from "../_shared/analytics";

export type Unsubscribe = () => void;

export interface CompanionAPI {
   dragStart: () => void;
   dragMove: () => void;
   dragEnd: () => void;
   onCursor: (callback: (p: { x: number; y: number }) => void) => Unsubscribe;
   onPlayerStateUpdate: (callback: (value: string) => void) => Unsubscribe;
   onCompanionSleep: (callback: (value: boolean) => void) => Unsubscribe;
}

type Size = { width: number; height: number };

export interface NotchAPI {
   getGeometry: () => Promise<{ collapsed: Size; expanded: Size }>;
   onHover: (cb: (expanded: boolean) => void) => Unsubscribe;
}

export interface SettingsAPI {
   settingsGet: () => Promise<Settings>;
   settingsSet: (patch: Partial<Settings>) => Promise<Settings>;
   onSettingsChange: (cb: (s: Settings) => void) => Unsubscribe;
}

export interface ActivityAPI {
   getAnalytics: () => Promise<Analytics>;
}

declare global {
   interface Window {
      companionAPI: CompanionAPI;
      notchAPI: NotchAPI;
      settingsAPI: SettingsAPI;
      activityAPI: ActivityAPI;
   }
}

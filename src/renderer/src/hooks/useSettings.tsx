import { useEffect, useState } from "react";
import type { Settings } from "../../../_shared/settings";

export function useSettings() {
   const [settings, setSettings] = useState<Settings | null>(null);

   useEffect(() => {
      const unsubscribe = window.settingsAPI.onSettingsChange(setSettings);
      window.settingsAPI.settingsGet().then(s => {
         setSettings(prev => prev ?? s);
      });
      return unsubscribe;
   }, []);

   return settings;
}

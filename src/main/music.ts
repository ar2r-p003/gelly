import { systemPreferences } from "electron";
import { sendToCompanionWindow } from "./companion-window";

const NOTIFICATIONS = [
   "com.apple.Music.playerInfo",
   "com.spotify.client.PlaybackStateChanged"
];

export function startMusicWatcher(): () => void {
   const ids = NOTIFICATIONS.map(name =>
      systemPreferences.subscribeNotification(name, (_event, userInfo) => {
         const state = String(userInfo?.["Player State"] ?? "");
         sendToCompanionWindow("player-state", state.toLowerCase());
      })
   );

   return () =>
      ids.forEach(id => systemPreferences.unsubscribeNotification(id));
}

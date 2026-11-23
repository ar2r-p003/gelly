import { systemPreferences } from "electron";
import { sendToCompanionWindow } from "./companion-window";

// ---------- macOS ----------

const MAC_NOTIFICATIONS = [
   "com.apple.Music.playerInfo",
   "com.spotify.client.PlaybackStateChanged"
];

function startMacWatcher(): () => void {
   const ids = MAC_NOTIFICATIONS.map(name =>
      systemPreferences.subscribeNotification(name, (_event, userInfo) => {
         const state = String(userInfo?.["Player State"] ?? "");
         sendToCompanionWindow("player-state", state.toLowerCase());
      })
   );
   return () => ids.forEach(id => systemPreferences.unsubscribeNotification(id));
}

// ---------- Windows ----------

const POLL_MS = 1000;
const MAX_CONSECUTIVE_ERRORS = 5;

const PLAYING = 4;
const PAUSED = 5;

function toArray(v: any): any[] {
   if (v == null) return [];
   if (Array.isArray(v)) return v;
   if (typeof v[Symbol.iterator] === "function") return Array.from(v);
   if (typeof v.size === "number" && typeof v.getAt === "function") {
      return Array.from({ length: v.size }, (_, i) => v.getAt(i));
   }
   return [];
}

function statusOf(session: any): number {
   const raw = session.getPlaybackInfo().playbackStatus;
   if (typeof raw === "number") return raw;
   const name = String(raw).toLowerCase();
   return name === "playing" ? PLAYING : name === "paused" ? PAUSED : -1;
}

function startWindowsWatcher() {
   let stopped = false;
   let timer: NodeJS.Timeout | undefined;
   let last = "";
   let errors = 0;

   void (async () => {
      try {
         const { roInitialize } = await import("@microsoft/dynwinrt");

         try {
            roInitialize(1);
         } catch (e) {
            console.warn("roInitialize:", e);
         }


         const { GlobalSystemMediaTransportControlsSessionManager: Manager } =
            await import("@winapp/bindings");
         const manager: any = await Manager.requestAsync();

         const poll = () => {
            if (stopped) return;
            try {
               let state = "stopped";
               for (const session of toArray(manager.getSessions())) {
                  const status = statusOf(session);
                  if (status === PLAYING) {
                     state = "playing";
                     break;
                  }
                  if (status === PAUSED) state = "paused";
               }
               errors = 0;
               if (state !== last) {
                  last = state;
                  sendToCompanionWindow("player-state", state);
               }
            } catch (e) {
               console.error("SMTC poll failed:", e);
               if (++errors >= MAX_CONSECUTIVE_ERRORS) {
                  console.error("music watcher disabled after repeated errors");
                  return;
               }
            }
            timer = setTimeout(poll, POLL_MS);
         };

         poll();
      } catch (e) {
         console.error("music watcher disabled:", e);
      }
   })()


   return () => {
      stopped = true;
      clearTimeout(timer);
   };
}

export function startMusicWatcher(): () => void {
   if (process.platform === "darwin") return startMacWatcher();
   if (process.platform === "win32") return startWindowsWatcher();
   return () => { };
}
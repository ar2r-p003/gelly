import { activeWindow } from "get-windows";
import { powerMonitor } from "electron";
import { Analytics, DEFAULTS } from "../_shared/analytics";
import { DEFAULTS as SettingsDefaults } from "../_shared/settings";
import dayjs from "dayjs";
import { ActivityStore } from "./activity-store";
import { settings } from "./settings-store";
import { EDITORS } from "../_shared/editors";
import path from "node:path";
import { getCompanionWindow } from "./companion-window";

type Owner = { name: string; path?: string; bundleId?: string };

let TARGET_APP = settings.get("focusApp");
const IDLE_THRESHOLD_MS = 60_000;
const MAX_TICK_MS = 10_000;
const SAVE_INTERVAL_MS = 30_000;

const dayKey = () => dayjs().format("YYYY-MM-DD");

let currentDay = dayKey();
const saved = ActivityStore.store;
const analytics: Analytics =
   saved.day === currentDay
      ? { ...DEFAULTS, ...saved.analytics }
      : { ...DEFAULTS };
let dirty = true;

let lastCheckTime = Date.now();
let currentApp: Owner | null = null;
let suspended = false;
let locked = false;

function isFocusApp(owner: Owner, id: string): boolean {
   const e = EDITORS.find(x => x.id === id);
   if (!e) return false;
   if (process.platform === "darwin")
      return !!e.mac && owner.bundleId === e.mac;
   if (process.platform === "win32")
      return (
         !!e.win &&
         !!owner.path &&
         path.win32.basename(owner.path).toLowerCase() === e.win
      );
   return false;
}

function getIdleMs(): number {
   return powerMonitor.getSystemIdleTime() * 1000;
}

function save(): void {
   if (!dirty) return;
   ActivityStore.set({ day: currentDay, analytics: { ...analytics } });
   dirty = false;
}

export function getActivity(): Analytics {
   return { ...analytics };
}

function account(): void {
   const now = Date.now();
   const elapsed = Math.min(now - lastCheckTime, MAX_TICK_MS);
   lastCheckTime = now;

   const today = dayKey();
   if (today !== currentDay) {
      currentDay = today;
      Object.assign(analytics, DEFAULTS);
      dirty = true;
   }

   if (suspended) return;

   if (locked || getIdleMs() >= IDLE_THRESHOLD_MS) {
      analytics.idleTime += elapsed;
      getCompanionWindow()?.webContents.send("companion:sleep", true);
   } else {
      analytics.totalActivityTime += elapsed;
      if (currentApp && isFocusApp(currentApp, TARGET_APP)) {
         analytics.appFocusTime += elapsed;
      }
      getCompanionWindow()?.webContents.send("companion:sleep", false);
   }

   dirty = true;
}

async function tick(): Promise<void> {
   account();

   try {
      const win = await activeWindow({
         screenRecordingPermission: false,
         accessibilityPermission: false
      });
      currentApp = win ? win.owner : null;
   } catch (error) {
      console.error("Failed to get active window:", error);
   }
}

export function startActivityTracking(intervalMs = 3000): () => void {
   let stopped = false;
   let timer: NodeJS.Timeout | undefined;

   const offSettings = settings.onDidChange("focusApp", value => {
      TARGET_APP = value || SettingsDefaults.focusApp;
   });

   lastCheckTime = Date.now();

   const onSuspend = () => {
      account();
      suspended = true;
      save();
   };
   const onResume = () => {
      suspended = false;
      lastCheckTime = Date.now();
   };
   const onLock = () => {
      account();
      locked = true;
   };
   const onUnlock = () => {
      account();
      locked = false;
   };

   powerMonitor.on("suspend", onSuspend);
   powerMonitor.on("resume", onResume);
   powerMonitor.on("lock-screen", onLock);
   powerMonitor.on("unlock-screen", onUnlock);

   const saveTimer = setInterval(save, SAVE_INTERVAL_MS);

   const loop = async () => {
      await tick();
      if (!stopped) timer = setTimeout(loop, intervalMs);
   };
   void loop();

   return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      clearInterval(saveTimer);
      offSettings();
      powerMonitor.off("suspend", onSuspend);
      powerMonitor.off("resume", onResume);
      powerMonitor.off("lock-screen", onLock);
      powerMonitor.off("unlock-screen", onUnlock);
      account();
      save();
   };
}

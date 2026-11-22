import { ipcMain } from "electron";
import { getActivity } from "./activity-tracker";

ipcMain.handle("activity:get", () => getActivity());
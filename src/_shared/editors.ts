export type Editor = { id: string; label: string; mac?: string; win?: string };

export const EDITORS: Editor[] = [
   {
      id: "webstorm",
      label: "WebStorm",
      mac: "com.jetbrains.WebStorm",
      win: "webstorm64.exe"
   },
   {
      id: "vscode",
      label: "VS Code",
      mac: "com.microsoft.VSCode",
      win: "code.exe"
   },
   {
      id: "cursor",
      label: "Cursor",
      mac: "com.todesktop.230313mzl4w4u92",
      win: "cursor.exe"
   },
   { id: "vs", label: "Visual Studio", win: "devenv.exe" }
];

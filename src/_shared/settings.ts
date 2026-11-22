export interface CompanionColors {
   bodyGradientStart?: string;
   bodyGradientEnd?: string;
   bodyStrokeGradientStart?: string;
   bodyStrokeGradientEnd?: string;
   bodyHighlight?: string;
   leafPrimary?: string;
   leafSecondary?: string;
}

export interface Settings {
   launchAtLogin: boolean;
   companionPalette: CompanionColors;
   paletteIndex: number;
   focusApp: string;
}

export const DEFAULTS: Settings = {
   launchAtLogin: false,
   companionPalette: {
      bodyGradientStart: "#4DE29D",
      bodyGradientEnd: "#2C81C3",
      bodyStrokeGradientStart: "#83F6BC",
      bodyStrokeGradientEnd: "#40CED3",
      bodyHighlight: "#A5F8C9",
      leafPrimary: "#62C357",
      leafSecondary: "#93D455"
   },
   paletteIndex: 0,
   focusApp: "webstorm"
};

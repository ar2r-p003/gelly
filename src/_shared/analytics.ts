export interface Analytics {
   appFocusTime: number;
   idleTime: number;
   totalActivityTime: number;
}

export const DEFAULTS: Analytics = {
   appFocusTime: 0,
   idleTime: 0,
   totalActivityTime: 0
};

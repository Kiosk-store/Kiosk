import type Lenis from "lenis";

let instance: Lenis | null = null;

export const lenisStore = {
  set(l: Lenis | null) {
    instance = l;
  },
  get() {
    return instance;
  },
  stop() {
    instance?.stop();
  },
  start() {
    instance?.start();
  },
};

/** @format */

import type Lenis from "lenis";

// Simple singleton store for a Lenis instance so different components
// can register and read the same smooth-scroller without prop drilling.
let instance: Lenis | null = null;

export const lenisStore = {
	set(l: Lenis | null) {
		instance = l;
	},
	get() {
		return instance;
	},
	// convenience helpers to start/stop the instance if present
	stop() {
		instance?.stop();
	},
	start() {
		instance?.start();
	},
};

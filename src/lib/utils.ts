/** @format */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility to merge Tailwind class names safely. Combines `clsx` for
// conditional joining with `tailwind-merge` to dedupe/resolve conflicts.
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

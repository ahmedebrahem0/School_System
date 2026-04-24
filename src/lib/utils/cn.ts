// lib/utils/cn.ts

// Utility function for merging Tailwind CSS classes
// Combines clsx for conditional classes
// and tailwind-merge for resolving conflicts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
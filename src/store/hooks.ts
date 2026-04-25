// store/hooks.ts

// Typed Redux hooks
// Use these instead of plain useDispatch and useSelector

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// Typed useDispatch — knows about our store's dispatch type
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Typed useSelector — knows about our store's state shape
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
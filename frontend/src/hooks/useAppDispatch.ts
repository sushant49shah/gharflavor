/**
 * Typed Redux Hooks
 * Custom hooks for type-safe Redux access
 */

import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';

/**
 * Typed useDispatch hook
 * Use this instead of plain useDispatch for type safety
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed useSelector hook
 * Use this instead of plain useSelector for type safety
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

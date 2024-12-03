import { createStore } from 'jotai/vanilla';
import { atom } from 'jotai';
import type { Website, Category } from './types';

// Create a single store instance
export const store = createStore();

// Define atoms
export const websitesAtom = atom<Website[]>([]);
export const categoriesAtom = atom<Category[]>([]);
export const searchQueryAtom = atom('');
export const selectedCategoryAtom = atom<number | null>(null);
export const isAdminModeAtom = atom(false);

// Initialize store with atoms
store.set(websitesAtom, []);
store.set(categoriesAtom, []);
store.set(searchQueryAtom, '');
store.set(selectedCategoryAtom, null);
store.set(isAdminModeAtom, false);
"use client";

import { Provider } from 'jotai';
import { websitesAtom, categoriesAtom } from '@/lib/store';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      {children}
    </Provider>
  );
}
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateCreator } from 'zustand';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type AuthStoreState = {
  rememberMe: boolean;
  refresh?: string;
  access?: string;
  userId?: string;
  alreadyShowBestHealthAction: { [userId: string]: boolean };
  setRememberMe: (rememberMe: boolean) => void;
  setRefresh: (refresh: string) => void;
  setAccess: (access: string) => void;
  setUserId: (userId: string) => void;
  setAlreadyShowBestHealthAction: (userId: string, show: boolean) => void;
  clear: () => void;
};

const authStore: StateCreator<AuthStoreState> = set => ({
  rememberMe: false,
  refresh: undefined,
  access: undefined,
  alreadyShowBestHealthAction: {},
  setRememberMe: (rememberMe: boolean) => set({ rememberMe }),
  setRefresh: (refresh: string) => set({ refresh }),
  setAccess: (access: string) => set({ access }),
  setUserId: (userId: string) => set({ userId }),
  setAlreadyShowBestHealthAction: (userId: string, show: boolean) =>
    set(state => ({
      alreadyShowBestHealthAction: {
        ...state.alreadyShowBestHealthAction,
        [userId]: show,
      },
    })),
  clear: () =>
    set({
      rememberMe: false,
      refresh: undefined,
      access: undefined,
      userId: undefined,
    }),
});

export const useAuthStore = create(
  devtools(
    persist(authStore, {
      name: 'auth',
      partialize: state => (state.rememberMe ? state : undefined),
      getStorage: () => AsyncStorage,
    }),
  ),
);

import type { StateCreator } from 'zustand';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type DashboardSettings = {
  [prop: string]: any;
  setValue: (key: string, value: boolean) => void;
};

const dashboardSettingsStore: StateCreator<DashboardSettings> = set => ({
  setValue(key, value) {
    set({ [key]: value });
  },
});

export const useDashboardSettings = create(
  devtools(
    persist(dashboardSettingsStore, {
      name: 'dashboardSettings',
      getStorage: () => AsyncStorage,
    }),
  ),
);

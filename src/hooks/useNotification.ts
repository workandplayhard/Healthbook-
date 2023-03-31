import type { StateCreator } from 'zustand';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type NotificationState = {
  notification?: boolean;
  setNotification: (notification: boolean) => void;
  clear: () => void;
};

const notification: StateCreator<NotificationState> = set => ({
  notification: undefined,
  setNotification: (notification: boolean) => set({ notification }),
  clear: () =>
    set({
      notification: undefined,
    }),
});

export const useNotification = create(
  devtools(
    persist(notification, { name: 'notification', getStorage: () => AsyncStorage }), // TODO: Use secure storage
  ),
);

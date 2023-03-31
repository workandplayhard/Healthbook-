import type { StateCreator } from 'zustand';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export enum MoodStatus {
  GREAT = 'great',
  OK = 'ok',
  BAD = 'bad',
}

export type MoodStoreState = {
  mood?: MoodStatus;
  setMood: (mood: MoodStatus) => void;
  clear: () => void;
};

const moodStore: StateCreator<MoodStoreState> = set => ({
  mood: undefined,
  setMood: (mood: MoodStatus) => set({ mood }),
  clear: () =>
    set({
      mood: undefined,
    }),
});

export const useMoodStore = create(
  devtools(
    moodStore,
    // persist(moodStore, { name: 'mood', getStorage: () => AsyncStorage }),
  ),
);

import { create } from "zustand";

export type Track = {
  title: string;
  src: string;
  artwork?: string;
};

type PlayerState = {
  track: Track | null;
  isPlaying: boolean;

  play: (track: Track) => void;
  stop: () => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  track: null,
  isPlaying: false,

  play: (track) =>
    set({
      track,
      isPlaying: true,
    }),

  stop: () =>
    set({
      isPlaying: false,
      track: null,
    }),
}));
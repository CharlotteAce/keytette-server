import { useEffect, useRef } from "react";
import { usePlayerStore } from "../store/playerStore";

export const Player = () => {
  const { track, isPlaying, stop } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    if (track && isPlaying) {
      audioRef.current.src = track.src;
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [track, isPlaying]);

  if (!track) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      background: "#111",
      color: "#fff",
      padding: "10px"
    }}>
      <div>{track.title}</div>
      <button onClick={stop}>×</button>

      <audio ref={audioRef} />
    </div>
  );
};
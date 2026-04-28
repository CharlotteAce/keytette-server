import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../store/playerStore";

export const Player = () => {
  const { track, isPlaying, stop } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ended, setEnded] = useState(false);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    if (!audioRef.current) return;

    if (track && isPlaying) {
      audioRef.current.src = track.src;
      audioRef.current.play();
      setEnded(false);
      setPaused(false);
    } else {
      audioRef.current.pause();
      setPaused(true);
    }
  }, [track, isPlaying]);

    // time update
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const onLoaded = () => {
        if (!isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      };
      const onEnded = () => setEnded(true);

      let rafId: number;

      const update = () => {
        setCurrentTime(audio.currentTime);
        rafId = requestAnimationFrame(update);
      };

      update();
      audio.addEventListener("loadedmetadata", onLoaded);
      audio.addEventListener("ended", onEnded);

      return () => {
        cancelAnimationFrame(rafId);
        audio.removeEventListener("loadedmetadata", onLoaded);
        audio.removeEventListener("ended", onEnded);
      };
    }, [track]);

    const togglePlay = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (ended) {
        audio.currentTime = 0;
        audio.play();
        setEnded(false);
        return;
      }

      if (audio.paused) {
        audio.play();
        setPaused(false);
      } else {
        audio.pause();
        setPaused(true);
      }
    };

    const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio) return;
      const time = Number(e.target.value);
      audio.currentTime = time;
      setCurrentTime(time);
    };

  if (!track) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      width: "100wh",
      background: "#111",
      color: "#fff",
      padding: "10px"
    }}>
      <div>{track.title}</div>
      <button onClick={togglePlay}>
        {ended || paused ? "▶" : "⏸"}
      </button>
      <button onClick={stop}>×</button>
        <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={onSeek}
        style={{ width: "100%" }}
        step="0.01"
    />

      <audio ref={audioRef} />
    </div>
  );
};
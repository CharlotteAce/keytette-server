import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../store/playerStore";
import "./Player.css";

export const Player = () => {
  const { track, isPlaying, stop } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ended, setEnded] = useState(false);
  const [paused, setPaused] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

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
    <>
      {/* ダミー領域（レイアウト用） */}
      <div style={{ height: "100px" }} />

      {/* 実体（fixed） */}
      <div className="player">
        <div className="title-props">
          <div className="music-title">
            <span className={isPlaying ? "scroll" : ""}>
              {track.title}
            </span>
          </div>
          <button className="cancel" onClick={stop}>×</button>
        </div>
        <div className="play-props">
          <button className="play" onClick={togglePlay}>
            {ended || paused ? (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <polygon points="8,5 19,12 8,19" fill="white" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <rect x="6" y="5" width="4" height="14" fill="white" />
                <rect x="14" y="5" width="4" height="14" fill="white" />
              </svg>
            )}
          </button>

          <input
            className={`custom-slider ${isDragging ? "dragging" : ""}`}
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={onSeek}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchCancel={() => setIsDragging(false)}
            style={{
              width: "100%",
              ["--progress" as any]: duration ? currentTime / duration : 0
            }}
            step="0.01"
          />
        </div>
        <audio ref={audioRef} />
      </div>
    </>
  );
};
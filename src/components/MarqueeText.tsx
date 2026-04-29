import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  state: "play" | "pause" | "reset";
  speed?: number; // px/sec
};

export const MarqueeText: React.FC<Props> = ({
  text,
  state,
  speed = 40,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  const [overflow, setOverflow] = useState(false);
  const [x, setX] = useState(0);

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // はみ出し判定
  useEffect(() => {
    if (!containerRef.current || !innerRef.current) return;

    const containerW = containerRef.current.clientWidth;
    const contentW = innerRef.current.scrollWidth; // 2個分なので半分

    setOverflow(contentW > containerW);
  }, [text]);

  // スクロール制御
  useEffect(() => {
    setX(0);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    if (state === "reset") {
      setX(0);
      return;
    }

    if (state !== "play" || !overflow) return;

    let startTimer: number;

    const start = () => {
      lastTimeRef.current = performance.now();

      const loop = (now: number) => {
        const dt = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setX((prev) => {
          const contentW =
            (innerRef.current?.scrollWidth || 0) / 2;

          let next = prev - speed * dt;

          // 1個分超えたら巻き戻し
          if (-next >= contentW) {
            next += contentW;
          }

          return next;
        });

        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
    };

    // 1秒ディレイ
    startTimer = window.setTimeout(start, 1000);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(rafRef.current!);
    };
  }, [state, overflow, text]);

  return (
    <div
      ref={containerRef}
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {overflow ? (
      <div
        ref={innerRef}
        style={{
          display: "inline-flex",
          transform: `translateX(${x}px)`
        }}
      >
        <span style={{ paddingRight: "2rem" }}>{text}</span>
        <span style={{ paddingRight: "2rem" }}>{text}</span>
      </div>
    ) : (
      <div ref={innerRef}>
        <span>{text}</span>
      </div>
    )}
    </div>
  );
};
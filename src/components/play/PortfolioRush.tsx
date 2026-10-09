"use client";

/* The game loop intentionally mutates refs (world/player/camera) each frame;
   React's immutability lint rule does not apply to this imperative canvas code. */
/* eslint-disable react-hooks/immutability */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getDictionary, href } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { PageTransition } from "@/components/motion/PageTransition";
import styles from "./PortfolioRush.module.css";

type Phase = "intro" | "playing" | "complete";

interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Collectible {
  x: number;
  y: number;
  got: boolean;
  variant: number;
}

interface World {
  width: number;
  height: number;
  exit: number;
  platforms: Platform[];
  collectibles: Collectible[];
}

interface Player {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  onGround: boolean;
  coyote: number;
  jumpBuffer: number;
  spawnX: number;
  spawnY: number;
}

const LEVEL_SCALE = 0.56;
const BASE_PLATFORMS: Platform[] = [
  { x: 0, y: 518, w: 920, h: 82 },
  { x: 990, y: 518, w: 830, h: 82 },
  { x: 1890, y: 518, w: 630, h: 82 },
  { x: 2600, y: 518, w: 960, h: 82 },
  { x: 3650, y: 518, w: 950, h: 82 },
  { x: 4710, y: 518, w: 1690, h: 82 },
  { x: 330, y: 420, w: 250, h: 22 },
  { x: 720, y: 348, w: 170, h: 22 },
  { x: 1120, y: 400, w: 210, h: 22 },
  { x: 1450, y: 312, w: 220, h: 22 },
  { x: 1730, y: 418, w: 170, h: 22 },
  { x: 2030, y: 365, w: 220, h: 22 },
  { x: 2360, y: 290, w: 170, h: 22 },
  { x: 2760, y: 382, w: 240, h: 22 },
  { x: 3130, y: 300, w: 190, h: 22 },
  { x: 3480, y: 420, w: 170, h: 22 },
  { x: 3880, y: 350, w: 240, h: 22 },
  { x: 4250, y: 270, w: 180, h: 22 },
  { x: 4550, y: 410, w: 190, h: 22 },
  { x: 4940, y: 340, w: 230, h: 22 },
  { x: 5350, y: 252, w: 230, h: 22 },
];
const COLLECTIBLE_X = [330, 760, 1210, 1510, 2080, 2410, 2850, 3190, 3960, 5020];

function buildWorld(): World {
  const platforms = BASE_PLATFORMS.map((platform) => ({
    ...platform,
    x: Math.round(platform.x * LEVEL_SCALE),
    w: Math.round(platform.w * LEVEL_SCALE),
  }));
  const collectibles = COLLECTIBLE_X.map((rawX, i) => {
    const x = Math.round(rawX * LEVEL_SCALE);
    const platform = platforms.find((p) => p.x === x);
    return {
      x,
      y: (platform ? platform.y : i % 2 ? 288 : 450) - 58,
      got: false,
      variant: i,
    };
  });
  return { width: 3584, height: 600, exit: 3192, platforms, collectibles };
}

function formatTime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function PortfolioRush({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<World>(buildWorld());
  const playerRef = useRef<Player>({
    x: 90,
    y: 400,
    w: 34,
    h: 70,
    vx: 0,
    vy: 0,
    onGround: false,
    coyote: 0,
    jumpBuffer: 0,
    spawnX: 90,
    spawnY: 400,
  });
  const keysRef = useRef<Set<string>>(new Set());
  const cameraRef = useRef(0);
  const runningRef = useRef(false);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const startedAtRef = useRef(0);
  const levelImageRef = useRef<HTMLImageElement | null>(null);
  const reducedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>("intro");
  const [ideas, setIdeas] = useState(0);
  const [time, setTime] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = useCallback((text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 700);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const world = worldRef.current;
    const player = playerRef.current;
    const cameraX = cameraRef.current;

    ctx.clearRect(0, 0, w, h);
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#2a3442");
    sky.addColorStop(0.48, "#687287");
    sky.addColorStop(1, "#101419");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const levelImage = levelImageRef.current;
    if (levelImage && levelImage.complete) {
      ctx.drawImage(levelImage, 0, 0, 1668, 390, 0, 0, w, 330);
    }
    ctx.fillStyle = "rgba(8,11,15,.52)";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#1c2731";
    for (let x = -((cameraX * 0.16) % 90) - 90; x < w + 90; x += 90) {
      const bh = 90 + ((x / 90) | 0) % 4 * 28;
      ctx.fillRect(x, 360 - bh, 54, bh);
    }
    ctx.fillStyle = "rgba(4,6,8,.62)";
    ctx.fillRect(0, 435, w, 165);

    ctx.save();
    ctx.translate(-cameraX, 0);
    ctx.fillStyle = "#252b31";
    world.platforms.forEach((p, i) => {
      ctx.fillStyle = i < 6 ? "#2b3034" : "#30373b";
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = "#59636b";
      ctx.fillRect(p.x, p.y, p.w, 3);
      ctx.fillStyle = "rgba(5,7,9,.45)";
      for (let x = p.x + 10; x < p.x + p.w; x += 38) ctx.fillRect(x, p.y + 18, 2, p.h - 18);
    });
    world.collectibles.forEach((c) => {
      if (c.got) return;
      const pulse = 1 + Math.sin(performance.now() / 180 + c.x) * 0.08;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(pulse, pulse);
      ctx.shadowBlur = 24;
      ctx.shadowColor = "#f6d78f";
      ctx.fillStyle = "#f6e8c2";
      ctx.beginPath();
      ctx.arc(0, -9, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#6a5540";
      ctx.fillRect(-8, 7, 16, 7);
      ctx.fillStyle = "#f2cc78";
      ctx.fillRect(-3, 14, 6, 8);
      ctx.restore();
    });
    drawPlayer(ctx, player.x, player.y);
    ctx.restore();

    ctx.fillStyle = "rgba(3,5,7,.18)";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(203,224,247,.16)";
    for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1);
  }, []);

  const update = useCallback((dt: number) => {
    const world = worldRef.current;
    const player = playerRef.current;
    const keys = keysRef.current;
    const left = keys.has("ArrowLeft") || keys.has("a") || keys.has("left");
    const right = keys.has("ArrowRight") || keys.has("d") || keys.has("right");

    if (left) player.vx -= 1100 * dt;
    if (right) player.vx += 1100 * dt;
    if (!left && !right) player.vx *= Math.pow(0.0008, dt);
    player.vx = Math.max(-260, Math.min(260, player.vx));

    if (player.onGround) player.coyote = 0.12;
    else player.coyote = Math.max(0, player.coyote - dt);
    player.jumpBuffer = Math.max(0, player.jumpBuffer - dt);

    if (keys.has(" ") || keys.has("ArrowUp") || keys.has("w") || keys.has("jump")) {
      player.jumpBuffer = 0.1;
      keys.delete(" ");
      keys.delete("ArrowUp");
      keys.delete("w");
      keys.delete("jump");
    }
    if (player.jumpBuffer > 0 && player.coyote > 0) {
      player.vy = -520;
      player.onGround = false;
      player.coyote = 0;
      player.jumpBuffer = 0;
    }

    const oldBottom = player.y + player.h;
    player.vy += 1400 * dt;
    player.x += player.vx * dt;
    player.y += player.vy * dt;
    player.x = Math.max(0, Math.min(world.width - player.w, player.x));
    player.onGround = false;

    for (const p of world.platforms) {
      if (
        player.vy >= 0 &&
        oldBottom <= p.y &&
        player.y + player.h >= p.y &&
        player.x + player.w > p.x &&
        player.x < p.x + p.w
      ) {
        player.y = p.y - player.h;
        player.vy = 0;
        player.onGround = true;
      }
    }

    if (player.y > 680) {
      player.x = player.spawnX;
      player.y = player.spawnY;
      player.vx = 0;
      player.vy = 0;
      showMessage(dict.play.restart);
    }

    for (const c of world.collectibles) {
      if (
        !c.got &&
        Math.hypot(player.x + player.w / 2 - c.x, player.y + player.h / 2 - c.y) < 52
      ) {
        c.got = true;
      }
    }
    setIdeas(world.collectibles.filter((c) => c.got).length);

    const target = Math.max(0, Math.min(world.width - 1280, player.x - 360));
    cameraRef.current += (target - cameraRef.current) * Math.min(1, dt * 5);

    if (player.x > world.exit) {
      runningRef.current = false;
      setPhase("complete");
    }
  }, [dict.play.restart, showMessage]);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const image = new Image();
    image.src = "/assets/level-01-sheet.png";
    levelImageRef.current = image;
    draw();
  }, [draw]);

  const loop = useCallback(
    (now: number) => {
      if (!runningRef.current) return;
      const dt = Math.min(0.033, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;
      const elapsed = (now - startedAtRef.current) / 1000;
      setTime(elapsed);
      update(dt);
      draw();
      frameRef.current = requestAnimationFrame(loop);
    },
    [draw, update]
  );

  const start = useCallback(() => {
    const world = worldRef.current;
    const player = playerRef.current;
    player.x = 90;
    player.y = 400;
    player.vx = 0;
    player.vy = 0;
    player.spawnX = 90;
    player.spawnY = 400;
    world.collectibles.forEach((c) => (c.got = false));
    cameraRef.current = 0;
    setIdeas(0);
    setTime(0);
    setPhase("playing");
    runningRef.current = true;
    startedAtRef.current = performance.now();
    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(loop);
  }, [loop]);

  useEffect(() => {
    return () => {
      runningRef.current = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "a", "d", "w", " "].includes(event.key)) {
        event.preventDefault();
      }
      keysRef.current.add(event.key.length === 1 ? event.key.toLowerCase() : event.key);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [phase]);

  const press = (key: string, down: boolean) => {
    if (down) keysRef.current.add(key);
    else keysRef.current.delete(key);
  };

  return (
    <PageTransition>
      <div className={styles.wrap}>
        <header className={`container ${styles.head}`}>
        <span className="eyebrow">{dict.play.eyebrow}</span>
        <h1 className={styles.title}>{dict.play.title}</h1>
        <p className={styles.intro}>{dict.play.intro}</p>
      </header>

      <div className={`container ${styles.stageWrap}`}>
        <div className={styles.hud}>
          <span className="mono">
            {dict.play.ideas} {ideas}/10
          </span>
          <span className="mono">{dict.play.level}</span>
          <span className="mono">
            {dict.play.time} {formatTime(time)}
          </span>
        </div>

        <div className={styles.stage}>
          <canvas
            ref={canvasRef}
            width={1280}
            height={600}
            className={styles.canvas}
            aria-label={dict.play.title}
          />

          {phase === "intro" && (
            <div className={styles.overlay}>
              <p className={`mono ${styles.overlayKicker}`}>{dict.play.level}</p>
              <h2 className={styles.overlayTitle}>{dict.play.title}</h2>
              <p className={styles.overlayText}>{dict.play.intro}</p>
              <div className={styles.overlayActions}>
                <button type="button" className={styles.primary} onClick={start}>
                  {dict.play.start}
                </button>
                <Link href={href(lang, "lavori")} className={styles.secondary}>
                  {dict.play.skip}
                </Link>
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className={styles.overlay}>
              <p className={`mono ${styles.overlayKicker}`}>{dict.play.level}</p>
              <h2 className={styles.overlayTitle}>{dict.play.complete}</h2>
              <p className={styles.overlayText}>{dict.play.completeBody}</p>
              <div className={styles.result}>
                <div>
                  <span className="mono">{dict.play.ideas}</span>
                  <strong>
                    {String(ideas).padStart(2, "0")}/10
                  </strong>
                </div>
                <div>
                  <span className="mono">{dict.play.time}</span>
                  <strong>{formatTime(time)}</strong>
                </div>
              </div>
              <div className={styles.overlayActions}>
                <Link href={href(lang, "lavori")} className={styles.primary}>
                  {dict.play.discover}
                </Link>
                <button type="button" className={styles.secondary} onClick={start}>
                  {dict.play.restart}
                </button>
              </div>
            </div>
          )}

          {message && <div className={styles.message}>{message}</div>}
        </div>

        {phase === "playing" && (
          <div className={styles.controls}>
            <p className={`mono ${styles.controlsHint}`}>{dict.play.move}</p>
            <div className={styles.touch} aria-label={dict.play.title}>
              <div className={styles.dpad}>
                <button
                  type="button"
                  className={styles.dir}
                  aria-label="left"
                  onPointerDown={() => press("left", true)}
                  onPointerUp={() => press("left", false)}
                  onPointerLeave={() => press("left", false)}
                >
                  ◀
                </button>
                <button
                  type="button"
                  className={styles.dir}
                  aria-label="right"
                  onPointerDown={() => press("right", true)}
                  onPointerUp={() => press("right", false)}
                  onPointerLeave={() => press("right", false)}
                >
                  ▶
                </button>
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.action}
                  aria-label={dict.play.restart}
                  onClick={() => {
                    const player = playerRef.current;
                    player.x = player.spawnX;
                    player.y = player.spawnY;
                    player.vx = 0;
                    player.vy = 0;
                  }}
                >
                  B
                </button>
                <button
                  type="button"
                  className={styles.action}
                  aria-label={dict.play.jump}
                  onPointerDown={() => press("jump", true)}
                >
                  A
                </button>
              </div>
            </div>
            <p className={`mono ${styles.controlsHint}`}>{dict.play.jump}</p>
          </div>
        )}
      </div>
      </div>
    </PageTransition>
  );
}

function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#171a1d";
  ctx.fillRect(7, 44, 9, 24);
  ctx.fillRect(20, 44, 10, 24);
  ctx.fillStyle = "#f0eee7";
  ctx.fillRect(5, 22, 29, 28);
  ctx.fillStyle = "#c9866e";
  ctx.fillRect(10, 10, 22, 19);
  ctx.fillStyle = "#2a1d1a";
  ctx.fillRect(7, 4, 24, 12);
  ctx.fillRect(5, 9, 7, 12);
  ctx.fillRect(26, 7, 9, 13);
  ctx.fillStyle = "#1b2025";
  ctx.fillRect(10, 14, 8, 6);
  ctx.fillRect(22, 14, 8, 6);
  ctx.fillStyle = "#ced8e5";
  ctx.fillRect(11, 15, 5, 3);
  ctx.fillRect(23, 15, 5, 3);
  ctx.fillStyle = "#6d3a30";
  ctx.fillRect(17, 23, 9, 3);
  ctx.fillStyle = "#e9c0a5";
  ctx.fillRect(0, 29, 7, 17);
  ctx.fillRect(32, 29, 7, 17);
  ctx.fillStyle = "#e9edf2";
  ctx.fillRect(2, 65, 15, 5);
  ctx.fillRect(20, 65, 15, 5);
  ctx.restore();
}

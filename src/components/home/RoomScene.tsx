"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { EASE } from "@/lib/eases";
import { prefersReducedMotion } from "@/lib/motion";
import { largeVariant } from "@/lib/image-variants";
import { getContext, createProgram, createQuad, createTexture, type GL } from "@/lib/webgl";
import type { Room } from "@/lib/rooms";
import { SocialIcons } from "@/components/SocialIcons";
import { VERTEX_SHADER, FRAGMENT_SHADER } from "./roomShader";
import styles from "./home.module.css";

interface Scene {
  gl: GL;
  program: WebGLProgram;
  buffer: WebGLBuffer;
  aPosition: number;
  uniforms: Record<string, WebGLUniformLocation | null>;
  textures: (WebGLTexture | null)[];
  texSizes: { w: number; h: number }[];
  pan: { x: number; y: number };
  a: number;
  b: number;
  t: number;
  raf: number;
  running: boolean;
  visible: boolean;
  dpr: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const smoothstep = (min: number, max: number, value: number) => {
  const t = clamp((value - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
};

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RoomScene({
  rooms,
  social,
  hint,
  prevLabel,
  nextLabel,
  chaptersLabel,
}: {
  rooms: Room[];
  social: { label: string; url: string }[];
  hint: string;
  prevLabel: string;
  nextLabel: string;
  chaptersLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const [webgl, setWebgl] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const indexRef = useRef(0);
  const programmaticRef = useRef(false);
  const panelSide = index % 2 === 1 ? "left" : "right";

  const goTo = useCallback(
    (target: number) => {
      const scene = sceneRef.current;
      const container = scrollRef.current;
      if (!scene || !container) return;
      const room = clamp(target, 0, rooms.length - 1);
      const from = indexRef.current;
      if (room === from) return;

      indexRef.current = room;
      setIndex(room);
      programmaticRef.current = true;

      const start = container.offsetTop;
      const end = container.offsetTop + container.offsetHeight - window.innerHeight;
      const y = start + (room / Math.max(1, rooms.length - 1)) * (end - start);
      const duration = prefersReducedMotion()
        ? 0
        : clamp(0.55 * Math.abs(room - from), 0.6, 1.6);

      gsap.to(window, {
        scrollTo: { y, autoKill: false },
        duration,
        ease: EASE.custom,
        onComplete: () => {
          programmaticRef.current = false;
        },
      });
    },
    [rooms.length]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const container = scrollRef.current;
    if (!canvas || !wrap || !container) return;

    const gl = getContext(canvas);
    if (!gl) {
      setWebgl(false);
      return;
    }
    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    const buffer = createQuad(gl);
    if (!program || !buffer) {
      setWebgl(false);
      return;
    }

    const scene: Scene = {
      gl,
      program,
      buffer,
      aPosition: gl.getAttribLocation(program, "aPosition"),
      uniforms: {
        uTextureA: gl.getUniformLocation(program, "uTextureA"),
        uTextureB: gl.getUniformLocation(program, "uTextureB"),
        uTransition: gl.getUniformLocation(program, "uTransition"),
        uDim: gl.getUniformLocation(program, "uDim"),
        uPan: gl.getUniformLocation(program, "uPan"),
        uBarrel: gl.getUniformLocation(program, "uBarrel"),
        uResolution: gl.getUniformLocation(program, "uResolution"),
        uTexA: gl.getUniformLocation(program, "uTexA"),
        uTexB: gl.getUniformLocation(program, "uTexB"),
        uTime: gl.getUniformLocation(program, "uTime"),
      },
      textures: rooms.map(() => null),
      texSizes: rooms.map(() => ({ w: 1, h: 1 })),
      pan: { x: 0, y: 0 },
      a: 0,
      b: 0,
      t: 0,
      raf: 0,
      running: false,
      visible: true,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
    };
    sceneRef.current = scene;
    setWebgl(true);

    const maxTexture = window.innerWidth < 800 ? 960 : 1600;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * scene.dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * scene.dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resize();

    rooms.forEach((room, i) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        scene.textures[i] = createTexture(gl, image);
        scene.texSizes[i] = { w: image.naturalWidth, h: image.naturalHeight };
        if (i <= 1) window.dispatchEvent(new Event("matteo:room-ready"));
      };
      image.src = largeVariant(room.image, maxTexture);
    });

    const draw = () => {
      const { uniforms } = scene;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.02, 0.03, 0.05, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const textureA = scene.textures[scene.a] ?? scene.textures[scene.b];
      const textureB = scene.textures[scene.b] ?? scene.textures[scene.a];
      if (!textureA || !textureB) return;

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(scene.aPosition);
      gl.vertexAttribPointer(scene.aPosition, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textureA);
      gl.uniform1i(uniforms.uTextureA, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textureB);
      gl.uniform1i(uniforms.uTextureB, 1);

      gl.uniform1f(uniforms.uTransition, scene.t);
      gl.uniform1f(uniforms.uDim, 0.12);
      gl.uniform2f(uniforms.uPan, scene.pan.x, scene.pan.y);
      gl.uniform1f(uniforms.uBarrel, 0.1);
      gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
      const sizeA = scene.texSizes[scene.a];
      const sizeB = scene.texSizes[scene.b];
      gl.uniform2f(uniforms.uTexA, sizeA.w, sizeA.h);
      gl.uniform2f(uniforms.uTexB, sizeB.w, sizeB.h);
      gl.uniform1f(uniforms.uTime, performance.now() * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const loop = () => {
      if (!scene.running) return;

      const start = container.offsetTop;
      const end = container.offsetTop + container.offsetHeight - window.innerHeight;
      const progress = end > start ? clamp((window.scrollY - start) / (end - start), 0, 1) : 0;
      const floatIndex = progress * (rooms.length - 1);
      const lower = clamp(Math.floor(floatIndex), 0, rooms.length - 1);
      const upper = clamp(lower + 1, 0, rooms.length - 1);
      const fraction = floatIndex - lower;

      scene.a = lower;
      scene.b = upper;
      scene.t = smoothstep(0.35, 0.65, fraction);

      // Vertical parallax, damped for a smooth glide.
      const targetPanY = (progress - 0.5) * 0.5;
      scene.pan.y += (targetPanY - scene.pan.y) * 0.08;
      scene.pan.x += (0 - scene.pan.x) * 0.1;

      const active = Math.round(floatIndex);
      if (!programmaticRef.current && active !== indexRef.current) {
        indexRef.current = active;
        setIndex(active);
      }

      draw();
      scene.raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (scene.running) return;
      scene.running = true;
      scene.raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      scene.running = false;
      cancelAnimationFrame(scene.raf);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        scene.visible = entry.isIntersecting;
        if (entry.isIntersecting && !document.hidden) startLoop();
        else stopLoop();
      },
      { threshold: 0 }
    );
    observer.observe(container);

    const onVisibility = () => {
      if (document.hidden) stopLoop();
      else if (scene.visible) startLoop();
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    startLoop();

    return () => {
      stopLoop();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      gsap.killTweensOf(window);
      if (sceneRef.current === scene) sceneRef.current = null;
    };
  }, [rooms]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        goTo(index + 1);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        goTo(index - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, goTo]);

  useEffect(() => {
    const element = panelRef.current;
    if (!element || prefersReducedMotion()) return;
    const fromX = panelSide === "right" ? 34 : -34;
    gsap.fromTo(
      element,
      { opacity: 0, x: fromX },
      { opacity: 1, x: 0, duration: 0.6, ease: EASE.out, overwrite: true }
    );
  }, [index, panelSide]);

  // The active section drives the whole site palette.
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", rooms[index].accent);
  }, [index, rooms]);

  useEffect(
    () => () => {
      document.documentElement.style.removeProperty("--accent");
    },
    []
  );

  const room = rooms[index];

  return (
    <div
      ref={scrollRef}
      className={styles.homeScroll}
      style={{ ["--rooms" as string]: rooms.length }}
    >
      <section className={styles.scene} data-webgl={webgl} aria-label={chaptersLabel}>
        <div
          ref={wrapRef}
          className={styles.viewport}
          style={{ backgroundImage: `url(${largeVariant(room.image, 1600)})` }}
        >
          <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        </div>
        <div className={styles.scrim} aria-hidden="true" />

        {room.id === "intro" ? (
          <div className={styles.intro}>
            <span className={styles.name}>{room.label}</span>
            <span className={styles.role}>{room.desc}</span>
          </div>
        ) : (
          <div ref={panelRef} className={styles.panel} data-side={panelSide}>
            <span className={`mono ${styles.panelNo}`}>
              {String(index).padStart(2, "0")}
            </span>
            <h2 className={styles.panelTitle}>{room.label}</h2>
            <p className={styles.panelDesc}>{room.desc}</p>
            <Link
              href={room.href}
              className={styles.panelCta}
              data-cursor
              data-cursor-label={room.label}
              transitionTypes={["nav-forward"]}
            >
              {room.label}
            </Link>
          </div>
        )}

        <div className={styles.top}>
          <div className={styles.topLeft}>
            <span className={styles.hint}>{hint}</span>
          </div>
          <SocialIcons items={social} />
        </div>

        <nav className={styles.chapter} aria-label={chaptersLabel}>
          {rooms
            .filter((entry) => entry.id !== "intro")
            .map((entry, i) => {
              const roomIndex = i + 1;
              return (
                <button
                  key={entry.id}
                  type="button"
                  className={styles.chapterItem}
                  data-active={roomIndex === index}
                  aria-current={roomIndex === index ? "true" : undefined}
                  onClick={() => goTo(roomIndex)}
                >
                  <span className={styles.chapterNo}>
                    {String(roomIndex).padStart(2, "0")}
                  </span>
                  <span>{entry.label}</span>
                </button>
              );
            })}
        </nav>

        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => goTo(index - 1)}
            aria-label={prevLabel}
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => goTo(index + 1)}
            aria-label={nextLabel}
          >
            <Chevron dir="right" />
          </button>
        </div>
      </section>
    </div>
  );
}

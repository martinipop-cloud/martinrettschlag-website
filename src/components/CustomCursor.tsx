"use client";

import { useEffect, useRef, useState } from "react";

/** Elemente, über denen der Punkt größer wird. */
const KLICKBAR = 'a, button, [role="button"], label, select, summary';

/** Elemente, in denen der normale Textcursor bleibt und der Punkt verschwindet. */
const TEXTFELD = 'input, textarea, [contenteditable="true"], iframe';

/**
 * Eigener Mauszeiger: ein Dreieck, das die Farbe des Hintergrunds umkehrt.
 * (Die Namen „Punkt“ und .cursor-punkt stammen aus der ersten Fassung.)
 *
 * Der Punkt ist weiß und liegt mit dem Mischmodus „difference“ über der
 * Seite – auf hellem Grund erscheint er dunkel, auf dunklem hell, auf Bildern
 * und Videos in der Gegenfarbe. Über Links und Schaltflächen wird er größer.
 *
 * Nur auf Geräten mit echter Maus. Auf Touch-Geräten bleibt alles wie gehabt.
 */
export function CustomCursor() {
  const [aktiv, setAktiv] = useState(false);
  const aussen = useRef<HTMLDivElement>(null);
  const innen = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const maus = window.matchMedia("(hover: hover) and (pointer: fine)");
    const pruefen = () => setAktiv(maus.matches);
    pruefen();
    maus.addEventListener("change", pruefen);
    return () => maus.removeEventListener("change", pruefen);
  }, []);

  useEffect(() => {
    if (!aktiv) return;

    const wurzel = document.documentElement;
    wurzel.classList.add("eigener-cursor");

    let x = 0;
    let y = 0;
    let frame = 0;

    function zeichnen() {
      frame = 0;
      if (aussen.current) {
        aussen.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    }

    function setzeZustand(zustand: "normal" | "gross" | "aus") {
      innen.current?.setAttribute("data-zustand", zustand);
    }

    function onMove(event: PointerEvent) {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(zeichnen);

      const ziel = event.target as Element | null;
      if (ziel?.closest?.(TEXTFELD)) setzeZustand("aus");
      else if (ziel?.closest?.(KLICKBAR)) setzeZustand("gross");
      else setzeZustand("normal");
    }

    const onDown = () => innen.current?.setAttribute("data-gedrueckt", "");
    const onUp = () => innen.current?.removeAttribute("data-gedrueckt");
    const onLeave = () => setzeZustand("aus");

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    wurzel.addEventListener("pointerleave", onLeave);

    return () => {
      wurzel.classList.remove("eigener-cursor");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      wurzel.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [aktiv]);

  if (!aktiv) return null;

  return (
    <div
      ref={aussen}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
    >
      {/* Startet unsichtbar und erscheint mit der ersten Mausbewegung. */}
      <div ref={innen} data-zustand="aus" className="cursor-punkt" />
    </div>
  );
}

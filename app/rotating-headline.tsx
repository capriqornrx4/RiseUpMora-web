"use client";

import { useEffect, useState } from "react";

const phrases = [
  "Empower Your Future",
  "Master Professional Skills",
  "Connect with Industry Leaders",
  "Launch Your Career",
];

const ROTATION_INTERVAL_MS = 3200;
const TRANSITION_DURATION_MS = 500;

export default function RotatingHeadline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let transitionTimeout: number | undefined;

    const interval = window.setInterval(() => {
      setIsVisible(false);

      transitionTimeout = window.setTimeout(() => {
        setActiveIndex((current) => (current + 1) % phrases.length);
        setIsVisible(true);
      }, TRANSITION_DURATION_MS);
    }, ROTATION_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
      if (transitionTimeout !== undefined) {
        window.clearTimeout(transitionTimeout);
      }
    };
  }, []);

  return (
    <h1 className="rotating-headline" aria-label={phrases.join(". ")}>
      <span
        className={isVisible ? "rotating-headline__text--visible" : ""}
        aria-hidden="true"
      >
        {phrases[activeIndex]}
      </span>
    </h1>
  );
}

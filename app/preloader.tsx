"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import riseUpMoraLogo from "../assets/Rise Up Mora logo.png";

const FADE_START_MS = 1900;
const REMOVE_MS = 2450;

export default function Preloader() {
  const [isLeaving, setIsLeaving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setIsLeaving(true), FADE_START_MS);
    const removeTimer = window.setTimeout(() => setIsVisible(false), REMOVE_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`preloader ${isLeaving ? "preloader--leaving" : ""}`}
      role="status"
      aria-label="Loading Rise Up Mora"
    >
      <div className="preloader__ambient" aria-hidden="true" />
      <div className="preloader__content">
        <div className="preloader__logo-wrap">
          <span className="preloader__orbit preloader__orbit--outer" aria-hidden="true" />
          <span className="preloader__orbit preloader__orbit--inner" aria-hidden="true" />
          <Image
            className="preloader__logo"
            src={riseUpMoraLogo}
            alt=""
            priority
          />
        </div>
        <span className="preloader__label">Loading</span>
        <span className="preloader__progress" aria-hidden="true">
          <span />
        </span>
      </div>
    </div>
  );
}

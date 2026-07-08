"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Timeline", href: "#timeline" },
  { label: "Partner", href: "#partner" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 48);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header className={`site-header${isScrolled ? " site-header--scrolled" : ""}`}>
      <a className="site-brand" href="#home" aria-label="Rise Up Mora home">
        <Image
          src="/assets/rise-up-mora-logo.png"
          alt="Rise Up Mora"
          width={830}
          height={535}
          loading="eager"
        />
      </a>

      <nav className="site-navigation" aria-label="Main navigation">
        <ul>
          {navigation.map((item) => (
            <li key={item.label}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <a className="sign-in-link" href="#sign-in">
        Sign In
      </a>
    </header>
  );
}

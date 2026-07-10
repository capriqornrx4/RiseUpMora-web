"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 48);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    const closeDesktopMenu = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", closeDesktopMenu);

    return () => window.removeEventListener("resize", closeDesktopMenu);
  }, []);

  return (
    <header
      className={`site-header${isScrolled ? " site-header--scrolled" : ""}${
        isMenuOpen ? " site-header--menu-open" : ""
      }`}
    >
      <a className="site-brand" href="#home" aria-label="Rise Up Mora home">
        <Image
          src="/assets/rise-up-mora-logo.png"
          alt="Rise Up Mora"
          width={830}
          height={535}
          loading="eager"
        />
      </a>

      <nav id="site-navigation" className="site-navigation" aria-label="Main navigation">
        <ul>
          {navigation.map((item) => (
            <li key={item.label}>
              <a href={item.href} onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="site-header-actions">
        <a className="sign-in-link" href="#sign-in" onClick={() => setIsMenuOpen(false)}>
          Sign In
        </a>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="site-navigation"
          title={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}

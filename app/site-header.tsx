"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SignInModal from "./sign-in-modal";
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
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const resolveHref = (href: string) => {
    if (!href.startsWith("#")) return href;
    return isHomePage ? href : `/${href}`;
  };

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 48);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (!isUserMenuOpen) return;

    const closeMenu = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsUserMenuOpen(false);
    };

    document.addEventListener("mousedown", closeMenu);
    window.addEventListener("keydown", closeMenuOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
      window.removeEventListener("keydown", closeMenuOnEscape);
    };
  }, [isUserMenuOpen]);

  return (
    <>
    <header className={`site-header${isScrolled ? " site-header--scrolled" : ""}`}>
      <Link className="site-brand" href={isHomePage ? "#home" : "/"} aria-label="Rise Up Mora home">
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
      </Link>

      <nav id="site-navigation" className="site-navigation" aria-label="Main navigation">
        <ul>
          {navigation.map((item) => (
            <li key={item.label}>
              <Link href={resolveHref(item.href)}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {status === "authenticated" ? (
        <div className="site-user-menu" ref={userMenuRef}>
          <button
            className="site-user"
            type="button"
            title={session.user.email ?? undefined}
            aria-expanded={isUserMenuOpen}
            aria-haspopup="menu"
            onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
          >
            <UserRound size={17} aria-hidden="true" />
            <span>{session.user.name || "Candidate"}</span>
            <ChevronDown
              className={isUserMenuOpen ? "site-user__chevron--open" : undefined}
              size={15}
              aria-hidden="true"
            />
          </button>

          {isUserMenuOpen && (
            <div className="site-user-menu__dropdown" role="menu">
              <div className="site-user-menu__account" role="presentation">
                <div aria-hidden="true">
                  <UserRound size={18} />
                </div>
                <span>
                  <strong>{session.user.name || "Candidate"}</strong>
                  <small>{session.user.email}</small>
                </span>
              </div>
              <div className="site-user-menu__divider" role="separator" />
              <button
                type="button"
                role="menuitem"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut size={17} aria-hidden="true" />
                Log out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          className="sign-in-link"
          type="button"
          onClick={() => setIsSignInOpen(true)}
          disabled={status === "loading"}
        >
          Sign In
        </button>
      )}
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
    <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </>
  );
}

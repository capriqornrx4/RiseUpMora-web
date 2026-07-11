"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <header className={`site-header${isScrolled ? " site-header--scrolled" : ""}`}>
      <Link className="site-brand" href={isHomePage ? "#home" : "/"} aria-label="Rise Up Mora home">
        <Image
          src="/assets/rise-up-mora-logo.png"
          alt="Rise Up Mora"
          width={830}
          height={535}
          loading="eager"
        />
      </Link>

      <nav className="site-navigation" aria-label="Main navigation">
        <ul>
          {navigation.map((item) => (
            <li key={item.label}>
              <Link href={resolveHref(item.href)}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <Link className="sign-in-link" href={resolveHref("#sign-in")}>
        Sign In
      </Link>
    </header>
  );
}

"use client";

import { FileUp, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function HeroCandidateAction() {
  const { data: session, status } = useSession();

  if (status !== "authenticated" || session.user.role !== "candidate") {
    return (
      <Link className="hero-primary" href="/signup" prefetch>
        Register Now
      </Link>
    );
  }

  return (
    <>
      <Link className="hero-primary hero-cv-action" href="/candidate/application">
        <FileUp size={18} aria-hidden="true" />
        Add your CV
      </Link>
      <Link className="hero-secondary hero-cv-action" href="/candidate/dashboard">
        <UserRound size={18} aria-hidden="true" />
        Show My Profile
      </Link>
    </>
  );
}

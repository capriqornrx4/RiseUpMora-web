"use client";

import { FileUp } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import CvUploadModal from "./cv-upload-modal";

export default function HeroCandidateAction() {
  const { data: session, status } = useSession();
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);

  if (status !== "authenticated" || session.user.role !== "candidate") {
    return (
      <Link className="hero-primary" href="/signup" prefetch>
        Sign Up
      </Link>
    );
  }

  return (
    <>
      <button
        className="hero-primary hero-cv-action"
        type="button"
        onClick={() => setIsCvModalOpen(true)}
      >
        <FileUp size={18} aria-hidden="true" />
        Add your CV
      </button>
      <CvUploadModal
        isOpen={isCvModalOpen}
        onClose={() => setIsCvModalOpen(false)}
      />
    </>
  );
}

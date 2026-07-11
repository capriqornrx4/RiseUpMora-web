"use client";

import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CvUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CvUploadModal({ isOpen, onClose }: CvUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    fileInputRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isUploading) onClose();
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, isUploading, onClose]);

  if (!isOpen) return null;

  const closeModal = () => {
    if (isUploading) return;
    setFile(null);
    setError("");
    setSuccess(false);
    onClose();
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("Select your CV before uploading.");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch("/api/v1/candidate/cv", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        setError(data.error || "Unable to upload your CV.");
        return;
      }

      setSuccess(true);
      setFile(null);
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="sign-in-modal__backdrop cv-modal__backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <section
        className="sign-in-modal cv-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-modal-title"
      >
        <button
          className="sign-in-modal__close cv-modal__close"
          type="button"
          onClick={closeModal}
          disabled={isUploading}
          aria-label="Close CV upload"
        >
          <X size={20} aria-hidden="true" />
        </button>

        {success ? (
          <div className="sign-in-modal__success cv-modal__success" role="status">
            <CheckCircle2 size={42} aria-hidden="true" />
            <h2 id="cv-modal-title">CV uploaded</h2>
            <p>Your candidate profile now includes your latest CV.</p>
            <button type="button" onClick={closeModal}>Done</button>
          </div>
        ) : (
          <>
            <div className="sign-in-modal__heading cv-modal__heading">
              <p>Candidate Profile</p>
              <h2 id="cv-modal-title">Add your CV</h2>
              <span>Upload your latest CV as a PDF, up to 5 MB.</span>
            </div>

            {error && <div className="sign-in-modal__error cv-modal__error" role="alert">{error}</div>}

            <form onSubmit={handleUpload}>
              <label className="cv-modal__picker">
                <FileText size={28} aria-hidden="true" />
                <strong>{file ? file.name : "Choose PDF"}</strong>
                <span>{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "PDF, maximum 5 MB"}</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(event) => {
                    setError("");
                    setFile(event.target.files?.[0] ?? null);
                  }}
                  disabled={isUploading}
                  required
                />
              </label>

              <button
                className="sign-in-modal__submit cv-modal__submit"
                type="submit"
                disabled={!file || isUploading}
              >
                {isUploading ? (
                  <Loader2 className="signup-spinner" size={18} aria-hidden="true" />
                ) : (
                  <Upload size={18} aria-hidden="true" />
                )}
                {isUploading ? "Uploading CV" : "Upload CV"}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

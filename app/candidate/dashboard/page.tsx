"use client";

import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  RefreshCw,
  Save,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SiteBackground from "../../site-background";
import SiteHeader from "../../site-header";

type CandidateProfile = {
  name: string;
  email: string;
  phone: string;
  studentId: string;
  faculty: string;
  department: string;
  cvUrl: string | null;
  preferences: Array<string | null>;
  comment: string;
};

type Company = {
  id: string;
  name: string;
};

export default function CandidateDashboardPage() {
  const router = useRouter();
  const { status } = useSession();
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [preferences, setPreferences] = useState(["", "", "", ""]);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }

    const controller = new AbortController();
    fetch("/api/v1/candidate/dashboard", { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 404) {
          router.replace("/complete-profile");
          return null;
        }
        const data = (await response.json()) as {
          candidate?: CandidateProfile;
          companies?: Company[];
          error?: string;
        };
        if (!response.ok || !data.candidate || !data.companies) {
          throw new Error(data.error || "Unable to load your profile");
        }
        return data as { candidate: CandidateProfile; companies: Company[] };
      })
      .then((data) => {
        if (!data) return;
        setCandidate(data.candidate);
        setCompanies(data.companies);
        setPreferences(
          Array.from({ length: 4 }, (_, index) =>
            data.candidate.preferences[index] ?? "",
          ),
        );
        setComment(data.candidate.comment);
        setIsLoading(false);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load your profile",
        );
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [router, status]);

  const updatePreference = (index: number, value: string) => {
    setPreferences((current) =>
      current.map((preference, preferenceIndex) =>
        preferenceIndex === index ? value : preference,
      ),
    );
    setSaveSuccess(false);
  };

  const getCvFilename = (url: string) => {
    try {
      const parts = url.split("/");
      return decodeURIComponent(parts[parts.length - 1]);
    } catch {
      return "CV.pdf";
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaveSuccess(false);

    if (preferences.some((preference) => !preference)) {
      setError("Select all four company preferences.");
      return;
    }
    if (new Set(preferences).size !== 4) {
      setError("Each company preference must be different.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/v1/candidate/dashboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences, comment }),
      });
      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        setError(data.error || "Unable to save changes.");
        return;
      }

      setSaveSuccess(true);
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="candidate-application-page">
      <SiteBackground />
      <SiteHeader />

      <main className="candidate-application-main">
        <Link className="signup-back-link" href="/#home">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to home
        </Link>

        <header className="candidate-application-heading">
          <p>My Profile</p>
          <h1>Candidate Dashboard</h1>
          <span>
            View your details, manage your CV, and update company preferences.
          </span>
        </header>

        {isLoading ? (
          <div className="candidate-application-loading" role="status">
            <Loader2 className="signup-spinner" size={24} aria-hidden="true" />
            Loading your profile
          </div>
        ) : candidate ? (
          <form className="candidate-application-form" onSubmit={handleSave}>
            {/* Section 01 — Applicant Details */}
            <section className="application-section" aria-labelledby="dashboard-details-title">
              <div className="application-section__heading">
                <span>01</span>
                <div>
                  <h2 id="dashboard-details-title">Applicant details</h2>
                  <p>Your verified candidate profile information.</p>
                </div>
              </div>

              <div className="application-details-grid">
                {[
                  ["Name", candidate.name],
                  ["Email address", candidate.email],
                  ["Phone number", candidate.phone],
                  ["University ID", candidate.studentId],
                  ["Faculty", candidate.faculty],
                  ["Department", candidate.department],
                ].map(([label, value]) => (
                  <label key={label}>
                    <span>{label}</span>
                    <input type="text" value={value} readOnly />
                  </label>
                ))}
              </div>
            </section>

            {/* Section 02 — Curriculum Vitae */}
            <section className="application-section" aria-labelledby="dashboard-cv-title">
              <div className="application-section__heading">
                <span>02</span>
                <div>
                  <h2 id="dashboard-cv-title">Curriculum vitae</h2>
                  <p>Your uploaded CV document.</p>
                </div>
              </div>

              {candidate.cvUrl ? (
                <div className="dashboard-cv-card">
                  <div className="dashboard-cv-info">
                    <FileText size={28} aria-hidden="true" />
                    <div>
                      <strong>{getCvFilename(candidate.cvUrl)}</strong>
                      <span>PDF document — uploaded</span>
                    </div>
                  </div>
                  <div className="dashboard-cv-actions">
                    <a
                      href={candidate.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dashboard-cv-btn dashboard-cv-btn--view"
                    >
                      <ExternalLink size={15} aria-hidden="true" />
                      View CV
                    </a>
                    <Link
                      href="/candidate/application"
                      className="dashboard-cv-btn dashboard-cv-btn--replace"
                    >
                      <RefreshCw size={15} aria-hidden="true" />
                      Re-upload CV
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="dashboard-cv-card dashboard-cv-card--empty">
                  <FileText size={28} aria-hidden="true" />
                  <div>
                    <strong>No CV uploaded yet</strong>
                    <span>Upload your CV to complete your application.</span>
                  </div>
                  <Link
                    href="/candidate/application"
                    className="dashboard-cv-btn dashboard-cv-btn--replace"
                  >
                    Upload CV
                  </Link>
                </div>
              )}
            </section>

            {/* Section 03 — Company Preferences */}
            <section className="application-section" aria-labelledby="dashboard-preferences-title">
              <div className="application-section__heading">
                <span>03</span>
                <div>
                  <h2 id="dashboard-preferences-title">Company preferences</h2>
                  <p>Rank four different companies in your preferred order.</p>
                </div>
              </div>

              <div className="application-preferences-grid">
                {preferences.map((preference, index) => (
                  <label key={index}>
                    <span>Preference {index + 1}</span>
                    <select
                      value={preference}
                      onChange={(event) => updatePreference(index, event.target.value)}
                      disabled={isSaving}
                      required
                    >
                      <option value="" disabled>Select company</option>
                      {companies.map((company) => (
                        <option
                          value={company.id}
                          key={company.id}
                          disabled={preferences.some(
                            (selected, selectedIndex) =>
                              selectedIndex !== index && selected === company.id,
                          )}
                        >
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </section>

            {/* Section 04 — Comment */}
            <section className="application-section" aria-labelledby="dashboard-comment-title">
              <div className="application-section__heading">
                <span>04</span>
                <div>
                  <h2 id="dashboard-comment-title">Comment</h2>
                  <p>Optional</p>
                </div>
              </div>

              <label className="application-comment">
                <span>Additional comment</span>
                <textarea
                  value={comment}
                  onChange={(event) => {
                    setComment(event.target.value);
                    setSaveSuccess(false);
                  }}
                  maxLength={2000}
                  rows={5}
                  disabled={isSaving}
                />
                <small>{comment.length} / 2000</small>
              </label>
            </section>

            {error && <div className="signup-error" role="alert">{error}</div>}

            {saveSuccess && (
              <div className="dashboard-save-success" role="status">
                <CheckCircle2 size={17} aria-hidden="true" />
                Changes saved successfully
              </div>
            )}

            <button
              className="application-submit"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="signup-spinner" size={19} aria-hidden="true" />
              ) : (
                <Save size={17} aria-hidden="true" />
              )}
              {isSaving ? "Saving changes" : "Save preferences"}
            </button>
          </form>
        ) : (
          <div className="signup-error" role="alert">{error}</div>
        )}
      </main>
    </div>
  );
}

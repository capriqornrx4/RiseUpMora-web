"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, GraduationCap, Mail, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import SiteBackground from "../site-background";
import SiteHeader from "../site-header";

const departmentsByFaculty = {
  "Faculty of Engineering": [
    "Department of Chemical & Process Engineering",
    "Department of Civil Engineering",
    "Department of Computer Science & Engineering",
    "Department of Earth Resources Engineering",
    "Department of Electrical Engineering",
    "Department of Electronic & Telecommunication Engineering",
    "Department of Materials Science & Engineering",
    "Department of Mechanical Engineering",
    "Department of Textile & Apparel Engineering",
    "Department of Transport Management and Logistics Engineering",
  ],
  "Faculty of Information Technology": [
    "Department of Information Technology",
  ],
  "Faculty of Business": [
    "Department of Decision Sciences",
    "Department of Industrial Management",
    "Department of Management of Technology",
  ],
  "Faculty of Architecture": [
    "Department of Architecture",
    "Department of Building Economics",
    "Department of Town & Country Planning",
    "Department of Integrated Design",
    "Department of Facilities Management",
  ],

} as const;

const faculties = Object.keys(departmentsByFaculty) as Array<keyof typeof departmentsByFaculty>;

export default function SignupPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<keyof typeof departmentsByFaculty | "">("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const departmentOptions = selectedFaculty ? departmentsByFaculty[selectedFaculty] : [];

  return (
    <div className="signup-page">
      <SiteBackground />
      <SiteHeader />

      <main className="signup-main">
        <section className="signup-hero" aria-labelledby="signup-heading">
          <div className="signup-copy">
            <Link className="signup-back-link" href="/#home">
              <ArrowLeft size={18} aria-hidden="true" />
              Back to home
            </Link>

            <p className="hero-eyebrow">Rise Up Mora 2026</p>
            <h1 id="signup-heading">
              Start your <span>career-ready</span> journey.
            </h1>
            <p className="signup-description">
              Register your interest for Rise Up Mora and stay ready for webinars,
              workshops, internship fair updates, and mock interview opportunities.
            </p>

            <div className="signup-highlights" aria-label="Registration highlights">
              <div>
                <strong>20+</strong>
                <span>Expert sessions</span>
              </div>
              <div>
                <strong>50+</strong>
                <span>Industry partners</span>
              </div>
              <div>
                <strong>Aug 06</strong>
                <span>Fair day</span>
              </div>
            </div>
          </div>

          <form
            className="signup-form"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="signup-form__heading">
              <p>Student Signup</p>
              <h2>Reserve your place</h2>
            </div>

            {submitted && (
              <div className="signup-success" role="status">
                <CheckCircle2 size={18} aria-hidden="true" />
                Your details are ready to be submitted once registration opens.
              </div>
            )}

            <label>
              <span>Full name</span>
              <div className="signup-field">
                <UserRound size={18} aria-hidden="true" />
                <input name="name" type="text" autoComplete="name" required />
              </div>
            </label>

            <label>
              <span>Email address</span>
              <div className="signup-field">
                <Mail size={18} aria-hidden="true" />
                <input name="email" type="email" autoComplete="email" required />
              </div>
            </label>

            <label>
              <span>Contact number</span>
              <div className="signup-field">
                <Phone size={18} aria-hidden="true" />
                <input name="phone" type="tel" autoComplete="tel" required />
              </div>
            </label>

            <div className="signup-form__row">
              <label>
                <span>Faculty</span>
                <div className="signup-field signup-field--select">
                  <GraduationCap size={18} aria-hidden="true" />
                  <select
                    name="faculty"
                    required
                    value={selectedFaculty}
                    onChange={(event) => {
                      setSelectedFaculty(event.target.value as keyof typeof departmentsByFaculty);
                      setSelectedDepartment("");
                    }}
                  >
                    <option value="" disabled>
                      Select faculty
                    </option>
                    {faculties.map((faculty) => (
                      <option value={faculty} key={faculty}>
                        {faculty}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label>
                <span>Student ID</span>
                <div className="signup-field">
                  <input
                    name="studentId"
                    type="text"
                    maxLength={7}
                    pattern="[0-9]{6}[A-Za-z]"
                    title="Enter 6 digits followed by one English letter"
                    required
                  />
                </div>
              </label>
            </div>

            <label>
              <span>Department</span>
              <div className="signup-field signup-field--select">
                <BookOpen size={18} aria-hidden="true" />
                <select
                  name="department"
                  required
                  value={selectedDepartment}
                  disabled={!selectedFaculty}
                  onChange={(event) => setSelectedDepartment(event.target.value)}
                >
                  <option value="" disabled>
                    {selectedFaculty ? "Select department" : "Select faculty first"}
                  </option>
                  {departmentOptions.map((department) => (
                    <option value={department} key={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <button className="signup-submit" type="submit">
              Sign Up
            </button>

            <div className="signup-divider" aria-hidden="true">
              <span>or</span>
            </div>

            <button className="signup-google" type="button">
              <svg
                className="signup-google__mark"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285f4"
                  d="M22.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.26h5.94a5.08 5.08 0 0 1-2.2 3.33v2.77h3.56c2.08-1.92 3.3-4.74 3.3-8.13z"
                />
                <path
                  fill="#34a853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.28-1.93-6.15-4.53H2.18v2.86A10.99 10.99 0 0 0 12 23z"
                />
                <path
                  fill="#fbbc05"
                  d="M5.85 14.1a6.61 6.61 0 0 1 0-4.2V7.04H2.18a11.01 11.01 0 0 0 0 9.92l3.67-2.86z"
                />
                <path
                  fill="#ea4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a10.99 10.99 0 0 0-9.82 6.04L5.85 9.9C6.72 7.31 9.14 5.38 12 5.38z"
                />
              </svg>
              Sign in with Google
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

import Image from "next/image";
import AboutStory from "./about-story";
import EventTimeline from "./event-timeline";
import Preloader from "./preloader";
import RotatingHeadline from "./rotating-headline";
import SiteBackground from "./site-background";
import SiteHeader from "./site-header";

export default function Home() {
  return (
    <div className="home-page">
      <Preloader />
      <SiteBackground />
      <SiteHeader />

      <main>
        <section className="home-hero" id="home">
          <div className="hero-copy">
            <p className="hero-eyebrow">University of Moratuwa</p>
            <RotatingHeadline />
            <p className="hero-description">
              A transformative initiative by the IEEE Student Branch at the
              University of Moratuwa, empowering undergraduates with industry
              insights, professional skills, and interview preparation through
              expert-led webinars and workshops.
            </p>
            <div className="hero-actions">
              <a className="hero-primary" href="#sign-in">
                Sign Up
              </a>
              <a className="hero-secondary" href="#timeline">
                View timeline
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-orbit hero-orbit--outer" />
            <div className="hero-orbit hero-orbit--inner" />
            <div className="hero-brand-mark">
              <Image
                className="hero-visual-logo"
                src="/assets/rise-up-mora-logo.png"
                alt=""
                width={830}
                height={535}
                sizes="(max-width: 48rem) 72vw, 23rem"
              />
            </div>
            <span className="hero-year">2026</span>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-intro">
            <p className="about-kicker">IEEE Student Branch Leadership</p>
            <h2>Rise Up Mora?</h2>
            <div className="about-rule" aria-hidden="true" />
            <p className="about-description">
              Rise Up Mora is an award-winning, large-scale initiative, proudly
              organized by the IEEE Student Branch of the University of Moratuwa.
              Ever since its inception in 2021, Rise Up Mora has been the most
              awaited Internship Focused Career Development Experience at the
              University of Moratuwa.
            </p>
            <p className="about-description">
              The key highlight behind this anticipation is the signature Internship
              and Mock Interview Fair, which brings together over 5,000 undergraduates
              from the best technological university in Sri Lanka alongside the
              country&apos;s leading industry giants on one powerful platform.
            </p>
            <p className="about-description">
              Having made an unmatched impact for six consecutive years, Rise Up Mora
              has established a deeply trusted reputation, not only among the
              University of Moratuwa undergraduates but also among the entire IEEE
              Student Branch community in Sri Lanka, well-evident by the number of
              awards it has won over the years.
            </p>
            <p className="about-description">
              Having made a significant impact over the years, Rise Up Mora continues
              its mission of shaping talented undergraduates into career-ready
              professionals while serving as the ultimate bridge that connects Sri
              Lanka&apos;s best talents with the country&apos;s most influential corporate
              companies.
            </p>
            <div className="about-actions">
              <a className="about-primary" href="#contact">
                Join our community <span aria-hidden="true">→</span>
              </a>
              <a className="about-secondary" href="#timeline">
                Explore the journey <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <AboutStory />

          <div className="about-metrics" aria-label="Rise Up Mora impact">
            <div>
              <strong>20+</strong>
              <span>Expert webinars</span>
            </div>
            <div>
              <strong>3500+</strong>
              <span>Mock interviews</span>
            </div>
            <div>
              <strong>50+</strong>
              <span>Companies</span>
            </div>
            <p>
              One growing network of students, mentors, and industry leaders.
            </p>
          </div>
        </section>

        <EventTimeline />

        <section className="home-sections" aria-label="Explore Rise Up Mora">
          <article id="partner">
            <span>01</span>
            <h2>Partner</h2>
            <p>Join the organizations helping ambitious ideas move forward.</p>
          </article>
          <article id="gallery">
            <span>02</span>
            <h2>Gallery</h2>
            <p>See the energy, collaboration, and highlights from our journey.</p>
          </article>
          <article id="contact">
            <span>03</span>
            <h2>Contact</h2>
            <p>Connect with the team and start a conversation.</p>
          </article>
          <article id="sign-in">
            <span>04</span>
            <h2>Member access</h2>
            <p>Sign in to access your Rise Up Mora workspace.</p>
          </article>
        </section>
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

const storyPanels = [
  {
    title: "Who We Are",
    body: "Rise Up Mora is a transformative initiative by the IEEE Student Branch at the University of Moratuwa, designed for self-driven undergraduates seeking to bridge the gap between academic knowledge and industry expectations.",
  },
  {
    title: "Our Vision",
    body: "“IEEE will be essential to the global technical community and to technical professionals everywhere, and be universally recognized for the contributions of technology and of technical professionals in improving global conditions.”",
  },
  {
    title: "Our Mission",
    body: "“IEEE's core purpose is to foster technological innovation and excellence for the benefit of humanity.”",
  },
  {
    title: "Our Impact",
    body: "Providing webinars, mock interviews, and interactive workshops that equip participants with personalized feedback and valuable connections for success in industrial training and beyond.",
  },
] as const;

const PANEL_DURATION_MS = 6000;

export default function AboutStory() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % storyPanels.length);
    }, PANEL_DURATION_MS);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="about-story">
      <div className="about-story__topline">
        <span>Our foundation</span>
        <small>{String(activeIndex + 1).padStart(2, "0")} / 04</small>
      </div>

      <div className="about-story__tabs" role="tablist" aria-label="About Rise Up Mora">
        {storyPanels.map((panel, index) => (
          <button
            key={panel.title}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`about-panel-${index + 1}`}
            id={`about-tab-${index + 1}`}
            onClick={() => setActiveIndex(index)}
          >
            <span>{index + 1}</span>
            <small>{panel.title}</small>
          </button>
        ))}
      </div>

      <div className="about-story__panels">
        {storyPanels.map((panel, index) => (
          <article
            className={`about-story__panel ${
              activeIndex === index ? "about-story__panel--active" : ""
            }`}
            id={`about-panel-${index + 1}`}
            key={panel.title}
            role="tabpanel"
            aria-labelledby={`about-tab-${index + 1}`}
            aria-hidden={activeIndex !== index}
          >
            <p>Chapter {String(index + 1).padStart(2, "0")}</p>
            <h3>{panel.title}</h3>
            <div aria-hidden="true" />
            <blockquote>{panel.body}</blockquote>
          </article>
        ))}
      </div>

      <div className="about-story__footer" aria-hidden="true">
        <span style={{ width: `${((activeIndex + 1) / storyPanels.length) * 100}%` }} />
      </div>
    </div>
  );
}

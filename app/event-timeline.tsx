"use client";

import { useEffect, useRef, useState } from "react";

type TimelineEvent = {
  dateLabel: string;
  type: string;
  title: string;
};

const events: readonly TimelineEvent[] = [
  {
    dateLabel: "21 July",
    type: "Session",
    title: "Awareness Session",
  },
  {
    dateLabel: "21 July",
    type: "Registration",
    title: "Registration",
  },
  {
    dateLabel: "25 July",
    type: "Workshop",
    title: "LinkedIn Profile Creation & Maintenance",
  },
  {
    dateLabel: "30 July",
    type: "Workshop",
    title: "Excelling in CV Writing",
  },
  {
    dateLabel: "04 August",
    type: "Workshop",
    title: "Mastering the Art of Acing Interviews",
  },
  {
    dateLabel: "06 August",
    type: "Other event",
    title: "Internship and Mock Interview Fair",
  },
] as const;

export default function EventTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const eventRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries.find((entry) => entry.isIntersecting);

        if (activeEntry) {
          const index = Number((activeEntry.target as HTMLElement).dataset.index);
          setActiveIndex(index);
        }
      },
      { rootMargin: "-38% 0px -45%", threshold: 0 },
    );

    eventRefs.current.forEach((event) => {
      if (event) observer.observe(event);
    });

    return () => observer.disconnect();
  }, []);

  const progress = (activeIndex / (events.length - 1)) * 100;

  return (
    <section className="event-timeline" id="timeline">
      <header className="timeline-heading">
        <p>Mark the dates</p>
        <h2>Event Timeline</h2>
        <span>
          From profile building to direct industry exposure, follow every step of
          the Rise Up Mora 2026 journey.
        </span>
      </header>

      <div className="timeline-track">
        <div className="timeline-line" aria-hidden="true">
          <span style={{ height: `${progress}%` }} />
        </div>

        <ol>
          {events.map((event, index) => (
            <li
              className={index <= activeIndex ? "timeline-event--active" : ""}
              data-index={index}
              key={`${event.dateLabel}-${event.title}`}
              ref={(element) => {
                eventRefs.current[index] = element;
              }}
            >
              <time
                className={
                  event.dateLabel === "date to be decided"
                    ? "timeline-date--tbd"
                    : ""
                }
              >
                <strong>{event.dateLabel}</strong>
              </time>

              <div className="timeline-node" aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>

              <article>
                <p>{event.type}</p>
                <h3>{event.title}</h3>
                <span aria-hidden="true">Event {String(index + 1).padStart(2, "0")}</span>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/timeline.module.scss";

interface TimelineEvent {
  date: string;
  content: string;
  image: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    date: "April'20",
    content: "Kaushik & co-founders launch bluepen.",
    image: "/assets/about/start.svg",
  },
  {
    date: "Aug'20",
    content: "First major milestone achieved of bluepen.",
    image: "/assets/about/start2.svg",
  },
  {
    date: "Dec'20",
    content: "Year-end review and planning in bluepen.",
    image: "/assets/about/start3.svg",
  },
  {
    date: "Mar'21",
    content: "Spring product launch under bluepen.",
    image: "/assets/about/start.svg",
  },
  {
    date: "Dec'21",
    content: "Annual growth report of bluepen.",
    image: "/assets/about/start2.svg",
  },
  {
    date: "May'22",
    content:
      "New feature rollout upcoming ye toh latest feature hai in bluepen.",
    image: "/assets/about/start3.svg",
  },
  {
    date: "Jan'23",
    content: "Company expansion masti rukni nahi chahiye ",
    image: "/assets/about/start.svg",
  },
  {
    date: "Apr'23",
    content: "Third year anniversary celebration yoooooooooo.",
    image: "/assets/about/start2.svg",
  },
  {
    date: "Present",
    content: "Looking towards the future kal kisne dekha hai.",
    image: "/assets/about/start3.svg",
  },
];

const Timeline: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleDateClick = (index: number) => {
    setDirection(index > activeIndex ? "right" : "left");
    setActiveIndex(index);
  };

  useEffect(() => {
    if (timelineRef.current) {
      const activeElement = timelineRef.current.children[
        activeIndex
      ] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeIndex]);

  return (
    <div className={styles.timeline}>
      <div className={styles.section4}>
        <div className={styles.section4Row}>
          <div className={styles.section4Content}>
            <img
              src={timelineEvents[activeIndex].image}
              alt={timelineEvents[activeIndex].content}
              className={styles.image}
            />
            <div className={`${styles.section4ContentText} spartan-600`}>
              {timelineEvents[activeIndex].content}
            </div>
            <div className={`${styles.section4ContentDate} spartan-400`}>
              {timelineEvents[activeIndex].date}
            </div>
          </div>
          <div className={styles.section4Content}>
            <img
              src={timelineEvents[activeIndex].image}
              alt={timelineEvents[activeIndex].content}
              className={styles.image}
            />
            <div className={`${styles.section4ContentText} spartan-600`}>
              {timelineEvents[activeIndex].content}
            </div>
            <div className={`${styles.section4ContentDate} spartan-400`}>
              {timelineEvents[activeIndex].date}
            </div>
          </div>
          <div className={styles.section4Content}>
            <img
              src={timelineEvents[activeIndex].image}
              alt={timelineEvents[activeIndex].content}
              className={styles.image}
            />
            <div className={`${styles.section4ContentText} spartan-600`}>
              {timelineEvents[activeIndex].content}
            </div>
            <div className={`${styles.section4ContentDate} spartan-400`}>
              {timelineEvents[activeIndex].date}
            </div>
          </div>
        </div>
      </div>
      {/* <div className={styles.imageContainer}>
        <img
          src={timelineEvents[activeIndex].image}
          alt={timelineEvents[activeIndex].content}
          className={styles.image}
        />
        <p className={styles.content}>{timelineEvents[activeIndex].content}</p>
      </div> */}
      <div className={styles.timelineContainer}>
        <div ref={timelineRef} className={styles.timelineDots}>
          <div className={styles.timelineLine} />
          {timelineEvents.map((event, index) => (
            <div
              key={event.date}
              className={styles.timelineEvent}
              onClick={() => handleDateClick(index)}
            >
              <div className={styles.dotContainer}>
                {index === activeIndex && (
                  <div className={styles.logo}>
                    <img src="/assets/about/bplogo.svg" alt="Logo" />
                  </div>
                )}
                <div
                  className={`${styles.dot} ${
                    index === activeIndex ? styles.activeDot : ""
                  } `}
                />
              </div>
              <span
                className={`${styles.date} spartan-600 ${
                  index === activeIndex ? styles.activeDate : ""
                }spartan-600`}
              >
                {event.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;

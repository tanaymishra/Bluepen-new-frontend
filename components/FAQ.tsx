"use client";
import React, { useState, useEffect } from "react";
import style from "../styles/Homepage.module.scss";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const faqData = [
    {
      question: "What services does Bluepen offer?",
      answer:
        "We provide assistance with all types of assignments, dissertations and phd thesis, coding assignments, and crafting professional SOPs and LORs. We also help you with Turnitin plagiarism reports. Our expert team ensures quality and timely delivery tailored to your needs.",
    },
    {
      question: "Who will work on my assignment?",
      answer:
        "Your assignment will be handled by experienced writers with expertise in that relevant domain. We ensure that each project is assigned to qualified experts who are screened, interviewed and tested for the best results.",
    },
    {
      question: "Can I request revisions after the work is delivered?",
      answer:
        "Yes, we offer revisions to ensure the final output meets your expectations. We offer 2 changes/feedback in the existing assignments as per our changes policy. Simply let us know the changes needed, and we’ll work with you to make it perfect.",
    },
  ];

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div id="faq" className="container">
      <div className={style.section7}>
        <div className={style.content}>
          <h3 className={`${style.heading} spartan-500`}>
            We are here for all your A to Z...
          </h3>
          <h2 className={`${style.title1} spartan-700`}>
            Frequently Asked Questions
          </h2>
          <div className={style.questions}>
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`${style.question} ${
                  activeIndex === index ? style.expanded : ""
                }`}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                onClick={() => handleToggle(index)}
              >
                <div className={style.questionCollapse}>
                  <h3 className={`${style.questionTitle} spartan-600`}>
                    {faq.question}
                  </h3>
                  <svg
                    className={style.collapseIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <div className={style.desc}>
                  <p className="spartan-400">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

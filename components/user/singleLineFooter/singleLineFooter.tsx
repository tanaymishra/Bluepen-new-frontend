import React from "react";
import css from "@/styles/singleLineFooter.module.scss";
import { useRouter } from "next/navigation";
import {
  Twitter,
  Linkedin,
  Instagram,
  HelpCircle,
  MessageCircle,
  ArrowRight,
  Sparkles, // Added for a more interesting effect
} from "lucide-react";

const SingleLineFooter = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const handleNavigation = () => {
    router.push("/#faq");
  };

  return (
    <footer className={css.main}>
      <div className={css.leftCont}>
        <div className={css.logo}>
          <span className={css.brandName}>
            <Sparkles size={16} strokeWidth={1.5} className={css.sparkleIcon} />
            {` Bluepen Assignment Pvt. Ltd.`}
            <span className={css.year}>© {currentYear}</span>
          </span>
        </div>
        <div className={css.socialLinks}>
          <a
            href="https://www.instagram.com/bluepen_assignment_pvt_ltd"
            target="_blank"
            rel="noopener noreferrer"
            className={css.socialIcon}
          >
            <Instagram size={18} strokeWidth={1.5} />
          </a>
          <a
            href="https://www.linkedin.com/company/bluepen-co-in"
            target="_blank"
            rel="noopener noreferrer"
            className={css.socialIcon}
          >
            <Linkedin size={18} strokeWidth={1.5} />
          </a>
        </div>
      </div>
      <div className={css.rightCont}>
        <div
          style={{ cursor: "pointer" }}
          onClick={handleNavigation}
          className={css.helpContainer}
        >
          <HelpCircle size={16} strokeWidth={1.5} />
          {/* <div className={css.help}>Need assistance?</div> */}
        </div>
        <div
          className={css.contact}
          onClick={() => router.push("/contact")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && router.push("/contact")}
        >
          <MessageCircle size={16} strokeWidth={1.5} />
          <span>Contact us</span>
          <ArrowRight size={14} strokeWidth={1.5} className={css.arrowIcon} />
        </div>
      </div>
    </footer>
  );
};

export default SingleLineFooter;

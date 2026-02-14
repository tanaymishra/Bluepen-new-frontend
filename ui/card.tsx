"use client";
import React from "react";
import styles from "../styles/card.module.scss";
import { GoogleReview } from "@/lib/customFunctions/getGoogleReviews";

interface Props {
  review: GoogleReview;
  cardno: number;
}

const Card: React.FC<Props> = ({ cardno, review }) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div className={styles.card}>
      <div className={`${styles.cardspacebetween} spartan-300`}>
        <span className={styles.cardtext}>
          {truncateText(review?.text, 250)}
        </span>
      </div>
      <div className={styles.cardreviewer}>
        <img
          className={styles.cardreviewimg}
          src={review?.profile_photo_url}
          alt={`${review?.author_name}'s profile`}
          onError={(e: any) => {
            console.log("Image failed to load, using fallback.");
            e.currentTarget.src = "/section6.png";
          }}
        />
        <div className={styles.reviewerInfo}>
          <div className={styles.reviewernameTime}>
            <div className={styles.cardreviewname}>{review?.author_name}</div>
            <div className={styles.rating}>
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={
                    index < review?.rating
                      ? styles.starFilled
                      : styles.starEmpty
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="15"
                    height="15"
                    x="0"
                    y="0"
                    viewBox="0 0 511.987 511"
                    xmlSpace="preserve"
                  >
                    <g>
                      <path
                        fill="#ffc107"
                        d="M510.652 185.902a27.158 27.158 0 0 0-23.425-18.71l-147.774-13.419-58.433-136.77C276.71 6.98 266.898.494 255.996.494s-20.715 6.487-25.023 16.534l-58.434 136.746-147.797 13.418A27.208 27.208 0 0 0 1.34 185.902c-3.371 10.368-.258 21.739 7.957 28.907l111.7 97.96-32.938 145.09c-2.41 10.668 1.73 21.696 10.582 28.094 4.757 3.438 10.324 5.188 15.937 5.188 4.84 0 9.64-1.305 13.95-3.883l127.468-76.184 127.422 76.184c9.324 5.61 21.078 5.097 29.91-1.305a27.223 27.223 0 0 0 10.582-28.094l-32.937-145.09 111.699-97.94a27.224 27.224 0 0 0 7.98-28.927zm0 0"
                        opacity="1"
                        data-original="#ffc107"
                      ></path>
                    </g>
                  </svg>
                </span>
              ))}
            </div>
          </div>
          <div className={styles.reviewTime}>
            {review?.relative_time_description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

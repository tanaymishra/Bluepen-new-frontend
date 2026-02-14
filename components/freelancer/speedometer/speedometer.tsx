import React, { useEffect, useState } from "react";
import styles from "@/styles/freelancer/components/speedometer.module.scss";

interface SpeedometerProps {
  // distinctions: number;
  // merits: number;
  // passing: number;
  averageMarks?: number;
}

const Speedometer: React.FC<SpeedometerProps> = ({ averageMarks }) =>
  // {distinctions,merits,passing}

  {
    const [average, setAverage] = useState<number>(0);

    // useEffect(() => {
    //   const total = distinctions + merits + passing;
    //   setAverage(total > 0 ? Math.round(total / 3) : 0);
    // }, [distinctions, merits, passing]);

    const merits = 63;
    const distinctions = 8;
    const passing = 59;

    // useEffect(() => {
    //   const total = distinctions + merits + passing;
    //   setAverage(total > 0 ? Math.round(total / 3) : 0);
    // }, [distinctions, merits, passing]);

    const size = 180;
    const strokeWidth = 15;
    const radius = size / 2 - strokeWidth / 2;

    const createArc = (startAngle: number, endAngle: number, color: string) => {
      const start = polarToCartesian(startAngle);
      const end = polarToCartesian(endAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      return (
        <path
          d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      );
    };

    const polarToCartesian = (angleInDegrees: number) => {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: size / 2 + radius * Math.cos(angleInRadians),
        y: size / 2 + radius * Math.sin(angleInRadians),
      };
    };

    const total = distinctions + merits + passing;
    const distinctionAngle = (distinctions / total) * 180;
    const meritAngle = (merits / total) * 180;
    const passingAngle = (passing / total) * 180;

    return (
      <div className={styles.speedometer}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {createArc(0, distinctionAngle, "#28A87B")}
          {createArc(
            distinctionAngle + 13,
            distinctionAngle + meritAngle,
            "#F3BE2E"
          )}
          {createArc(distinctionAngle + meritAngle + 13, 180, "#DB6060")}
        </svg>
        <div className={styles.percentage}>
          <span>{averageMarks}%</span>
          <div className={styles.label}>Average</div>
        </div>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div
              className={styles.colorIndicator}
              style={{ backgroundColor: "#28A87B" }}
            ></div>
            Distinction
          </div>
          <div className={styles.legendItem}>
            <div
              className={styles.colorIndicator}
              style={{ backgroundColor: "#F3BE2E" }}
            ></div>
            Merit
          </div>
          <div className={styles.legendItem}>
            <div
              className={styles.colorIndicator}
              style={{ backgroundColor: "#DB6060" }}
            ></div>
            Passing
          </div>
        </div>
      </div>
    );
  };

export default Speedometer;

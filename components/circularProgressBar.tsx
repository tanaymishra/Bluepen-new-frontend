import React from "react";

interface CircularProgressBarProps {
  sqSize?: number;
  strokeWidth?: number;
  completedAssignments: number;
  totalAssignments: number;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  sqSize = 200,
  strokeWidth = 10,
  completedAssignments,
  totalAssignments,
}) => {
  const percentage = (completedAssignments / totalAssignments) * 100;
  const radius = (sqSize - strokeWidth) / 2;
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * percentage) / 100;

  return (
    <div className="flex flex-col items-center">
      <svg width={sqSize} height={sqSize} viewBox={viewBox}>
        <circle
          className="circle-background"
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          style={{ fill: "none", stroke: "#ddd" }}
        />
        <circle
          className="circle-progress"
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
          style={{
            fill: "none",
            stroke: "#6F34FF",
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
            strokeLinecap: "round",
            transition: "stroke-dashoffset 0.5s ease-out",
          }}
        />
        <image
          href="/assets/freelancerDashboard/trophy.svg"
          x={sqSize / 2 - 20}
          y={sqSize / 2 - 20}
          height="40px"
          width="40px"
        />
      </svg>
    </div>
  );
};

export default CircularProgressBar;

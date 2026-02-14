import React from "react";

interface CircularProgressBarProps {
    sqSize?: number;
    strokeWidth?: number;
    completedAssignments: number;
    totalAssignments: number;
    color: string,
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
    sqSize = 200,
    strokeWidth = 10,
    completedAssignments,
    totalAssignments,
    color,
}) => {
    const percentage = (completedAssignments / totalAssignments) * 100;
    const radius = (sqSize - strokeWidth) / 2;
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - (dashArray * percentage) / 100;

    return (
        <div
            style={
                {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }
            }
        >
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
                        stroke: color,
                        strokeDasharray: dashArray,
                        strokeDashoffset: dashOffset,
                        strokeLinecap: "round",
                        transition: "stroke-dashoffset 0.5s ease-out",
                    }}
                />
                <image
                    href="/assets/freelancer/rewards/reward.svg"
                    x={sqSize / 2 - 10}
                    y={sqSize / 2 - 10}
                    height="19px"
                    width="22px"
                />
            </svg>
        </div>
    );
};

export default CircularProgressBar;
"use client";
import React, { useState } from "react";

interface Pill {
  name: string;
}

interface FilterPillsProps {
  pillsData: Pill[];
  selectedPill?: string;
  onPillSelect?: (pill: string) => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({
  pillsData,
  selectedPill: initialSelectedPill,
  onPillSelect,
}) => {
  const [selectedPill, setSelectedPill] = useState(
    initialSelectedPill || pillsData[0].name
  );

  const handlePillClick = (pill: string) => {
    setSelectedPill(pill);
    if (onPillSelect) {
      onPillSelect(pill);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      {pillsData.map((pill, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "SF Pro Text",
            fontWeight: 400,
            fontSize: "13px",
            lineHeight: "17.71px",
            width: "52px",
            height: "34px",
            padding: "4px 8px",
            borderRadius: "8px",
            backgroundColor:
            selectedPill === pill.name ? "var(--primary)" : "#FFFFFF",
            color: selectedPill === pill.name ? "white" : "#444444",
            cursor: "pointer",
          }}
          onClick={() => handlePillClick(pill.name)}
        >
          {pill.name}
        </div>
      ))}
    </div>
  );
};

export default FilterPills;

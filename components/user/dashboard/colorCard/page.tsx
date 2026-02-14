import React from "react";
import styles from "@/styles/dashboardSection2.module.scss";

interface StatCardProps {
  value: string | number;
  label: string;
  bgColor: "blue" | "purple" | "green" | "pink";
}

const ColorCard: React.FC<StatCardProps> = ({ value, label, bgColor }) => {
  return (
    <div className={`${styles.stat} ${styles[bgColor]} paint-400`}>
      <h2>{value}</h2>
      <p>{label}</p>
    </div>
  );
};

export default ColorCard;

import React from "react";
import styles from "@/styles/ui/inlineSkeletonLoader.module.scss";

interface SimpleSkeletonLoaderProps {
  size?: "small" | "medium" | "large";
  width?: string;
  height?: string;
  inline?: boolean;
  className?: string;
}

const SimpleSkeletonLoader: React.FC<SimpleSkeletonLoaderProps> = ({
  size = "medium",
  width,
  height,
  inline = false,
  className = "",
}) => {
  const sizeClass = styles[size];
  const inlineClass = inline ? styles.inline : "";

  const customStyle = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`${styles.skeletonItem} ${sizeClass} ${inlineClass} ${className}`}
      style={width || height ? customStyle : undefined}
    />
  );
};

export default SimpleSkeletonLoader;

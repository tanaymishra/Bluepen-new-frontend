"use client";

import React, { ReactNode, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "@/styles/freelancer/components/dragComponent.module.scss";

interface Props {
    children: ReactNode;
    style?: React.CSSProperties;
    className?: string;
    defaultTranslateX?: number;
}

interface PillProps extends Props {
    href?: string;
}

const DragComponent: React.FC<Props> = ({ children, style, className, defaultTranslateX = 0 }) => {
    const [xTranslate, setXTranslate] = useState<number>(0);
    const [isClicked, setClicked] = useState(false);
    const [started, setStarted] = useState<number>(0);
    const [initialTranslate, setInitialTranslate] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleDrag = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (isClicked) {
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            setXTranslate(initialTranslate + (started - clientX));
        }
    }, [isClicked, initialTranslate, started]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        setClicked(true);
        setStarted(clientX);
        setInitialTranslate(xTranslate);
    }, [xTranslate]);

    const handleMouseUp = useCallback(() => {
        setClicked(false);
        const container = containerRef.current;
        const content = contentRef.current;
        if (container && content) {
            const containerWidth = container.clientWidth;
            const contentWidth = content.scrollWidth;
            if (contentWidth <= containerWidth) {
                setXTranslate(0);
            } else if (xTranslate < 0) {
                setXTranslate(0);
            } else if (xTranslate > contentWidth - containerWidth) {
                setXTranslate(contentWidth - containerWidth);
            }
        }
    }, [xTranslate]);

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchend", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("touchend", handleMouseUp);
        };
    }, [handleMouseUp]);

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (container && content) {
            const containerWidth = container.clientWidth;
            const contentWidth = content.scrollWidth;
            if (contentWidth > containerWidth) {
                const pillSize = content.children[0].clientWidth;
                setXTranslate(defaultTranslateX * pillSize);
            }
        }
    }, [defaultTranslateX]);

    return (
        <div
            ref={containerRef}
            style={style}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onMouseMove={handleDrag}
            onTouchMove={handleDrag}
            className={`${styles.dragComponentWrapper} ${className || ""}`}
        >
            <div
                ref={contentRef}
                className={styles.overflowControl}
                style={{
                    transform: `translateX(${-xTranslate}px)`,
                }}
            >
                {children}
            </div>
        </div>
    );
};

export const PillDrag: React.FC<PillProps> = ({ children, style, className, href = "" }) => {
    return (
        <div
            className={`${styles.pill} ${className || ""}`}
            style={{
                ...style,
                userSelect: "none",
            }}
        >
            {children}
        </div>
    );
};

export default DragComponent;
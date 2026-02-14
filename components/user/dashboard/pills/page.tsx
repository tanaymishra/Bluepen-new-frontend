"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import styles from '@/styles/pills.module.scss';
import Link from 'next/link'

interface PillTab {
    label: string;
    component: React.ReactNode;
}

interface PillTabsProps {
    tabs: PillTab[];
    activeTab: number;
    onTabChange: (index: number) => void;
}

const Pills: React.FC<PillTabsProps> = ({ tabs, activeTab, onTabChange }) => {
    const tabRefs = useRef<Array<HTMLAnchorElement | null>>([]);
    const indicatorRef = useRef<HTMLDivElement>(null);

    const setTabRef = useCallback((el: HTMLAnchorElement | null, index: number) => {
        tabRefs.current[index] = el;
    }, []);

    useEffect(() => {
        if (indicatorRef.current && tabRefs.current[activeTab]) {
            const activeTabElement = tabRefs.current[activeTab];
            indicatorRef.current.style.width = `${activeTabElement.offsetWidth}px`;
            indicatorRef.current.style.left = `${activeTabElement.offsetLeft}px`;
        }
    }, [activeTab]);

    if (!tabs || tabs.length === 0) {
        return <div>No tabs available</div>;
    }

    return (
        <div className={styles.pillTabsDashboard}>
            <div className={styles.tabD}>
                <div className={styles.indicatorDashboard} ref={indicatorRef}></div>
                {tabs.map((tab, index) => (
                    <Link
                        key={index}
                        href={`/student/${tab.label.toLowerCase()}`}
                        ref={el => {
                            setTabRef(el, index);
                        }}
                        className={`${styles.tabDashboard} ${activeTab === index ? styles.active : ''} spartan-600`}
                        onClick={(e) => {
                            e.preventDefault();
                            onTabChange(index);
                        }}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Pills;
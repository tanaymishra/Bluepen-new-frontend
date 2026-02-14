import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/freelancer/ui/pills.module.scss';

interface PillTab {
    label: string;
}

interface PillTabsProps {
    tabs: PillTab[];
    activeTab?: number;
    onTabChange?: (index: number, label: string) => void;
}

const Pills: React.FC<PillTabsProps> = ({ tabs, activeTab: externalActiveTab, onTabChange }) => {
    const [activeTab, setActiveTab] = useState(externalActiveTab || 0);
    const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const indicatorRef = useRef<HTMLDivElement>(null);

    const handleTabClick = (index: number) => {
        const label = tabs[index].label;
        setActiveTab(index);
        if (onTabChange) {
            onTabChange(index, label);
        }
        const event = new CustomEvent('tabChanged', { detail: { label } });
        window.dispatchEvent(event);
    };

    useEffect(() => {
        if (externalActiveTab !== undefined) {
            setActiveTab(externalActiveTab);
        }
    }, [externalActiveTab]);

    useEffect(() => {
        const activeTabElement = tabRefs.current[activeTab];
        const indicator = indicatorRef.current;

        if (indicator && activeTabElement) {
            indicator.style.width = `${activeTabElement.offsetWidth}px`;
            indicator.style.left = `${activeTabElement.offsetLeft}px`;
        }
    }, [activeTab, tabs]);

    if (!tabs || tabs.length === 0) {
        return <div>No tabs available</div>;
    }

    return (
        <div className={styles.pillTabs}>
            <div className={styles.tabs}>
                <div className={styles.indicator} ref={indicatorRef}></div>
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        ref={(el: HTMLButtonElement | null) => {
                            tabRefs.current[index] = el;
                        }}
                        className={`${styles.tab} ${activeTab === index ? styles.active : ''} notosans-600`}
                        onClick={() => handleTabClick(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Pills;
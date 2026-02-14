import React, { useState, useEffect, useRef } from 'react';

const styles = {
    loaderWrapper: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loaderContent: {
        background: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        minWidth: '300px',
    },
    progressBar: {
        width: '100%',
        height: '6px',
        backgroundColor: '#e2e8f0',
        borderRadius: '3px',
        marginTop: '1rem',
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        backgroundColor: 'var(--primary)',
        transition: 'width 0.3s ease',
        borderRadius: '3px',
    },
    text: {
        fontSize: '1.6rem',
        color: '#2d3748',
        marginBottom: '1rem',
    }
} as const;

interface Props {
    onComplete: () => void;
    label?: string;
    forceShow?: boolean; // New prop to control loader visibility
}

const GenerationLoader = ({ onComplete, label, forceShow = false }: Props) => {
    const [progress, setProgress] = useState(0);
    const progressInterval = useRef<NodeJS.Timeout>(undefined);

    useEffect(() => {
        progressInterval.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    // Stop at 90% if forceShow is true
                    if (forceShow) {
                        clearInterval(progressInterval.current);
                        return 90;
                    }
                    // Complete only if forceShow is false
                    clearInterval(progressInterval.current);
                    onComplete();
                    return 100;
                }
                // Slow down progress as it gets higher
                const increment = Math.max(1, (90 - prev) / 10);
                return prev + increment;
            });
        }, 300);

        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [forceShow, onComplete]);

    // Force progress to 100 when forceShow becomes false
    useEffect(() => {
        if (!forceShow && progress >= 90) {
            setProgress(100);
            onComplete();
        }
    }, [forceShow, progress, onComplete]);

    return (
        <div style={styles.loaderWrapper}>
            <div style={styles.loaderContent}>
                <div style={styles.text}>
                    {progress >= 100 ? 'Invoice Generated!' : label || 'Generating Invoice...'}
                </div>
                <div style={styles.text}>
                    {Math.min(Math.round(progress), 100)}%
                </div>
                <div style={styles.progressBar}>
                    <div
                        style={{
                            ...styles.progress,
                            width: `${Math.min(progress, 100)}%`
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default GenerationLoader;
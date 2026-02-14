import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import styles from "@/styles/ui/toast.module.scss";

interface ToastProps {
    message: string;
    onClose: () => void;
    duration?: number;
    type: "success" | "error" | "info" | "warning";
}

const iconMap = {
    success: <CheckCircle size={20} strokeWidth={2.5} />,
    error: <AlertCircle size={20} strokeWidth={2.5} />,
    info: <Info size={20} strokeWidth={2.5} />,
    warning: <AlertTriangle size={20} strokeWidth={2.5} />
};

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 4000, type }) => {
    const [mounted, setMounted] = useState(false);
    const [exiting, setExiting] = useState(false);
    const timerRef = useRef<NodeJS.Timeout>(undefined);
    const progressRef = useRef<number>(100);
    const animationFrameRef = useRef<number>(undefined);
    const startTimeRef = useRef<number>(undefined);

    const startProgress = () => {
        startTimeRef.current = Date.now();
        const animate = () => {
            const elapsed = Date.now() - (startTimeRef.current || 0);
            progressRef.current = Math.max(0, 100 * (1 - elapsed / duration));

            if (progressRef.current > 0) {
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };
        animationFrameRef.current = requestAnimationFrame(animate);
    };

    const cleanupTimers = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    const handleClose = () => {
        cleanupTimers();
        setExiting(true);
        setTimeout(onClose, 300); // Match CSS animation duration
    };

    useEffect(() => {
        // Mount animation
        setMounted(true);

        // Start progress and auto-close timer
        startProgress();
        timerRef.current = setTimeout(handleClose, duration);

        return () => cleanupTimers();
    }, [duration]);

    const handleMouseEnter = () => {
        cleanupTimers();
        startTimeRef.current = Date.now() - (duration * (1 - progressRef.current / 100));
    };

    const handleMouseLeave = () => {
        startProgress();
        const remainingTime = duration * (progressRef.current / 100);
        timerRef.current = setTimeout(handleClose, remainingTime);
    };

    const toastClassName = `${styles.toastContainer} ${
        mounted ? styles.visible : ''
    } ${exiting ? styles.hidden : ''}`;

    return (
        <div 
            className={toastClassName}
            role="alert"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`${styles.toastContent} ${styles[type]}`}>
                <div 
                    className={styles.progressLine} 
                    style={{ transform: `scaleX(${progressRef.current / 100})` }} 
                />
                <div className={styles.icon}>
                    {iconMap[type]}
                </div>
                <p className="spartan-500">{message}</p>
                <button 
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                    }} 
                    className={styles.closeButton}
                    aria-label="Close notification"
                >
                    <X size={18} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

export default Toast;
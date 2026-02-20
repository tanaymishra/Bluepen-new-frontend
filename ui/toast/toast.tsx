import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import styles from "@/styles/ui/toast.module.scss";

interface ToastProps {
    message: string;
    onClose: () => void;
    duration?: number;
    type: "success" | "error" | "info" | "warning";
}

const iconMap = {
    success:  <CheckCircle2  size={17} strokeWidth={2.5} />,
    error:    <XCircle       size={17} strokeWidth={2.5} />,
    info:     <Info          size={17} strokeWidth={2.5} />,
    warning:  <AlertTriangle size={17} strokeWidth={2.5} />,
};

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 4000, type }) => {
    const [visible, setVisible]   = useState(false);
    const [exiting, setExiting]   = useState(false);
    const [progress, setProgress] = useState(100);

    const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rafRef    = useRef<number | null>(null);
    const startRef  = useRef<number>(0);
    const pausedAt  = useRef<number>(0); // remaining ms when paused

    const clearAll = () => {
        if (timerRef.current)  clearTimeout(timerRef.current);
        if (rafRef.current)    cancelAnimationFrame(rafRef.current);
    };

    const dismiss = () => {
        clearAll();
        setExiting(true);
        setTimeout(onClose, 260);
    };

    const startCountdown = (remaining: number) => {
        startRef.current = performance.now();
        const startPct   = (remaining / duration) * 100;

        const tick = (now: number) => {
            const elapsed = now - startRef.current;
            const pct     = Math.max(0, startPct - (elapsed / duration) * 100);
            setProgress(pct);
            if (pct > 0) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);

        timerRef.current = setTimeout(dismiss, remaining);
    };

    useEffect(() => {
        // tiny delay so CSS transition fires
        const t = setTimeout(() => setVisible(true), 16);
        pausedAt.current = duration;
        startCountdown(duration);
        return () => { clearAll(); clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMouseEnter = () => {
        clearAll();
        // snapshot remaining time
        const elapsed  = performance.now() - startRef.current;
        const startPct = (pausedAt.current / duration) * 100;
        const usedPct  = (elapsed / duration) * 100;
        const pct      = Math.max(0, startPct - usedPct);
        pausedAt.current = (pct / 100) * duration;
    };

    const handleMouseLeave = () => {
        startCountdown(pausedAt.current);
    };

    return (
        <div
            className={[
                styles.toast,
                visible  ? styles.visible  : '',
                exiting  ? styles.exiting  : '',
                styles[type],
            ].join(' ').trim()}
            role="alert"
            aria-live="polite"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <span className={styles.icon}>{iconMap[type]}</span>

            <p className={styles.message}>{message}</p>

            <button
                type="button"
                onClick={dismiss}
                className={styles.close}
                aria-label="Dismiss"
            >
                <X size={14} strokeWidth={2.5} />
            </button>

            {/* progress bar */}
            <span
                className={styles.progress}
                style={{ transform: `scaleX(${progress / 100})` }}
            />
        </div>
    );
};

export default Toast;

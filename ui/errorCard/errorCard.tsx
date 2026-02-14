import React from 'react';
import styles from '@/styles/ui/errorCard.module.scss';

interface ErrorCardProps {
    message: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ message }) => {
    return (
        <div className={styles.errorCard}>
            <div className={styles.icon}>&#9888;</div>
            <h3 className={styles.title}>Error</h3>
            <p className={styles.message}>{message}</p>
        </div>
    );
};

export default ErrorCard;
import React from 'react';
import styles from '@/styles/ui/skeletonLoader.module.scss';

const SkeletonLoader: React.FC = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonTitle}></div>
        <div className={styles.skeletonStatus}></div>
      </div>
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine}></div>
        <div className={styles.skeletonLine}></div>
        <div className={styles.skeletonLine}></div>
      </div>
      <div className={styles.skeletonFooter}>
        <div className={styles.skeletonCircle}></div>
        <div className={styles.skeletonContact}></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
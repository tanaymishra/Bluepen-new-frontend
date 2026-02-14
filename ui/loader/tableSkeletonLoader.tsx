import React from 'react';
import styles from '@/styles/ui/tableSkeletonLoader.module.scss';

const TableSkeletonLoader: React.FC = () => {
  return (
    <div className={styles.tableSkeletonContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.searchBarSkeleton}></div>
        <div className={styles.filtersSkeleton}>
          <div className={styles.filterItem}></div>
          <div className={styles.filterItem}></div>
          <div className={styles.filterItem}></div>
        </div>
      </div>

      <div className={styles.tableSkeleton}>
        {/* Header Row */}
        <div className={styles.headerRow}>
          {[...Array(6)].map((_, index) => (
            <div key={`header-${index}`} className={styles.headerCell}></div>
          ))}
        </div>
        {/* Table Rows */}
        {[...Array(8)].map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className={styles.tableRow}>
            {[...Array(6)].map((_, cellIndex) => (
              <div key={`cell-${rowIndex}-${cellIndex}`} className={styles.tableCell}></div>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.paginationSkeleton}>
        <div className={styles.paginationGroup}>
          {[...Array(3)].map((_, index) => (
            <div key={`left-${index}`} className={styles.paginationItem}></div>
          ))}
        </div>
        <div className={styles.paginationGroup}>
          {[...Array(3)].map((_, index) => (
            <div key={`right-${index}`} className={styles.paginationItem}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSkeletonLoader;
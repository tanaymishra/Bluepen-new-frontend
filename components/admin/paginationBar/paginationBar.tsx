import React from "react";
import styles from './paginationBar.module.scss';

interface PaginationBarProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    pageSizeOptions?: number[];
    onNextPage: () => void;
    onPreviousPage: () => void;
    totalItems?: number; // Add total items count
}

const PaginationBar: React.FC<PaginationBarProps> = ({
    currentPage,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [25, 50, 100, 500, 1000],
    onNextPage,
    onPreviousPage,
    totalItems,
}) => {
    const pageNumbers = Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1);
    
    // Calculate the range of items being displayed
    let startItem = 0;
    let endItem = 0;
    
    if (totalItems && totalItems > 0) {
        startItem = ((currentPage - 1) * pageSize) + 1;
        endItem = Math.min(currentPage * pageSize, totalItems);
    }

    // For displaying in the UI
    const showingText = totalItems && totalItems > 0 
        ? `Showing ${startItem}-${endItem} of ${totalItems} entries`
        : "No entries to display";

    return (
        <div className={styles.paginationContainer}>
            <div className={styles.navControls}>
                <div className={styles.navButtons}>
                    <button 
                        onClick={onPreviousPage} 
                        disabled={currentPage <= 1}
                        aria-label="Previous page"
                    >
                        <img src="/assets/admin/assignments/arrowLeft.png" alt="Previous" />
                    </button>
                    <button 
                        onClick={onNextPage} 
                        disabled={currentPage >= totalPages || totalPages <= 1}
                        aria-label="Next page"
                    >
                        <img src="/assets/admin/assignments/arrowRight.png" alt="Next" />
                    </button>
                </div>

                <div className={styles.entriesControl}>
                    <span>Show</span>
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        aria-label="Number of entries per page"
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    <span>entries</span>
                </div>
            </div>
            
            <div className={styles.entriesSummary}>
                {showingText}
            </div>

            <div className={styles.pageInfo}>
                <span>Page</span>
                <select
                    value={currentPage}
                    onChange={(e) => onPageChange(Number(e.target.value))}
                    aria-label="Current page"
                    disabled={totalPages <= 1}
                >
                    {pageNumbers.map((pageNumber) => (
                        <option key={pageNumber} value={pageNumber}>
                            {pageNumber}
                        </option>
                    ))}
                </select>
                <span>of {totalPages || 1}</span>
            </div>
        </div>
    );
};

export default PaginationBar;
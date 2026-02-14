import React from 'react';
import styles from '@/styles/freelancer/invoiceErrorModal.module.scss';

interface InvoiceErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage?: string;
}

const InvoiceErrorModal: React.FC<InvoiceErrorModalProps> = ({
  isOpen,
  onClose,
  errorMessage = "We couldn't generate your invoice. Please try again or contact support."
}) => {
  if (!isOpen) return null;

  const handleTryAgain = () => {
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.closeBtn} onClick={onClose}>×</div>
        
        <div className={styles.errorIcon}>
          <img src="/assets/freelancer/invoice/error-icon.svg" alt="Error" />
        </div>
        
        <h3 className={styles.errorTitle}>Invoice Generation Failed</h3>
        
        <p className={styles.errorMessage}>
          {errorMessage}
        </p>
        
        <div className={styles.actionButtons}>
          <button 
            className={styles.secondaryBtn} 
            onClick={onClose}
          >
            Close
          </button>
          
          <button 
            className={styles.primaryBtn} 
            onClick={handleTryAgain}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceErrorModal;

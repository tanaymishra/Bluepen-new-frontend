import React from 'react';
import styles from '@/styles/freelancer/invoiceSuccessModal.module.scss';

interface InvoiceSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceUrl: string;
  invoiceId?: string;
}

const InvoiceSuccessModal: React.FC<InvoiceSuccessModalProps> = ({
  isOpen,
  onClose,
  invoiceUrl,
  invoiceId
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    if (invoiceUrl) {
      window.open(invoiceUrl, "_blank");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.closeBtn} onClick={onClose}>×</div>
        
        <div className={styles.successIcon}>
          <img src="/assets/freelancer/invoice/success-checkmark.svg" alt="Success" />
        </div>
        
        <h3 className={styles.successTitle}>Invoice Generated Successfully!</h3>
        
        {invoiceId && (
          <p className={styles.invoiceId}>Invoice ID: <span>{invoiceId}</span></p>
        )}
        
        <p className={styles.successMessage}>
          Your invoice has been successfully generated and is ready for download.
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
            onClick={handleDownload}
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSuccessModal;

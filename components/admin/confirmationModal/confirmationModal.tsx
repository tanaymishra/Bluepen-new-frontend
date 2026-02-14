import React, { ReactNode } from 'react';
import Modal from '@/ui/modal/modal';
import styles from './confirmationModal.module.scss';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string | ReactNode;
  onConfirm: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
  modalStyle?: React.CSSProperties;
  isSuccess?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmButtonText = 'Yes, Delete',
  cancelButtonText = 'Cancel',
  modalStyle = { width: 'fit-content' },
  isSuccess = false
}: ConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isMinimal
      style={modalStyle}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.modalh2}>{title}</h2>
        <p className={styles.modalP}>{message}</p>
        <div className={styles.modalActions}>
          <button 
            className={isSuccess ? styles.successBtnModal : styles.deleteBtnModal} 
            onClick={onConfirm}
          >
            {confirmButtonText}
          </button>
          <button className={styles.cancelBtnModal} onClick={onClose}>
            {cancelButtonText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

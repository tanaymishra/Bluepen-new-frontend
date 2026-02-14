// components/Modal.tsx
import React from 'react';
import { X } from 'lucide-react';
import css from "./modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  modalBodyStyle?: React.CSSProperties;
  isMinimal?: boolean; // New optional prop
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, style, modalBodyStyle, isMinimal }) => {
  if (!isOpen) return null;

  return (
    <div className={css.modalOverlay} onClick={onClose}>
      <div 
        className={`${css.modalContent} ${isMinimal ? css.modalContentMinimal : ''}`} 
        style={style} 
        onClick={(e) => e.stopPropagation()}
      >
        {!isMinimal && <button className={css.closeButton} onClick={onClose}>X</button>}
        <div 
          className={isMinimal ? css.modalBodyMinimal : css.modalBody} 
          style={modalBodyStyle}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
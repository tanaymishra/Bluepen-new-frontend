import React, { useState } from 'react';
import Dropdown from "@/components/admin/dropdown/dropdown";
import css from '@/styles/admin/studentprofile.module.scss';

interface CreditPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentAmount: number;
  userAssignments: Array<{id: number; title: string;}>;
  onSettle: (assignmentId: string) => Promise<void>;
  onPay: () => Promise<void>;
}

const CreditPayModal: React.FC<CreditPayModalProps> = ({
  isOpen,
  onClose,
  paymentAmount,
  userAssignments,
  onSettle,
  onPay
}) => {
  const [isSettleMode, setIsSettleMode] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState({ id: "", title: "" });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (isSettleMode) {
      onSettle(selectedAssignment.id);
    } else {
      onPay();
    }
  };

  return (
    <div className={css.modalOverlay} onClick={onClose}>
      <div className={css.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={css.modalh2}>Credit Payment</h2>
        <div className={css.modalSeparator}></div>
        <div className={css.modalMainDiv}>
          <p className={css.modalTitle}>Amount: Rs. {paymentAmount}</p>
          <div className={css.radioOptions}>
            <label>
              <input
                type="radio"
                checked={!isSettleMode}
                onChange={() => setIsSettleMode(false)}
              />
              Pay Normally
            </label>
            <label>
              <input
                type="radio"
                checked={isSettleMode}
                onChange={() => setIsSettleMode(true)}
              />
              Settle Against Assignment
            </label>
          </div>
          {isSettleMode && (
            <div className={css.modalBody}>
              <label>Choose Assignment:</label>
              <Dropdown
                options={userAssignments.map(
                  (assignment) => `${assignment.id} ${assignment.title}`
                )}
                defaultOption={"Select Assignment"}
                value={
                  selectedAssignment.id === ""
                    ? ""
                    : selectedAssignment.id + " " + selectedAssignment.title
                }
                onChange={(option: string) => {
                  const [id, ...titleParts] = option.split(" ");
                  setSelectedAssignment({ id, title: titleParts.join(" ") });
                }}
                style={{
                  "--dropdown-border-radius": "8px",
                  "--dropdown-margin-right": "0",
                  "--dropdown-text-color": "#444444",
                  "--dropdown-width": "100%",
                  "--dropdown-background-color": "#fff",
                } as React.CSSProperties}
                onReset={() => setSelectedAssignment({ id: "", title: "" })}
              />
            </div>
          )}
        </div>
        <div className={css.modalSeparator}></div>
        <div className={css.modalActions}>
          <button className={css.approveBtnModal} onClick={handleSubmit}>
            {isSettleMode ? "Settle" : "Pay"}
          </button>
          <button className={css.cancelBtnModal} onClick={onClose}>
            {isSettleMode ? "Cancel" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreditPayModal;

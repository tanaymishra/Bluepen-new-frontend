import React, { useState } from 'react';
import { TransactionReason } from '@/types/transactionTypes';
import css from './modal.module.scss';

interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, reason: string, description: string, assignmentId?: string) => void;
  userAssignments?: Array<{ id: number; title: string; }>;
}

const AddBalanceModal: React.FC<AddBalanceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userAssignments = []
}) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [reason, setReason] = useState<string>(TransactionReason.OTHER);
  const [description, setDescription] = useState<string>('');
  const [assignmentId, setAssignmentId] = useState<string>('');
  const [isAssignmentRelated, setIsAssignmentRelated] = useState<boolean>(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (typeof amount !== 'number' || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (!description) {
      alert('Please enter a description');
      return;
    }
    
    onSubmit(
      amount, 
      reason, 
      description, 
      isAssignmentRelated ? assignmentId : undefined
    );
    
    // Reset form
    setAmount('');
    setReason(TransactionReason.OTHER);
    setDescription('');
    setAssignmentId('');
    setIsAssignmentRelated(false);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={css.modalOverlay} onClick={onClose}>
      <div className={css.modalContent} onClick={e => e.stopPropagation()}>
        <div className={css.modalHeader}>
          <h2>Add Balance</h2>
          <button className={css.closeButton} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={css.modalBody}>
            <div className={css.formGroup}>
              <label htmlFor="amount">Amount (₹)</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value ? Number(e.target.value) : '')}
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
            
            <div className={css.formGroup}>
              <label htmlFor="reason">Reason</label>
              <select
                id="reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
              >
                <option value={TransactionReason.REFERRAL}>Referral</option>
                <option value={TransactionReason.BONUS}>Bonus</option>
                <option value={TransactionReason.REFUND}>Refund</option>
                <option value={TransactionReason.OTHER}>Other</option>
              </select>
            </div>
            
            <div className={css.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter a description for this transaction"
                required
                rows={3}
              />
            </div>
            
            <div className={css.formGroup}>
              <div className={css.checkboxGroup}>
                <input
                  type="checkbox"
                  id="isAssignmentRelated"
                  checked={isAssignmentRelated}
                  onChange={e => setIsAssignmentRelated(e.target.checked)}
                />
                <label htmlFor="isAssignmentRelated">Related to an assignment</label>
              </div>
            </div>
            
            {isAssignmentRelated && (
              <div className={css.formGroup}>
                <label htmlFor="assignmentId">Select Assignment</label>
                <select
                  id="assignmentId"
                  value={assignmentId}
                  onChange={e => setAssignmentId(e.target.value)}
                  required={isAssignmentRelated}
                >
                  <option value="">Select an assignment</option>
                  {userAssignments.map(assignment => (
                    <option key={assignment.id} value={assignment.id.toString()}>
                      #{assignment.id} - {assignment.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className={css.modalFooter}>
            <button 
              type="button" 
              className={css.cancelButton} 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={css.submitButton}
            >
              Add Balance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBalanceModal;
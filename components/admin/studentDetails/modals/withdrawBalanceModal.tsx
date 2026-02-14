import React, { useState } from 'react';
import css from './modal.module.scss';

// Define the allowed withdrawal types to match API requirements
type WithdrawalTypeValues = 'CASH' | 'SETTLEMENT';

interface WithdrawBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, withdrawalType: WithdrawalTypeValues, description: string, assignmentId?: string) => void;
  userAssignments?: Array<any>;
}

const WithdrawBalanceModal: React.FC<WithdrawBalanceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userAssignments = []
}) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [withdrawalType, setWithdrawalType] = useState<WithdrawalTypeValues>('CASH');
  const [description, setDescription] = useState<string>('');
  const [assignmentId, setAssignmentId] = useState<string>('');
  
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
    
    if (withdrawalType === 'SETTLEMENT' && !assignmentId) {
      alert('Please select an assignment for settlement');
      return;
    }
    
    // Send the correct type string to the API
    onSubmit(
      amount,
      withdrawalType, // This is now guaranteed to be 'CASH' or 'SETTLEMENT'
      description, 
      withdrawalType === 'SETTLEMENT' ? assignmentId : undefined
    );
    
    // Reset form
    setAmount('');
    setWithdrawalType('CASH');
    setDescription('');
    setAssignmentId('');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={css.modalOverlay} onClick={onClose}>
      <div className={css.modalContent} onClick={e => e.stopPropagation()}>
        <div className={css.modalHeader}>
          <h2>Withdraw Balance</h2>
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
              <label>Withdrawal Type</label>
              <div className={css.radioGroup}>
                <div className={css.radioOption}>
                  <input
                    type="radio"
                    id="cash"
                    name="withdrawalType"
                    value="CASH"
                    checked={withdrawalType === 'CASH'}
                    onChange={() => setWithdrawalType('CASH')}
                  />
                  <label htmlFor="cash">Cash Withdrawal</label>
                </div>
                <div className={css.radioOption}>
                  <input
                    type="radio"
                    id="settlement"
                    name="withdrawalType"
                    value="SETTLEMENT"
                    checked={withdrawalType === 'SETTLEMENT'}
                    onChange={() => setWithdrawalType('SETTLEMENT')}
                  />
                  <label htmlFor="settlement">Settlement Against Assignment</label>
                </div>
              </div>
            </div>
            
            <div className={css.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={withdrawalType === 'CASH' 
                  ? "Enter a description for this withdrawal" 
                  : "Enter a description for this settlement"
                }
                required
                rows={3}
              />
            </div>
            
            {withdrawalType === 'SETTLEMENT' && (
              <div className={css.formGroup}>
                <label htmlFor="assignmentId">Select Assignment</label>
                <select
                  id="assignmentId"
                  value={assignmentId}
                  onChange={e => setAssignmentId(e.target.value)}
                  required={withdrawalType === 'SETTLEMENT'}
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

            <div className={css.infoBox}>
              <p>
                {withdrawalType === 'CASH' 
                  ? "This will record a cash withdrawal from the user's balance." 
                  : "This will settle the amount against an assignment, reducing the user's balance."
                }
              </p>
            </div>
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
              {withdrawalType === 'CASH' ? "Withdraw" : "Settle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawBalanceModal;
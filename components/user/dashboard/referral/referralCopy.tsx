import React, { useState } from 'react';
import styles from '@/styles/referral.module.scss';
import { Check, Copy } from 'lucide-react';
import { useAuthStore } from '@/authentication/authStore';
import { useAuth } from '@/authentication/authentication';

const ReferralCopy = () => {
    const [isCopied, setIsCopied] = useState(false);
    const {user}=useAuth()
    const handleCopyReferralCode = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(user.referral_code)
                .then(() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                })
                .catch((err) => {
                    console.error('Failed to copy:', err);
                });
        }
    };

    return (
        <div className={styles.referral}>
            <div className={styles.referralBox}>
                <p className='spartan-500'>{`Refer a buddy by using the code aside & earn upto ₹1500 in your wallet`}</p>
                <div className={styles.code}>
                    <span className='spartan-400'>{user.referral_code}</span>
                    <button 
                        className={`${styles.copyButton} spartan-400 ${isCopied ? styles.copied : ''}`} 
                        onClick={handleCopyReferralCode}
                        aria-label="Copy referral code"
                    >
                        {isCopied ? (
                            <Check size={20} className={styles.checkIcon} />
                        ) : (
                            <Copy size={20} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReferralCopy;
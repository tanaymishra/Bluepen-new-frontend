import React, { useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/coupons.module.scss';

interface ReferralSectionProps {
    referralCode: string;
}

const ReferralSection: React.FC<ReferralSectionProps> = ({ referralCode }) => {
    const [buttonContent, setButtonContent] = useState<React.ReactNode>(
        <Image src="/assets/dashboard/copy.png" alt="Copy" width={20} height={20} />
    );

    // Fallback copy function using hidden textarea
    const fallbackCopyTextToClipboard = (text: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;

        // Avoid showing the textarea to the user
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.opacity = '0';

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
            } else {
                console.error('Fallback method failed to copy text');
            }
        } catch (err) {
            console.error('Fallback method error:', err);
        }

        document.body.removeChild(textArea);
    };

    // Main function to handle copy
    const handleCopyReferralCode = () => {
        if (navigator.clipboard) {
            // Use the modern Clipboard API
            navigator.clipboard.writeText(referralCode).then(() => {
                setButtonContent('Copied!');
            }).catch((err) => {
                console.error('Failed to copy using navigator:', err);
                fallbackCopyTextToClipboard(referralCode); // Fallback to manual method
            });
        } else {
            // Use fallback if navigator.clipboard is not supported
            fallbackCopyTextToClipboard(referralCode);
            setButtonContent('Copied!');
        }

        // Reset the button content after 2 seconds
        setTimeout(() => {
            setButtonContent(
                <Image src="/assets/dashboard/copy.png" alt="Copy" width={20} height={20} />
            );
        }, 2000);
    };

    return (
        <div className={styles.referralContainer}>
            <div className={styles.referral}>
                <div className={styles.referralBox}>
                    <p className='spartan-600'>{`Refer a buddy by using the code aside & earn ₹500 in your wallet`}</p>
                    <div className={styles.code}>
                        <span className='spartan-400'>{referralCode}</span>
                        <button className={`${styles.copyButton} spartan-400`} onClick={handleCopyReferralCode}>
                            {buttonContent}
                        </button>
                    </div>
                </div>
                <div className={styles.referralImage}>
                    <Image src="/assets/dashboard/referralGirl.svg" alt="Referral" width={150} height={150} />
                </div>
            </div>
        </div>
    );
};

export default ReferralSection;
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Copy, Check } from 'lucide-react';
import styles from '@/styles/profile.module.scss';
import Link from 'next/link';

interface ReferralSectionProps {
    referralCode: string;
}

const ReferralSection: React.FC<ReferralSectionProps> = ({ referralCode }) => {

    const [isCopied, setIsCopied] = useState(false);

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
                setIsCopied(true);
            }).catch((err) => {
                console.error('Failed to copy using navigator:', err);
                fallbackCopyTextToClipboard(referralCode); // Fallback to manual method
                setIsCopied(true);
            });
        } else {
            // Use fallback if navigator.clipboard is not supported
            fallbackCopyTextToClipboard(referralCode);
            setIsCopied(true);
        }

        // Reset the button content after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
    };


    return (
        <div className={styles.referral}>
            <div className={styles.referralBox}>
                <div className={styles.headingAndSub}>
                    <p className='spartan-400'>{`Share your unique code and earn ₹500 in your wallet for each successful referral`}</p>
                    <span className={styles.subHeading}>
                    Invite your friends to join Bluepen and earn rewards! Get ₹500 for each successful referral when your friend signs up using your code and makes their first purchase. Start sharing and earning today!                    </span>
                </div>
                <div className={styles.code}>
                    <span className='spartan-600'>{referralCode}</span>
                    <button className={styles.copyButton} onClick={handleCopyReferralCode} title={isCopied ? "Copied!" : "Copy code"}>
                        {isCopied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                </div>
            </div>
            <div className={styles.viewLink}>
                {`For more details, `}<Link href="/privacyPolicy" className={styles.view}>{`Click Here`}</Link>
            </div>
            <div className={styles.referralImage}>
                <Image
                    src="/assets/dashboard/referralGirl.svg"
                    alt="Referral"
                    width={180}
                    height={180}
                    priority
                />
            </div>
        </div>
    );
};

export default ReferralSection;
import React, { useEffect, useState } from 'react';
import css from '@/styles/coupons.module.scss';
import { Calendar, Share2, Clock } from 'lucide-react';

const colors = {
    blue: {
        bg: '#2956A8',
        text: '#ffffff'
    },
    green: {
        bg: '#28A87B',
        text: '#ffffff'
    },
    yellow: {
        bg: '#F3BE2E',
        text: '#000000'
    },
    purple: {
        bg: '#7C3AED',
        text: '#ffffff'
    }
};

type ColorKey = keyof typeof colors;

interface ReferralSchemeProps {
    title: string;
    subtitle: string;
    description: string;
    amount: number;
    type: "Percentage" | "Absolute";
}

const ReferralScheme: React.FC<ReferralSchemeProps> = ({ title, subtitle, description, amount, type }) => {
    const [colorKey, setColorKey] = useState<ColorKey>('blue');

    useEffect(() => {
        const colorKeys = Object.keys(colors) as ColorKey[];
        const randomColor = colorKeys[Math.floor(Math.random() * colorKeys.length)];
        setColorKey(randomColor);
    }, []);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Referral Code',
                    text: `Use my referral code: ${title} to get ${type === "Absolute" && "₹" + amount + type === "Percentage" && "%"} off!`,
                    url: window.location.href,
                });
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleApply = () => {
        // TODO: Implement apply functionality
    };

    return (
        <div className={css.scheme}>
            <svg width="60" height="190" viewBox="0 0 60 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_0_1)" className={css.rectCoupon}>
                    <rect width="60" height="198" transform="translate(0 4)" fill={colors[colorKey].bg} />
                    {[52.5, 76.5, 100.5, 124.5, 148.5].map((cy, index) => (
                        <circle key={index} cy={cy} r="6" fill="#E6E3E1" />
                    ))}
                </g>
                <text
                    x="30"
                    y="95"
                    fill={colors[colorKey].text}
                    fontSize="24"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform="rotate(-90 30 95)"
                    className='spartan-600'
                >
                    {type === "Absolute" && "₹"}{amount}{type === "Percentage" && "%"}
                </text>
                <defs>
                    <clipPath id="clip0_0_1">
                        <rect width="60" height="190" fill="white" transform="translate(0 6)" />
                    </clipPath>
                </defs>
            </svg>

            <div className={css.schemeContent}>
                <div className={css.scContent}>
                    <div className={css.header}>
                        <h3 className="spartan-600">{title}</h3>
                        <button className={css.shareButton} onClick={handleShare}>
                            <Share2 size={20} />
                        </button>
                    </div>
                    <p className={`${css.subtitle} spartan-500`}>
                        <Calendar size={16} />
                        <span>Issued on: {subtitle}</span>
                    </p>
                    <p className="spartan-400">
                        <Clock size={16} />
                        <span>Expires on: {description}</span>
                    </p>
                    {/* <button 
                        className={css.applyButton}
                        onClick={handleApply}
                    >
                        Apply Coupon
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default ReferralScheme;
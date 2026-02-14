import React from "react";
import Image from "next/image";
import styles from "@/styles/profile.module.scss";
import ReferralSection from "./referral";
import { useAuth } from "@/authentication/authentication";
import { formatDate } from "@/utils/customJsFunctions/dateFormatJS";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfileData {
  firstname: string;
  lastname: string;
  number: string;
  email: string;
  account_created_on: string;
  wallet?: number;
  referral_code: string;
  email_verified: number;
  number_verified: number;
}

interface ProfileCardProps {
  data: ProfileData;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ data }) => {
  const getCompletionColor = (percentage: number) => {
    switch (percentage) {
      case 60:
        return {
          background: "linear-gradient(135deg, #FEF3C7 0%, #FCD34D 100%)",
          color: "#92400E",
        };
      case 80:
        return {
          background: "linear-gradient(135deg, #FED7AA 0%, #FB923C 100%)",
          color: "#9A3412",
        };
      case 100:
        return {
          background: "linear-gradient(135deg, #D1FAE5 0%, #34D399 100%)",

          color: "#065F46",
        };
      default:
        return {
          background: "linear-gradient(135deg, #FEF3C7 0%, #FCD34D 100%)",
          color: "#92400E",
        };
    }
  };
  const calculateProfileCompletion = () => {
    let percentage = 60;

    if (data?.email_verified === 1) {
      percentage = 80;
    }

    if (data?.number_verified === 1) {
      percentage = 100;
    }

    return percentage;
  };

  const completionPercentage = calculateProfileCompletion();
  const completionStyle = getCompletionColor(completionPercentage);

  const [showVerificationStatus, setShowVerificationStatus] = useState(true);

  return (
    <div className={styles.profileSection}>
      <div className={styles.header}>
        <div
          style={completionStyle}
          className={`${styles.completion} spartan-400`}
        >
          {`Profile Completed ${completionPercentage}%`}
        </div>

      </div>
      <div className={styles.userInfo}>
        <div className={styles.userDetails}>
          <h2
            className={`spartan-600`}
          >{`${data?.firstname} ${data?.lastname}`}</h2>
          <p className={`${styles.memberSince} spartan-400`}>
            {`User since ${formatDate(data?.account_created_on, "full")}`}
          </p>
        </div>
        <p className={`${styles.balance} spartan-400`}>
          {`₹ ${data.wallet}`}
        </p>
      </div>

      <div className={styles.details}>
        {Object.entries({
          Name: data?.firstname,
          "Last name": data?.lastname,
          Phone: data?.number,
          email: data?.email,
        }).map(([label, value]) => (
          <div key={label} className={styles.detailItem}>
            <h3 className={`spartan-400`}>{label}</h3>
            <p className={`spartan-600`}>{value}</p>
          </div>
        ))}
      </div>
      <ReferralSection referralCode={data?.referral_code} />
    </div>
  );
};

export default ProfileCard;

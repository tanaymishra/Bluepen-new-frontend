import React from "react";
import styles from "@/styles/freelancer/form.module.scss";

interface TalentSelectorProps {
  selectedTalents: string[];
  onTalentChange: (talent: string) => void;
  talents?: string[];
  label?: string;
  required?: boolean;
}

export const TalentSelector: React.FC<TalentSelectorProps> = ({
  selectedTalents,
  onTalentChange,
  talents = [],
  label = "Assignment Types You Specialize in",
  required = false,
}) => {
  return (
    <>
      <div className={styles.formInputs}>
        {label} {required && <span className={styles.reqStar}>*</span>}
      </div>
      <div className={styles.talents}>
        <div className={styles.talentGrid}>
          {talents.map((talent) => (
            <label key={talent}>
              <input
                type="checkbox"
                checked={selectedTalents.includes(talent)}
                onChange={() => onTalentChange(talent)}
              />
              {talent}
            </label>
          ))}
        </div>
      </div>
    </>
  );
};

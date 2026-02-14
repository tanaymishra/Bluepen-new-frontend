import React from "react";
import css from "@/styles/admin/markLeaves.module.scss";

interface RadioButtonProps {
  options: string[];
  name: string;
  updateKey?: string;
  customStyles?: React.CSSProperties;
  update: (key: any, value: any) => void;
  //   update: (key: string, value: string) => void;
  formData: any;
  className?: string;
  label?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  options,
  name,
  updateKey,
  customStyles,
  update,
  formData,
  className,
  label,
}) => {
  const handleChange = (value: string) => {
    update(updateKey, value);
  };

  return (
    <div className={`${css.roleRadioInputBox} ${className} `} style={customStyles}>
      <div className={css.radioText}>
        <div className={css.radioLabel}>{label ? label : `Type`}</div>
        {<span className={css.required}>*</span>}
      </div>
      <div className={css.radioBtns}>
        {options.map((option) => (
          <label key={option} className={css.radio}>
            <input
              type="radio"
              name={name}
              value={option}
              checked={formData === option}
              className={css.customRadio}
              onChange={(e) => handleChange(e.target.value)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioButton;

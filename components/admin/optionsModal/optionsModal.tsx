import React, { useEffect, useRef } from "react";
import css from "@/styles/admin/dashboard.module.scss";

interface OptionWithLabel {
  label: string;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}

interface OptionWithComponent {
  component: React.ReactNode;
}

type Option = OptionWithLabel | OptionWithComponent;

interface OptionsModalProps {
  isOpen: boolean;
  options: Option[];
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
  itemClassName?: string;
  itemStyle?: React.CSSProperties;
  modalRef?: React.RefObject<HTMLDivElement | null>;
  btnRef?: React.RefObject<HTMLDivElement | null>;
}

const OptionsModal: React.FC<OptionsModalProps> = ({
  isOpen,
  options,
  onClose,
  className,
  style,
  itemClassName,
  itemStyle,
  modalRef,
  btnRef,
}) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = modalRef || internalRef;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        btnRef?.current &&
        !btnRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, ref, btnRef]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={className || css.optionsModal}
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      {options.map((option, index) => {
        if ("component" in option) {
          // Render the custom component directly
          return <div key={index}>{option.component}</div>;
        } else {
          // Render the option with label and onClick
          return (
            <div
              key={index}
              className={option.className || itemClassName || css.modalItem}
              style={option.style || itemStyle}
              onClick={() => {
                option.onClick();
                onClose();
              }}
            >
              {option.label}
            </div>
          );
        }
      })}
    </div>
  );
};

export default OptionsModal;

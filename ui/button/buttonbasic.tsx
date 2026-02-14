"use client"
import React, { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import Link from 'next/link';
import css from "@/styles/ui/buttonBasic.module.scss"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'custom';
  disabled?: boolean;
  onClickAsync?: () => Promise<boolean>;
  setDisabledAfterClick?: boolean;
  href?: string;
}

const ButtonBasic = forwardRef<HTMLButtonElement, ButtonProps>(({
  label,
  children,
  variant = 'primary',
  disabled = false,
  onClickAsync,
  setDisabledAfterClick = false,
  className,
  href,
  ...rest
}, ref) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(disabled);

  if (!label && !children) {
    throw new Error('ButtonBasic must have either label or children prop');
  }

  const handleClick = async () => {
    if (onClickAsync) {
      setIsLoading(true);
      try {
        const shouldDisable = await onClickAsync();
        if (setDisabledAfterClick && shouldDisable) {
          setIsButtonDisabled(true);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const buttonElement = (
    <button
      ref={ref}
      className={`${css.btn} ${css[variant]} ${isLoading ? css.loading : ''} ${className || ''}`}
      disabled={isButtonDisabled || isLoading}
      onClick={handleClick}
      {...rest}
    >
      {isLoading ? (
        <span className={css.spinner}></span>
      ) : children || label}
    </button>
  );

  return href ? (
    <Link href={href} className={css.link}>
      {buttonElement}
    </Link>
  ) : buttonElement;
});

ButtonBasic.displayName = 'ButtonBasic';
export default ButtonBasic;

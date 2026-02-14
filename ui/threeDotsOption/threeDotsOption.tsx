import React, { RefObject } from 'react';
import css from './threeDotsOption.module.scss';

interface ThreeDotsOptionsProps {
    btnRef?: RefObject<HTMLDivElement | null>;
    onClick: (e: React.MouseEvent) => void;
    className?: string;
}

const ThreeDotsOption: React.FC<ThreeDotsOptionsProps> = ({ btnRef, onClick, className }) => {
    return (
        <div
            className={`${css.moreOptions} ${className || ''}`}
            ref={btnRef}
            onClick={(e) => {
                e.stopPropagation();
                onClick(e);
            }}
        >
            <div className={css.dot}></div>
            <div className={css.dot}></div>
            <div className={css.dot}></div>
        </div>
    );
};

export default ThreeDotsOption;
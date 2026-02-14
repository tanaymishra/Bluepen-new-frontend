import React from 'react';
import css from '@/styles/ui/loader.module.scss';

interface LoaderProps {
    size?: 'small' | 'medium' | 'large';
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium' }) => {
    return (
        <div className={`${css.loaderContainer} ${css[size]}`}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                justifyItems: "center",
            }}
        >
            <img
                src="/assets/logo/bluepenLogo.webp"
                alt="Bluepen Logo"
                className="logo"
            />
        </div>
  );
};

export default Loader;
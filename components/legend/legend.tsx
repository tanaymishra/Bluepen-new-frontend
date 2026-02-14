import React from 'react';
import css from './legend.module.scss';

interface LegendItem {
    color: string;
    label: string;
    count?: number;
}

interface LegendProps {
    items: LegendItem[];
}

const Legend: React.FC<LegendProps> = ({ items }) => {
    return (
        <div className={css.legend}>
            {items.map((item, index) => (
                <div key={index} className={css.legendRow}>
                    <div
                        className={css.circle}
                        style={{ backgroundColor: item.color }}
                    />
                    <div className={css.legendText}>
                        {item.count !== undefined ? `${item.count} ${item.label}` : item.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Legend;
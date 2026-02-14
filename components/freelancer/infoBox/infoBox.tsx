import React from 'react';
import css from './infoBox.module.scss';
import { NotebookPenIcon } from 'lucide-react';

interface InfoPoint {
    id: number;
    text: string;
}

interface InfoBoxProps {
    points: InfoPoint[];
    className?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ points, className }) => {
    return (
        <div className={`${css.infoBox} ${className || ''}`}>
            <div className={css.header}>
                <NotebookPenIcon size={24} color='#b22b28'/>
                <span>{`How to Use?`}</span>
            </div>
            <ul className={css.pointsList}>
                {points.map((point) => (
                    <li key={point.id} className={css.point}>
                        {point.text}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InfoBox;
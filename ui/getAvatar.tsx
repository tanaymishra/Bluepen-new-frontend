import React from "react";
import Image from "next/image";
import css from "@/styles/ui/avatar.module.scss";

interface AvatarProps {
    name: string;
    profileImage?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, profileImage }) => {
    const getInitials = (fullName: string) => {
        const names = fullName.split(" ");
        const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");
        return initials.slice(0, 2);
    };

    return (
        <div className={css.avatar}>
            {profileImage ? (
                <img
                    src={profileImage}
                    alt={name}
                    className={css.avatarImage}
                />
            ) : (
                <div className={css.avatarInitials}>{getInitials(name)}</div>
            )}
        </div>
    );
};

export default Avatar;
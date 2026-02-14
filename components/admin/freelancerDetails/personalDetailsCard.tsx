import React from 'react';
import Image from 'next/image';
import css from '@/styles/admin/freelancerDetails.module.scss';
import { useAuth } from '@/authentication/authentication';
import { formatDate } from '@/utils/customJsFunctions/dateFormatJS';
import { useRouter } from 'next/navigation';

interface PersonalDetailsCardProps {
    freelancerDetails: any;
    fileURL: string;
    freelancerId?: string | null;
}

const NotAvailable = () => {
    return <div className={css.notAvailable}>Not Available</div>;
};

const PersonalDetailsCard: React.FC<PersonalDetailsCardProps> = ({
    freelancerDetails,
    fileURL,
    freelancerId,
}) => {
    const { user } = useAuth();
    const router = useRouter();

    const getLevelIcon = (level: string) => {
        const lvl = level.toLowerCase();
        if (lvl.includes("bronze")) return "/assets/freelancer/rewards/bronze.svg";
        if (lvl.includes("silver")) return "/assets/freelancer/rewards/silver.svg";
        if (lvl.includes("gold")) return "/assets/freelancer/rewards/gold.svg";
        if (lvl.includes("diamond")) return "/assets/freelancer/rewards/diamond.svg";
        return "/assets/freelancer/rewards/bronze.svg";
    };

    return (
        <div className={css.assignDetailsCard}>
            <Image
                src="/assets/admin/freelancer/imgWebBack.svg"
                alt=""
                height={20}
                width={20}
            />
            {freelancerDetails.statusDetails.is_approved === 1 ? (
                <div className={css.reward}>
                    <div className={css.levelImg}>
                        <img src={getLevelIcon(freelancerDetails?.incoming_level || "N/A")} alt="" />
                    </div>
                    <div className={css.rewardColumn}>
                        <div className={`${css.incoming} notosans-400`}>incoming</div>
                        <div className={`${css.rewardName} notosans-600`}>
                            {freelancerDetails?.rewardsInfo.next_level.level}{" "}
                            <img
                                src="/assets/freelancer/dashboard/rewardArrow.svg"
                                alt="rewardArrow"
                            />
                        </div>
                    </div>
                </div>
            ) : (null)}


            <span className={css.lastEditText}>
                last edited on {formatDate(freelancerDetails?.professionalDetails?.last_updated, "full")}
            </span>


            {freelancerDetails?.professionalDetails?.profile_photo ? (
                <img
                    src={`${fileURL}/file/freelancers/profile_photo/${freelancerDetails.professionalDetails.profile_photo}`}
                    alt="Profile Photo"
                    className={css.profilePhoto}
                />
            ) : (
                <div className={css.nameCircle}>
                    {freelancerDetails?.personalDetails?.first_name?.[0]}
                    {freelancerDetails?.personalDetails?.last_name?.[0]}
                </div>

            )}


            <div className={css.assignDetailsBox}>
                <div className={css.NameNbutton}>
                    <div className={css.name}>
                        {freelancerDetails?.personalDetails?.first_name}{" "}
                        {freelancerDetails?.personalDetails?.last_name}
                    </div>
                    {(user?.role === "Admin" || user?.role === "HR") && (
                        <div
                            className={css.timelineButton}
                            onClick={() => {
                                router.push(
                                    `/admin/freelancers/details/edit?id=${freelancerId}`
                                );
                            }}
                        >
                            {`Update Profile`}
                        </div>
                    )}
                </div>
                <div className={css.personalDetails}>
                    <div className={`${css.rowContainer}`}>
                        <div className={css.rowfield}>
                            <div className={css.fieldName}>Email</div>
                            <div className={css.fieldValue}>
                                <a
                                    href={`mailto:${freelancerDetails?.personalDetails?.email}`}
                                    className={css.telmailtofnc}
                                >
                                    {freelancerDetails?.personalDetails?.email ? (
                                        freelancerDetails?.personalDetails?.email
                                    ) : (
                                        <NotAvailable />
                                    )}
                                </a>
                            </div>
                        </div>

                        <div className={css.rowfield}>
                            <div className={css.fieldName}>Whatsapp</div>
                            <div className={css.fieldValue}>
                                <a
                                    href={`https://wa.me/${freelancerDetails?.personalDetails?.country_code}${freelancerDetails?.personalDetails?.number}`}
                                    className={css.telmailtofnc}
                                >
                                    {freelancerDetails?.personalDetails?.number ? (
                                        freelancerDetails?.personalDetails?.number
                                    ) : (
                                        <NotAvailable />
                                    )}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className={`${css.rowContainer}`}>
                        <div className={css.rowfield}>
                            <div className={css.fieldName}>Phone</div>
                            <div className={css.fieldValue}>
                                <a
                                    href={`tel:${freelancerDetails?.personalDetails?.whatsapp}`}
                                    className={css.telmailtofnc}
                                >
                                    {freelancerDetails?.personalDetails?.whatsapp ? (
                                        freelancerDetails?.personalDetails?.whatsapp
                                    ) : (
                                        <NotAvailable />
                                    )}
                                </a>
                            </div>
                        </div>
                        <div className={css.rowfield}>
                            <div className={css.fieldName}>Gender</div>
                            <div className={css.fieldValue}>
                                {freelancerDetails?.personalDetails?.gender ? (
                                    freelancerDetails?.personalDetails?.gender
                                ) : (
                                    <NotAvailable />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`${css.rowContainer}`}>
                        <div className={css.rowfield}>
                            <div className={css.fieldName}>Address</div>
                            <div className={css.fieldValue}>
                                {freelancerDetails?.personalDetails?.address}{" "}
                                {freelancerDetails?.personalDetails?.street}{" "}
                                {freelancerDetails?.personalDetails?.city}{" "}
                                {freelancerDetails?.personalDetails?.state}{" "}
                                {freelancerDetails?.personalDetails?.pincode}{" "}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalDetailsCard;

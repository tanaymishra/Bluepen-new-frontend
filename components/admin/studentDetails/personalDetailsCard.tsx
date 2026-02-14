import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/authentication/authentication';
import { useToast } from '@/context/toastContext';
import { formatDate } from '@/utils/customJsFunctions/dateFormatJS';
import css from '@/styles/admin/studentprofile.module.scss';
import SkeletonLoader from '@/ui/loader/skeletonLoader';

interface PersonalDetailsCardProps {
    studentId: string | null;
    baseURL: string;
    userToken: string | undefined;
    onDetailsUpdate: (details: any, navigation: any) => void;
}

const PersonalDetailsCard = ({ studentId, baseURL, userToken, onDetailsUpdate }: PersonalDetailsCardProps) => {
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [isSelected, setIsSelected] = useState<boolean>(true);
    const [imageSrc, setImageSrc] = useState("/assets/admin/students/studentProfileMobile.svg");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentDetails, setStudentDetails] = useState<any>(null);

    useEffect(() => {
        if (window.innerWidth >= 768) {
            setImageSrc("/assets/admin/students/studentProfile.svg");
        } else {
            setImageSrc("/assets/admin/students/studentProfileMobile.svg");
        }
    }, []);

    const fetchUserDetails = async () => {
        if (!userToken) return;
        try {
            const response = await fetch(`${baseURL}/team/userPersonalDetails`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    id: studentId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const { userDetails } = data;

                // Update parent component with details and navigation
                onDetailsUpdate(userDetails, {
                    prevId: data?.previousUserId,
                    nextId: data?.nextUserId,
                });
                // Local state updates
                setIsSelected(userDetails.is_select !== 1);
                setStudentDetails(userDetails);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    useEffect(() => {
        if (userToken) {
            fetchUserDetails();
        }
    }, [userToken, studentId]);

    const NotAvailable = () => <div className={css.notAvailable}>Not Available</div>;

    const handleSelect = async () => {
        try {
            const response = await fetch(`${baseURL}/team/makeSelect`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                    user_id: studentId
                })
            });

            if (response.ok) {
                const data = await response.json();
                showToast(data.message, "success");
                setIsSelected(false);
                setIsModalOpen(false);
                if (onDetailsUpdate) onDetailsUpdate(studentDetails, { prevId: null, nextId: null });
            } else {
                showToast("Failed to select student", "error");
            }
        } catch (error) {
            console.error("Error selecting student:", error);
            showToast("Failed to select student", "error");
        }
    };

    const copyReferralCode = () => {
        if (studentDetails?.referral_code) {
            navigator.clipboard
                .writeText(studentDetails.referral_code)
                .then(() => {
                    showToast("Referral code copied to clipboard", "success");
                })
                .catch((err) => {
                    console.error("Failed to copy referral code: ", err);
                });
        }
    };

    const ModalSelect = () => (
        <div className={css.modalOverlay}>
            <div className={css.modalContent}>
                <h2 className={css.modalh2}>Confirm Select</h2>
                <p className={css.modalP}>Are you sure you want to Select this student?</p>
                <div className={css.modalActions}>
                    <button
                        className={css.selectBtnModal}
                        onClick={() => {
                            isSelected ? handleSelect() : null;
                        }}
                    >
                        Select
                    </button>
                    <button className={css.cancelBtnModal} onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    if (!studentDetails) {
        return (
            <div>
                <SkeletonLoader />
                <SkeletonLoader />
            </div>
        );
    }

    const renderCounterCards = () => (
        <div className={css.belowContainer}>
            <div className={css.counterCards}>
                <div className={css.card}>
                    <div className={css.cardTitle}>Total Assignment</div>
                    <div className={css.cardValue}>{studentDetails?.assignmentStats?.total}</div>
                </div>
                <div className={css.card}>
                    <div className={css.cardTitle}>With Freelancers</div>
                    <div className={css.cardValue}>{studentDetails?.assignmentStats?.assignedToFreelancer}</div>
                </div>
                <div className={css.card}>
                    <div className={css.cardTitle}>Assigned to PM</div>
                    <div className={css.cardValue}>{studentDetails?.assignmentStats?.assignedToPM}</div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {isModalOpen && <ModalSelect />}
            <div>
                {isSelected ? (
                    // Regular student card
                    <div className={css.studentCard}>
                        <div className={css.imgBtn}>
                            <img className={css.profileCard} src={imageSrc} alt="" />
                            {(user?.role === "Admin" || user?.role === "PM") && (
                                <>
                                    <div
                                        className={css.editBtn}
                                        onClick={() =>
                                            router.push(
                                                `/admin/students/details/edit?id=${studentId}`
                                            )
                                        }
                                    >
                                        {`Edit`}
                                    </div>
                                    <span className={css.lastEditText}>
                                        last edited on{" "}
                                        {formatDate(studentDetails?.last_updated, "full")}
                                    </span>
                                </>
                            )}
                        </div>
                        <div className={css.studentDetailsBox}>
                            <div className={css.referralSection}>
                                <div className={css.profileName}>
                                    {studentDetails?.firstname + ` ` + studentDetails?.lastname}
                                </div>
                                <div className={css.referral} onClick={copyReferralCode}>
                                    <img src="/assets/admin/students/copyPaste.svg" alt="" />
                                    <span className={css.code}>Referral Code:</span>
                                    <div className={css.referralCode}>
                                        {studentDetails?.referral_code}
                                    </div>
                                </div>
                            </div>
                            <div className={css.referralSectionPhone}>
                                <div className={css.profileNamePhone}>
                                    {studentDetails?.firstname + ` ` + studentDetails?.lastname}
                                </div>
                                <div className={css.referralPhone} onClick={copyReferralCode}>
                                    <div className={css.referralRow}>
                                        <img src="/assets/admin/students/copyPaste.svg" alt="" />
                                        <div className={css.codePhone}>Referral Code:</div>
                                    </div>
                                    <div className={css.referralCode}>
                                        {studentDetails?.referral_code}
                                    </div>
                                </div>
                            </div>

                            <div className={css.studentNameInitial}>
                                {(studentDetails?.firstname?.[0] || "") +
                                    (studentDetails?.lastname?.[0] || "") ||
                                    studentDetails?.firstname?.[0] ||
                                    studentDetails?.lastname?.[0]}
                            </div>
                            <div className={css.detailsStud}>
                                <div className={css.details}>
                                    <div className={css.personalDetails}>
                                        <div className={css.personalDetailsHeader}>
                                            {studentDetails?.firstname +
                                                ` ` +
                                                studentDetails?.lastname}
                                        </div>

                                        {/* first line */}
                                        <div className={`${css.rowContainer}`}>
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Email</div>
                                                <div className={css.fieldValue}>
                                                    <a
                                                        href={`mailto:${studentDetails?.email}`}
                                                        className={css.fieldValue}
                                                    >
                                                        {studentDetails?.email || <NotAvailable />}
                                                    </a>
                                                </div>
                                            </div>

                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>
                                                    Referral code used{" "}
                                                </div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.referral_code_used || (
                                                        <NotAvailable />
                                                    )}
                                                </div>
                                            </div>

                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Referred by </div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.referrer_name || <NotAvailable />}
                                                </div>
                                            </div>

                                            {/* phone  */}
                                            {/* <div className={css.rowfield}>
                          <div className={css.fieldName}>phone</div>
                          <div className={css.fieldValue}>
                            <a
                              href={`tel:+${studentDetails?.country_code}${studentDetails?.number}`}
                              className={css.fieldValue}
                            >
                              {`+` +
                                studentDetails?.country_code +
                                studentDetails?.number}
                            </a>
                          </div>
                        </div> */}
                                        </div>

                                        {/* second line */}
                                        <div className={`${css.rowContainer}`}>
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Country</div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.country_name || "Na"}
                                                </div>
                                            </div>

                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Created on</div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.account_created_on.split(" ")[0] ||
                                                        "Na"}
                                                </div>
                                            </div>

                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Phone</div>
                                                <div className={css.fieldValue}>
                                                    <a
                                                        // href={`tel:+${studentDetails?.country_code}${studentDetails?.number}`}
                                                        href={`https://wa.me/${studentDetails?.country_code
                                                            }${studentDetails?.number
                                                            }?text=${encodeURIComponent(
                                                                `Hey ${studentDetails?.firstname} ${studentDetails?.lastname},\nGreetings from Bluepen.co.in. Thankyou for registering with us and submitting your requirements. Can we have a discussion about your requirements?`
                                                            )}`}
                                                        className={css.fieldValue}
                                                    >
                                                        {`+${studentDetails?.country_code} ${studentDetails?.number}`}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        {/* third line */}
                                        <div className={`${css.rowContainer}`}>
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>University</div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.university || <NotAvailable />}
                                                </div>
                                            </div>

                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>College</div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.college || <NotAvailable />}
                                                </div>
                                            </div>
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Course</div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.course || <NotAvailable />}
                                                </div>
                                            </div>
                                        </div>

                                        {/* fourth line */}
                                        <div className={`${css.rowContainer}`}>
                                            {/* created by */}
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Created by </div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.signin_method || "Na"}
                                                </div>
                                            </div>

                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Wallet Balance</div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.wallet !== undefined ? `₹${studentDetails.wallet}` : <NotAvailable />}
                                                </div>
                                            </div>
                                            
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>DOB </div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.date_of_birth ? (
                                                        studentDetails.date_of_birth.split(" ")[0]
                                                    ) : (
                                                        <NotAvailable />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* fifth line */}
                                        <div className={`${css.rowContainer}`}>
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Address</div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.address || <NotAvailable />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Selected student card
                    <div className={css.selectStudentCard}>
                        <img
                            className={css.profileCardSelect}
                            src={"/assets/admin/students/selectStudentBg.svg"}
                            alt=""
                        />
                        {(user?.role === "Admin" || user?.role === "PM") && (
                            <>
                                <div
                                    className={css.editBtn}
                                    onClick={() =>
                                        router.push(
                                            `/admin/students/details/edit?id=${studentId}`
                                        )
                                    }
                                >
                                    {`Edit`}
                                </div>
                                <span className={css.lastEditText}>
                                    last edited on{" "}
                                    {formatDate(studentDetails?.last_updated, "full")}
                                </span>
                            </>
                        )}
                        <div className={css.studentDetailsBox}>
                            <div className={css.referralSection}>
                                <div className={css.profileName}>
                                    {studentDetails?.firstname + ` ` + studentDetails?.lastname}
                                </div>
                                <div className={css.referral}>
                                    <img src="/assets/admin/students/copyPaste.svg" alt="" />
                                    <span className={css.code}>Referral Code:</span>
                                    {studentDetails?.referral_code}
                                </div>
                            </div>
                            <div className={css.referralSectionPhone}>
                                <div className={css.profileNamePhone}>
                                    {studentDetails?.firstname + ` ` + studentDetails?.lastname}
                                </div>
                                <div className={css.referralPhone}>
                                    <div className={css.referralRow}>
                                        <img src="/assets/admin/students/copyPaste.svg" alt="" />
                                        <div className={css.codePhone}>Referral Code:</div>
                                    </div>
                                    <div className={css.referralCode}>
                                        {studentDetails?.referral_code}
                                    </div>
                                </div>
                            </div>

                            <div className={css.studentNameInitial}>
                                {`${studentDetails?.firstname?.[0]}${studentDetails?.lastname?.[0]}`}
                            </div>
                            <div className={css.detailsStud}>
                                <div className={css.details}>
                                    <div className={css.personalDetails}>
                                        <div className={css.personalDetailsHeader}>
                                            {studentDetails?.firstname +
                                                ` ` +
                                                studentDetails?.lastname}
                                        </div>
                                        {/* first Line */}
                                        <div className={`${css.rowContainer}`}>
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Email</div>
                                                <div className={css.fieldValue}>
                                                    <a
                                                        href={`mailto:${studentDetails?.email}`}
                                                        className={css.fieldValue}
                                                    >
                                                        {studentDetails?.email || <NotAvailable />}
                                                    </a>
                                                </div>
                                            </div>

                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>
                                                    Referral code used{" "}
                                                </div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.referral_code_used || (
                                                        <NotAvailable />
                                                    )}
                                                </div>
                                            </div>

                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Referred by</div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.referrer_name || <NotAvailable />}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Second Line */}
                                        <div className={`${css.rowContainer}`}>
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Country</div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.country_name || <NotAvailable />}
                                                </div>
                                            </div>
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Created at</div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.account_created_on.split(
                                                        " "
                                                    )[0] || <NotAvailable />}
                                                </div>
                                            </div>

                                            {/* phone */}
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Phone</div>
                                                <div className={css.fieldValue}>
                                                    <a
                                                        href={`tel:+${studentDetails?.country_code}${studentDetails?.number}`}
                                                        className={css.fieldValue}
                                                    >
                                                        {`+${studentDetails?.country_code} ${studentDetails?.number}`}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Third Line */}
                                        <div className={`${css.rowContainer}`}>
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>University</div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.university || <NotAvailable />}
                                                </div>
                                            </div>

                                            {/* college */}
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>College</div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.collage || <NotAvailable />}
                                                </div>
                                            </div>

                                            {/* course  */}
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Course</div>

                                                <div className={css.fieldValue}>
                                                    {studentDetails?.course || <NotAvailable />}
                                                </div>
                                            </div>
                                        </div>

                                        {/* fourth Line */}
                                        <div className={`${css.rowContainer}`}>
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Created by </div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.signin_method || <NotAvailable />}
                                                </div>
                                            </div>
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Wallet Balance</div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.wallet !== undefined ? `₹${studentDetails.wallet}` : <NotAvailable />}
                                                </div>
                                            </div>
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>DOB </div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.date_of_birth ? (
                                                        studentDetails.date_of_birth.split(" ")[0]
                                                    ) : (
                                                        <NotAvailable />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* fifth Line */}
                                        <div className={`${css.rowContainer}`}>
                                            <div className={css.rowfield}>
                                                <div className={css.fieldName}>Address</div>
                                                <div className={css.fieldValue}>
                                                    {studentDetails?.address || <NotAvailable />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className={css.betweenTitle}>Assignment Stats</div>
            {renderCounterCards()}
        </>
    );
};

export default PersonalDetailsCard;

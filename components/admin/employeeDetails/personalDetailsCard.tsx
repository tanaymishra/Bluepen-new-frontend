import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/authentication/authentication';
import { formatDate } from '@/utils/customJsFunctions/dateFormatJS';
import css from '@/styles/admin/details.module.scss';
import SkeletonLoader from '@/ui/loader/skeletonLoader';

const baseURL = String(process.env.NEXT_PUBLIC_BASE_URL);

interface PersonalDetailsCardProps {
    employeeId: string | null;
    onDetailsUpdate: (details: any, navigation: any) => void;
}

const PersonalDetailsCard = ({ employeeId, onDetailsUpdate }: PersonalDetailsCardProps) => {
    const { user } = useAuth();
    const router = useRouter();
    const [employeeDetails, setEmployeeDetails] = useState<any>(null);
    const userToken = user?.token;

    const NotAvailable = () => <div className={css.notAvailable}>Not Available</div>;

    const fetchEmployeeDetails = async () => {
        if (!userToken) return;
        try {
            const response = await fetch(`${baseURL}/team/employeeDetails`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    id: Number(employeeId),
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setEmployeeDetails(data.data);
                // Update parent with navigation info
                onDetailsUpdate(data.data, {
                    prevId: data?.previousEmployeeId,
                    nextId: data?.nextEmployeeId,
                });
            }
        } catch (error) {
            console.error("Error fetching employee details:", error);
        }
    };

    useEffect(() => {
        if (userToken && employeeId) {
            fetchEmployeeDetails();
        }
    }, [userToken, employeeId]);

    if (!employeeDetails) {
        return (
            <div>
                <SkeletonLoader />
                <SkeletonLoader />
            </div>
        );
    }

    return (
        <div className={css.containerWidth}>
            <div className={css.profile}>
                <div className={css.profileRow}>
                    <div className={css.profileImg}>
                        <div className={css.img}>
                            <img src="/assets/admin/employee/employeeImg.svg" alt="" />
                        </div>
                    </div>
                    <div className={css.profileNames}>
                        <div className={css.status}>
                            {employeeDetails?.is_active === "1" ? `Active` : `Inactive`}
                        </div>
                        <div className={css.proName}>{employeeDetails?.name}</div>
                        <div className={css.sinceDate}>
                            {employeeDetails?.created_on &&
                                `Employee Since ${formatDate(employeeDetails?.created_on, "monthYear")}`}
                        </div>
                    </div>
                </div>
                <div className={css.role}>
                    <div className={css.headingRole}>role</div>
                    <div className={css.roleValue}>
                        {employeeDetails?.role === "Developer" ? "Tech" : employeeDetails?.role}
                    </div>
                </div>
            </div>

            <div className={css.details}>
                <div className={css.personalDetails}>
                    <div className={css.personalDetailsHeader}>
                        {`Personal Details`}
                    </div>
                    <div className={`${css.rowContainer}`}>
                        <div className={css.rowfield}>
                            <div className={css.fieldName}>Name</div>
                            <div className={css.fieldValue}>
                                {employeeDetails?.name ? (
                                    employeeDetails?.name
                                ) : (
                                    <NotAvailable />
                                )}
                            </div>
                        </div>

                        <div className={css.rowfield}>
                            <div className={css.fieldName}>Email</div>
                            <div className={css.fieldValue}>
                                <a
                                    href={`mailto:${employeeDetails?.email_old}`}
                                    className={css.telmailtofnc}
                                >
                                    {employeeDetails?.email_old ? (
                                        employeeDetails?.email_old
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
                                    href={`tel:${employeeDetails?.number_old}`}
                                    className={css.telmailtofnc}
                                >
                                    {employeeDetails?.number_old ? (
                                        employeeDetails?.number_old
                                    ) : (
                                        <NotAvailable />
                                    )}
                                </a>
                            </div>
                        </div>

                        <div className={css.rowfield}>
                            <div className={css.fieldName}>Bluepen Phone</div>
                            <div className={css.fieldValue}>
                                <a
                                    href={`tel:${employeeDetails?.number_bluepen}`}
                                    className={css.telmailtofnc}
                                >
                                    {employeeDetails?.number_bluepen ? (
                                        employeeDetails?.number_bluepen
                                    ) : (
                                        <NotAvailable />
                                    )}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className={`${css.rowContainer}`}>
                        <div className={css.rowfield}>
                            <div className={css.fieldName}>Whatsapp</div>

                            <div className={css.fieldValue}>
                                <a
                                    href={`https://wa.me/${employeeDetails?.number_whatsapp}`}
                                    className={css.telmailtofnc}
                                >
                                    {employeeDetails?.number_whatsapp ? (
                                        employeeDetails?.number_whatsapp
                                    ) : (
                                        <NotAvailable />
                                    )}
                                </a>
                            </div>
                        </div>

                        <div className={css.rowfield}>
                            <div className={css.fieldName}>Bluepen Email</div>
                            <div className={css.fieldValue}>
                                <a
                                    href={`mailto:${employeeDetails?.email_bluepen}`}
                                    className={css.telmailtofnc}
                                >
                                    {employeeDetails?.email_bluepen ? (
                                        employeeDetails?.email_bluepen
                                    ) : (
                                        <NotAvailable />
                                    )}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className={`${css.rowContainer}`}>
                        <div className={css.rowfield}>
                            <div className={css.fieldName}>Alternate Phone</div>
                            <div className={css.fieldValue}>
                                <a
                                    href={`tel:${employeeDetails?.number_alternate}`}
                                    className={css.telmailtofnc}
                                >
                                    {employeeDetails?.number_alternate ? (
                                        employeeDetails?.number_alternate
                                    ) : (
                                        <NotAvailable />
                                    )}
                                </a>
                            </div>
                        </div>

                        <div className={css.rowfield}>
                            <div className={css.fieldName}>Education</div>
                            <div className={css.fieldValue}>
                                {employeeDetails?.education ? (
                                    employeeDetails?.education
                                ) : (
                                    <NotAvailable />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`${css.rowContainer}`}>
                        <div className={css.rowfield}>
                            <div className={css.fieldName}>Role</div>
                            <div className={css.fieldValue}>
                                {employeeDetails?.role ? (
                                    employeeDetails?.role === "Developer" ? (
                                        "Tech"
                                    ) : (
                                        employeeDetails?.role
                                    )
                                ) : (
                                    <NotAvailable />
                                )}
                            </div>
                        </div>

                        <div className={css.rowfield}>
                            <div className={css.fieldName}>City</div>
                            <div className={css.fieldValue}>
                                {employeeDetails?.city ? (
                                    employeeDetails?.city
                                ) : (
                                    <NotAvailable />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`${css.rowContainer}`}>
                        <div className={css.rowfield}>
                            <div className={css.fieldName}>DOB</div>
                            <div className={css.fieldValue}>
                                {employeeDetails?.date_of_birth ? (
                                    employeeDetails?.date_of_birth
                                ) : (
                                    <NotAvailable />
                                )}
                            </div>
                        </div>

                        <div className={css.rowfield}>
                            <div className={css.fieldName}>DOJ</div>
                            <div className={css.fieldValue}>
                                {employeeDetails?.date_of_joining ? (
                                    employeeDetails?.date_of_joining
                                ) : (
                                    <NotAvailable />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={css.familyDetails}>
                    <div className={css.familyDetailsHeader}>{`Family Details`}</div>
                    <div className={`${css.rowContainer}`}>
                        <div className={css.rowfield}>
                            <div className={css.fieldName}>{`Father's Name`}</div>
                            <div className={css.fieldValue}>
                                {employeeDetails?.father_name ? (
                                    employeeDetails?.father_name
                                ) : (
                                    <NotAvailable />
                                )}
                            </div>
                        </div>

                        <div className={css.rowfield}>
                            <div className={css.fieldName}>{`Father's Contact`}</div>
                            <div className={css.fieldValue}>
                                <a
                                    href={`tel:${employeeDetails?.father_number}`}
                                    className={css.telmailtofnc}
                                >
                                    {employeeDetails?.father_number ? (
                                        employeeDetails?.father_number
                                    ) : (
                                        <NotAvailable />
                                    )}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className={`${css.rowContainer}`}>
                        <div className={css.rowfield}>
                            <div className={css.fieldName}>{`Mother's Name`}</div>
                            <div className={css.fieldValue}>
                                {employeeDetails?.mother_name ? (
                                    employeeDetails?.mother_name
                                ) : (
                                    <NotAvailable />
                                )}
                            </div>
                        </div>

                        <div className={css.rowfield}>
                            <div className={css.fieldName}>{`Mother's Contact`}</div>
                            <div className={css.fieldValue}>
                                <a
                                    href={`tel:${employeeDetails?.mother_number}`}
                                    className={css.telmailtofnc}
                                >
                                    {employeeDetails?.mother_number ? (
                                        employeeDetails?.mother_number
                                    ) : (
                                        <NotAvailable />
                                    )}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className={`${css.rowContainer}`}>
                        <div className={css.rowfield}>
                            <div className={css.fieldName}>{`Address`}</div>
                            <div className={css.fieldValue}>
                                {employeeDetails?.address ? (
                                    employeeDetails?.address
                                ) : (
                                    <NotAvailable />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalDetailsCard;

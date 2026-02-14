import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { formatDate } from "@/utils/customJsFunctions/dateFormatJS";
import css from "@/styles/admin/assignmentDetails.module.scss";

interface PmFreelancerDetProps {
  assignmentDetailsResponse: any;
  isResit: boolean;
  isLost: boolean;
  toggleDrawer: () => void;
  setDrawerTitle: (title: string) => void;
  setCurrentListType: React.Dispatch<React.SetStateAction<"pm" | "freelancer">>;
  onAssignmentSuccess?: () => void;
  closeDrawer?: () => void;
  setSelectedFreelancer?: (id: number) => void;
  editable?: boolean;
}

interface ContactInfo {
  phone: string;
  whatsapp: string;
}

const PmFreelancerDet: React.FC<PmFreelancerDetProps> = ({
  assignmentDetailsResponse,
  isResit,
  isLost,
  toggleDrawer,
  setDrawerTitle,
  setCurrentListType,
  onAssignmentSuccess,
  closeDrawer,
  setSelectedFreelancer,
  editable = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const interval = useRef<NodeJS.Timeout>(undefined);
  const freelancers = assignmentDetailsResponse?.freelancer || [];
  const assignmentLen = freelancers.length;

  const NotAvailable = () => {
    return <div className={css.notAvailable}>Not Available</div>;
  };

  const colors = [
    "#FDF6E3",
    "#E3F2FD",
    "#F3E5F5",
    "#E8F5E9",
    "#FFF3E0",
    "#FFEBEE",
    "#EDE7F6",
    "#E0F7FA",
    "#FFFDE7",
    "#F9FBE7",
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const handleAssignPM = () => {
    setCurrentListType("pm");
    setDrawerTitle(
      assignmentDetailsResponse?.assigned_to_pm === 1
        ? `Update PM`
        : `Assign PM`
    );
    toggleDrawer();
  };

  const handleAssignFreelancer = () => {
    setCurrentListType("freelancer");
    setDrawerTitle(
      assignmentDetailsResponse?.assigned_to_freelancer === 1
        ? `Update Freelancer`
        : `Assign Freelancer`
    );
    if (assignmentDetailsResponse?.freelancer?.[0]?.id && setSelectedFreelancer) {
      setSelectedFreelancer(Number(assignmentDetailsResponse.freelancer[0].id));
    }
  
    if (onAssignmentSuccess) {
      onAssignmentSuccess();
    }
    toggleDrawer();
  };

  useEffect(() => {
    if (assignmentLen > 1) {
      interval.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % assignmentLen);
      }, 3000);
      return () => {
        if (interval.current) {
          clearInterval(interval.current);
        }
      };
    }
  }, [assignmentLen]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    // Reset interval when manually navigating
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % assignmentLen);
      }, 3000);
    }
  };

  const renderFreelancerContact = (index: number): ContactInfo => {
    const freelancer = freelancers[index];
    if (!freelancer) {
      return {
        phone: "-",
        whatsapp: "-",
      };
    }

    return {
      phone:
        freelancer.country_code && freelancer.number
          ? `+${freelancer.country_code} ${freelancer.number}`
          : "-",
      whatsapp:
        freelancer.country_code && freelancer.whatsapp
          ? `+${freelancer.country_code} ${freelancer.whatsapp}`
          : "-",
    };
  };

  const renderSingleFreelancer = () => (
    <div className={`${css.detContainer} ${css.freelancerColor}`}>
      <div className={css.detheader}>
        <div className={css.assignTitle}>Freelancer assigned</div>
        {!isResit &&
          !isLost && editable &&
          assignmentDetailsResponse?.assigned_to_pm === 1 && (
            <div
              className={css.updateAssignBtn}
              onClick={() =>
                assignmentDetailsResponse?.assigned_to_pm === 1 &&
                handleAssignFreelancer()
              }
            >
              {assignmentDetailsResponse?.assigned_to_freelancer === 1
                ? "Update"
                : "Assign"}
            </div>
          )}
      </div>
      <div className={css.pmDet}>
        <Image
          src="/assets/admin/assignments/freelancer.svg"
          alt="Freelancer"
          width={44}
          height={44}
        />
        <div className={css.pmName}>
          {assignmentLen === 0
            ? "Assign to Freelancer"
            : `${freelancers[0]?.first_name || ""} ${
                freelancers[0]?.last_name || ""
              }`}
        </div>
        <div className={css.updateStatus}>
          {assignmentDetailsResponse?.assigned_to_freelancer_time
            ? `last updated ${formatDate(
                assignmentDetailsResponse.assigned_to_freelancer_time,
                "mm/dd/yyyy"
              )}`
            : "Choose Freelancer"}
        </div>
      </div>
      <div className={css.contactDet}>
        <div className={css.contactBox}>
          <div className={css.contactLabel}>Phone</div>
          <div className={css.contactValue}>
            {renderFreelancerContact(0).phone !== "-" ? (
              renderFreelancerContact(0).phone
            ) : (
              <NotAvailable />
            )}
          </div>
        </div>
        <div className={css.contactBox}>
          <div className={css.contactLabel}>Whatsapp</div>
          <div className={css.contactValue}>
            {renderFreelancerContact(0).whatsapp !== "-" ? (
              renderFreelancerContact(0).whatsapp
            ) : (
              <NotAvailable />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMultipleFreelancers = () => (
    <div className={css.detContainerout}>
      <div
        className={`${css.detContainer} ${css.freelancerColor}`}
        style={{ backgroundColor: randomColor }}
      >
        <div className={css.detheader}>
          <div className={css.assignTitle}>Freelancer assigned</div>
          {!isResit && !isLost && editable && (
            <div
              className={css.updateAssignBtn}
              onClick={handleAssignFreelancer}
            >
              {assignmentDetailsResponse?.assigned_to_freelancer === 1
                ? "Update"
                : "Assign"}
            </div>
          )}
        </div>
        <div className={css.pmDet}>
          <Image
            src="/assets/admin/assignments/freelancer.svg"
            alt="Freelancer"
            width={44}
            height={44}
          />
          <div className={css.pmName}>
            {`${freelancers[currentIndex]?.first_name || ""} ${
              freelancers[currentIndex]?.last_name || ""
            }`}
          </div>
          <div className={css.updateStatus}>
            {assignmentDetailsResponse?.assigned_to_freelancer_time
              ? `last updated ${formatDate(
                  assignmentDetailsResponse.assigned_to_freelancer_time,
                  "mm/dd/yyyy"
                )}`
              : "Choose Freelancer"}
          </div>
        </div>
        <div className={css.contactDet}>
          <div className={css.contactBox}>
            <div className={css.contactLabel}>Phone</div>
            <div className={css.contactValue}>
              <a href={`tel:${renderFreelancerContact(currentIndex).phone}`}>
                {renderFreelancerContact(currentIndex).phone !== "-" ? (
                  renderFreelancerContact(currentIndex).phone
                ) : (
                  <NotAvailable />
                )}
              </a>
            </div>
          </div>
          <div className={css.contactBox}>
            <div className={css.contactLabel}>Whatsapp</div>
            <div className={css.contactValue}>
              {renderFreelancerContact(currentIndex).whatsapp !== "-" ? (
                <a
                  href={`https://wa.me/${renderFreelancerContact(
                    currentIndex
                  ).whatsapp.replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {renderFreelancerContact(currentIndex).whatsapp}
                </a>
              ) : (
                <NotAvailable />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={css.carouselSlider}>
        {freelancers.map((_: any, index: any) => (
          <div
            key={index}
            className={`${css.dotLine} ${
              currentIndex === index ? css.fullWidth : ""
            }`}
            onClick={() => handleDotClick(index)}
          ></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={css.pmFreelancerDet}>
      <div className={`${css.detContainer} ${css.pmColor}`}>
        <div className={css.detheader}>
          <div className={css.assignTitle}>PM assigned</div>
          {!isResit && !isLost && editable && (
            <div className={css.updateAssignBtn} onClick={handleAssignPM}>
              {assignmentDetailsResponse?.assigned_to_pm === 1
                ? "Update"
                : "Assign"}
            </div>
          )}
        </div>
        <div className={css.pmDet}>
          <Image
            src="/assets/admin/assignments/pm.svg"
            alt="PM"
            width={44}
            height={44}
          />
          <div className={css.pmName}>
            {assignmentDetailsResponse?.assigned_to_pm === 1
              ? assignmentDetailsResponse?.project_manager?.name
              : "Assign to PM"}
          </div>
          <div className={css.updateStatus}>
            {assignmentDetailsResponse?.assigned_to_pm_time
              ? `last updated ${formatDate(
                  assignmentDetailsResponse.assigned_to_pm_time,
                  "mm/dd/yyyy"
                )}`
              : "Choose PM"}
          </div>
        </div>
        <div className={css.contactDet}>
          <div className={css.contactBox}>
            <div className={css.contactLabel}>Phone</div>
            <div className={css.contactValue}>
              {assignmentDetailsResponse?.project_manager?.number ? (
                <a
                  href={`tel:+91${assignmentDetailsResponse.project_manager.number}`}
                >
                  {`+91 ${assignmentDetailsResponse.project_manager.number}`}
                </a>
              ) : (
                <NotAvailable />
              )}
            </div>
          </div>
          <div className={css.contactBox}>
            <div className={css.contactLabel}>Whatsapp</div>
            <div className={css.contactValue}>
              {assignmentDetailsResponse?.project_manager?.whatsapp ? (
                <a
                  href={`https://wa.me/91${assignmentDetailsResponse.project_manager.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`+91 ${assignmentDetailsResponse.project_manager.whatsapp}`}
                </a>
              ) : (
                <NotAvailable />
              )}
            </div>
          </div>
        </div>
      </div>

      {assignmentLen < 2
        ? renderSingleFreelancer()
        : renderMultipleFreelancers()}
    </div>
  );
};

export default PmFreelancerDet;

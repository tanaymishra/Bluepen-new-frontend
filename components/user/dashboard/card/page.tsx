import React, { useState } from "react";
import Image from "next/image";
import {
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  File,
  Download,
  Archive,
  X,
  Clock,
  FileX,
} from "lucide-react";
import styles from "@/styles/assignmentCard.module.scss";
import { formatDate } from "@/utils/customJsFunctions/dateFormatJS";
import Modal from "@/ui/modal/modal";

interface AssignmentCardProps {
  title: string;
  type: string;
  level: string;
  date: string;
  status: any;
  description: string;
  name: string;
  contact: string;
  eta?: string;
  files: Array<any>;
}

// const statusMap = {
//   completed: styles.statusCompleted,
//   submitted: styles.statusSubmitted,
//   applied: styles.statusApplied,
// };

const DOWNLOAD_URL = process.env.NEXT_PUBLIC_FILE_URL + "/file";
const statusMap = {
  posted: styles.statusPosted,
  underProcess: styles.statusUnderProcess,
  lost: styles.statusLost,
  assignedToProjectManager: styles.statusAssignedToProjectManager,
  assignedToFreelancer: styles.statusAssignedToFreelancer,
  completedMarksNotReceived: styles.statusCompletedMarksNotReceived,
  completed: styles.statusCompleted,
  reviewReceived: styles.statusReviewReceived,
  default: styles.statusDefault,
};

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  title,
  type,
  level,
  date,
  status,
  description,
  name,
  contact,
  eta,
  files = [],
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const referenceFiles = [
    { name: "Project Requirements.pdf", size: "2.4 MB" },
    { name: "Research Paper.docx", size: "1.8 MB" },
    { name: "Data Analysis.xlsx", size: "3.2 MB" },
    { name: "Technical Specifications.pdf", size: "4.1 MB" },
    { name: "Reference Images.zip", size: "8.7 MB" },
    { name: "Guidelines.pdf", size: "1.2 MB" },
    { name: "Sample Code.zip", size: "5.5 MB" },
    { name: "Bibliography.docx", size: "892 KB" },
  ];

  const getFileIcon = (extension: string) => {
    switch (extension) {
      case "pdf":
        return <FileText className={styles.fileTypeIcon} />;
      case "docx":
        return <File className={styles.fileTypeIcon} />;
      case "xlsx":
        return <FileSpreadsheet className={styles.fileTypeIcon} />;
      case "zip":
        return <Archive className={styles.fileTypeIcon} />;
      default:
        return <File className={styles.fileTypeIcon} />;
    }
  };

  const statusClass = (status: string): string => {
    // console.log(status, "Assignment Status");

    switch (status?.toLowerCase()) {
      case "assigned to freelancer":
        return styles.statusAssignedToFreelancer;
      case "resit":
        return styles.statusResit;
      case "lost":
        return styles.statusLost;
      case "review received":
      case "completed":
      case "completed marks not received":
        return styles.statusCompleted;
      case "assigned to pm":
        return styles.statusAssignedToProjectManager;
      case "under process":
        return styles.statusUnderProcess;
      case "posted":
        return styles.statusPosted;
      default:
        return styles.statusDefault;
    }
  };
  const isSubmitted = status === "submitted";
  const dateFormatted = formatDate(date, "deadlines");

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        style={{ maxWidth: "560px", borderRadius: "20px", marginTop: "10rem" }}
        modalBodyStyle={{
          padding: "32px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
        }}
        isMinimal
      >
        <div className={styles.modalHeader}>
          <h2 className={`${styles.modalTitle} spartan-600`}>
            Reference Documents
          </h2>
          <button
            className={styles.modalCloseButton}
            onClick={() => setIsModalOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <div className={styles.fileList}>
          {files.length === 0 ? (
            <div className={styles.noFiles}>
              <FileX size={48} className={styles.noFilesIcon} />
              <p className={`${styles.noFilesText} spartan-400`}>
                No reference files found for this project
              </p>
            </div>
          ) : (
            files.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <div className={styles.fileInfo}>
                  {getFileIcon(file?.split(".")?.pop() || "")}
                  <div className={styles.fileDetails}>
                    <span className={`${styles.fileName} spartan-400`}>
                      {file}
                    </span>
                    <span className={`${styles.fileSize} spartan-400`}>
                      {file?.size || "0 MB"}
                    </span>
                  </div>
                </div>
                <button
                  className={styles.downloadButton}
                  onClick={() => {
                    window.open(
                      DOWNLOAD_URL + "/assignments/freelancing/" + file
                    );
                  }}
                >
                  <Download size={18} className={styles.downloadIcon} />
                </button>
              </div>
            ))
          )}
        </div>
      </Modal>

      <div className={styles.card}>
        <div className={`${styles.header} spartan-600`}>
          {/* <span className={styles.eta}>Completion Date: {eta}</span> */}

          {/* <span>level: </span> */}
          <span className={styles.tag}>{level}</span>
          <div className={styles.statusContainer}>
            <span className={`${styles.status} ${statusClass(status)}`}>
              {status}
            </span>
            {isSubmitted && (
              <div className={styles.menuDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.divider}></div>
        <h2 className={`${styles.title} spartan-600`}>{title}</h2>
        <div className={`${styles.tags} spartan-400`}>
          <span className={styles.tag}>{type}</span>
          {/* <span className={styles.tag}>{level}</span> */}
          {isSubmitted && (
            <span className={`${styles.date} spartan-400`}>
              {dateFormatted}
            </span>
          )}
        </div>
        <p className={`${styles.description} spartan-400`}>{description}</p>
        <div className={`${styles.actions} spartan-600`}>
          {/* <button
            className={`${styles.actionButton} ${isSubmitted ? styles.disabledButton : ""
              }`}
            disabled={isSubmitted}
          >
            <Image
              src="/assets/dashboard/download.png"
              alt="Download"
              width={18}
              height={18}
            />
            <span className="spartan-400">Your Assignment</span>
          </button> */}
          <button
            className={styles.actionButton2}
            onClick={() => setIsModalOpen(true)}
          >
            <Image
              src="/assets/dashboard/eye.png"
              alt="View"
              width={18}
              height={18}
            />
            <span className="spartan-400">Reference Documents</span>
          </button>
        </div>
        <div className={styles.divider}></div>
        <div className={`${styles.footer} spartan-600`}>
          <div className={styles.footerLeft}>
            <Image
              src="/assets/dashboard/headphone.png"
              alt="Contact"
              width={18}
              height={18}
            />
            <div className={styles.pmInfo}>
              <span className={styles.name}>{name}</span>
              <span className={styles.contact}>{contact}</span>
            </div>
          </div>
          <div className={styles.footerRight}>
            <div className={styles.deadlineContainer}>
              <Clock size={16} />
              <span className={styles.deadlineLabel}>Deadline:</span>
              <span className={styles.deadlineDate}>{dateFormatted}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignmentCard;

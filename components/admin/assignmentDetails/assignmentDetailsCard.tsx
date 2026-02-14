import React, { useMemo, useRef, useState } from "react";
import css from "@/styles/admin/assignmentDetails.module.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import OptionsModal from "@/components/admin/optionsModal/optionsModal";
import { formatDate } from "@/utils/customJsFunctions/dateFormatJS";
import Textarea from "@/ui/Textarea";
import { X, FileText, Download, File } from "lucide-react";

interface AssignmentDetailsCardProps {
  assignments: any;
  assignmentNumber: string;
  fetchAssignmentDetails: () => void;
  toggleDrawerEmail?: () => void;
  toggleWordCountDrawer?: () => void;
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  editable?: boolean;
}

const fileURL = process.env.NEXT_PUBLIC_FILE_URL;

interface AssignmentFilesModalProps {
  files: any[];
  handleCloseModal: () => void;
  onDownload: (folderName: string, fileName: string) => void;
}
const AssignmentFilesModal: React.FC<AssignmentFilesModalProps> = ({
  files,
  handleCloseModal,
  onDownload,
}) => {
  if (!files || files.length === 0) {
    return (
      <div className={css.modalOverlay} onClick={handleCloseModal}>
        <div
          className={css.rejectModalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={css.modalHeader}>
            <h2>Assignment Files</h2>
            <button className={css.closeButton} onClick={handleCloseModal}>
              <X size={24} />
            </button>
          </div>
          <div className={css.modalBody}>
            <div className={css.emptyState}>
              <FileText size={48} />
              <p>No files available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={css.modalOverlay} onClick={handleCloseModal}>
      <div
        className={css.rejectModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={css.modalHeader}>
          <h2>Download Assignment Files</h2>
          <button className={css.closeButton} onClick={handleCloseModal}>
            <X size={24} />
          </button>
        </div>

        <div className={css.modalBody}>
          <div className={css.filesList}>
            {files.map((file, index) => (
              <div key={index} className={css.fileItem}>
                <div className={css.fileInfo}>
                  <File size={24} />
                  <span className={css.fileName}>{file}</span>
                </div>
                <button
                  className={css.downloadButton}
                  onClick={() => onDownload("assignments/freelancing", file)}
                  title="Download file"
                >
                  <Download size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AssignmentDetailsCard: React.FC<AssignmentDetailsCardProps> = ({
  assignments,
  assignmentNumber,
  fetchAssignmentDetails,
  toggleDrawerEmail,
  toggleWordCountDrawer,
  setIsModalOpen,
  editable = true,
}) => {
  const router = useRouter();
  const [modalOpenOp, setModalOpenOp] = useState(false);
  const modalRefOp = useRef<HTMLDivElement>(null);
  const moreBtnRefOp = useRef<HTMLDivElement>(null);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const handleSendEmail = () => {
    if (toggleDrawerEmail) {
      toggleDrawerEmail();
    }
  };

  const handleUpdateWordCount = () => {
    if (toggleWordCountDrawer) {
      toggleWordCountDrawer();
    }
  };

  const NotAvailable = () => {
    return <div className={css.notAvailable}>Not Available</div>;
  };

  const downloadFile = (folderName: string, fileName: string) => {
    const fileInstall = `${fileURL}/file/${folderName}/${fileName}`;

    const a = document.createElement("a");
    a.href = fileInstall;
    a.download = fileName;
    a.target = "_blank";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // memoized formatted values
  const lastEdited = useMemo(
    () =>
      assignments?.last_updated
        ? formatDate(assignments.last_updated, "full")
        : null,
    [assignments?.last_updated]
  );

  const postedOn = useMemo(
    () =>
      assignments?.postedOn
        ? formatDate(assignments.postedOn, "dd/mm/yyyy")
        : null,
    [assignments?.postedOn]
  );

  const deadline = useMemo(
    () =>
      assignments?.deadline
        ? formatDate(assignments.deadline, "dd/mm/yyyy")
        : null,
    [assignments?.deadline]
  );

  return (
    <div className={css.assignDetailsCard}>
      <div className={css.imgBtn}>
        <Image
          src="/assets/admin/assignments/backImg.svg"
          alt=""
          loading="lazy"
          height={20}
          width={20}
        />

        {editable &&
          <div
            className={css.editBtn}
            onClick={() =>
              router.push(
                `/admin/assignments/details/edit?id=${assignmentNumber}`
              )
            }
          >
            {`Edit`}
          </div>
        }
        <div className={css.lastEdited}>last edited on { lastEdited || <NotAvailable/> }</div>
      </div>

      <div className={css.assignDetailsBox}>
        <div className={css.assignHeaderBox}>
          <div className={css.assignRow}>
            <div className={css.assignTitle}>
              {assignments.title ? assignments.title : <NotAvailable />}
            </div>

            {editable &&
              <div
                className={css.moreOptions}
                ref={moreBtnRefOp}
                onClick={(e) => {
                  e.stopPropagation();
                  setModalOpenOp(!modalOpenOp);
                  if (setIsModalOpen) {
                    setIsModalOpen(!modalOpenOp);
                  }
                }}
              >
                <div className={css.dot}></div>
                <div className={css.dot}></div>
                <div className={css.dot}></div>
              </div>
            }
            
            <OptionsModal
              isOpen={modalOpenOp}
              className={css.optionsModal}
              options={[
                {
                  label: "Send Email",
                  onClick: handleSendEmail,
                  className: css.itemModal,
                },
                {
                  label: "Update Word Count & Values",
                  onClick: handleUpdateWordCount,
                  className: css.itemModal,
                },
                {
                  label: "Download Assignment",
                  onClick: () => {
                    setIsFileModalOpen(true);
                  },
                  className: css.itemModal,
                },
              ]}
              onClose={() => {
                setModalOpenOp(false);
                if (setIsModalOpen) {
                  setIsModalOpen(false);
                }
              }}
              modalRef={modalRefOp as any}
              btnRef={moreBtnRefOp as any}
              itemStyle={{
                padding: "2px 4px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                zIndex: 100,
                width: "100%",
              }}
              itemClassName={css.modalItem}
            />
          </div>

          <div className={css.assignDesc}>
            {assignments.description ? (
              assignments.description
            ) : (
              <NotAvailable />
            )}
          </div>
        </div>
        <div className={css.personalDetails}>
          <div className={css.rowContainer}>
            <div className={css.rowfield}>
              <div className={css.fieldName}>Level</div>
              <div className={css.fieldValue}>
                {assignments.level ? assignments.level : <NotAvailable />}
              </div>
            </div>

            <div className={css.rowfield}>
              <div className={css.fieldName}>Stream</div>
              <div className={css.fieldValue}>
                {assignments.stream ? assignments.stream : <NotAvailable />}
              </div>
            </div>

            <div className={css.rowfield}>
              <div className={css.fieldName}>Type</div>
              <div className={css.fieldValue}>
                {Array.isArray(assignments.type)
                  ? assignments.type.join(", ")
                  : assignments.type || <NotAvailable />}
              </div>
            </div>
          </div>

          <div className={css.rowContainer}>
            <div className={css.rowfield}>
              <div className={css.fieldName}>Submitted by</div>
              <div className={css.fieldValue}>
                {assignments.submittedBy ? (
                  assignments.submittedBy
                ) : (
                  <NotAvailable />
                )}
              </div>
            </div>

            <div className={css.rowfield}>
              <div className={css.fieldName}>Word Count</div>
              <div className={css.fieldValue}>
                {assignments.wordCount ? (
                  assignments.wordCount
                ) : (
                  <NotAvailable />
                )}
              </div>
            </div>

            <div className={css.rowfield}>
              <div className={css.fieldName}>Posted on</div>
              <div className={css.fieldValue}>
                { postedOn || <NotAvailable /> }
              </div>
            </div>
          </div>

          <div className={css.rowContainer}>
            <div className={css.rowfield}>
              <div className={css.fieldName}>Deadline</div>
              <div className={css.fieldValue}>
                { deadline || <NotAvailable /> }
              </div>
            </div>

            <div className={css.rowfield}>
              <div className={css.fieldName}>Freelancer Amount</div>
              <div className={css.fieldValue}>
                {assignments.freelancerAmount ? (
                  assignments.freelancerAmount
                ) : (
                  <NotAvailable />
                )}
              </div>
            </div>

            <div className={css.rowfield}>
              <div className={css.fieldName}>Total Amount</div>
              <div className={css.fieldValue}>
                {assignments.totalAmount ? (
                  assignments.totalAmount
                ) : (
                  <NotAvailable />
                )}
              </div>
            </div>
            {isFileModalOpen && (
              <AssignmentFilesModal
                files={assignments.files}
                handleCloseModal={() => setIsFileModalOpen(false)}
                onDownload={downloadFile}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AssignmentDetailsCard);

import React, { useState, useRef } from "react";
import css from "./fileUploader.module.scss";
import { useToast } from "@/context/toastContext";
import { useAuth } from "@/authentication/authentication";

interface UploadResponse {
  success: boolean;
  totalFiles: number;
  successfulUploads: number;
  failedUploads: number;
  files: Array<{
    originalName: string;
    savedAs: string;
    folder: string;
    path: string;
    size: number;
    mimetype: string;
    s3Location: string;
  }>;
  errors: any[];
}

interface StoreFileResponse {
  success: boolean;
  message: string;
}

interface FileUploaderProps {
  assignmentId: string | null;
  onUploadComplete?: (fileType: string, url: string) => void;
}

type FileType = "assignment" | "guidelines" | "lectureNotes";

const fileTypeMap: Record<FileType, string> = {
  assignment: "assignment_file",
  guidelines: "guidelines_file",
  lectureNotes: "lecture_note",
};

const FileUploader = ({
  assignmentId,
  onUploadComplete,
}: FileUploaderProps): React.ReactElement<any> => {
  const { showToast } = useToast();
  const [files, setFiles] = useState<{
    assignment: File | null;
    guidelines: File | null;
    lectureNotes: File | null;
  }>({
    assignment: null,
    guidelines: null,
    lectureNotes: null,
  });
  const { user } = useAuth();

  const [loading, setLoading] = useState<{
    assignment: boolean;
    guidelines: boolean;
    lectureNotes: boolean;
  }>({
    assignment: false,
    guidelines: false,
    lectureNotes: false,
  });

  const fileInputRefs = {
    assignment: useRef<HTMLInputElement>(null),
    guidelines: useRef<HTMLInputElement>(null),
    lectureNotes: useRef<HTMLInputElement>(null),
  };

  // const uploadFiles = async (files: File[]): Promise<UploadResponse> => {
  //   const formData = new FormData();
  //   formData.append("folder", `/assignments_files`);
  //   files.forEach((file) => {
  //     formData.append("file", file);
  //   });
  //   const response = await fetch(`${process.env.NEXT_PUBLIC_FILE_URL}/upload`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //     body: formData,
  //   });

  //   if (!response.ok) {
  //     throw new Error("Upload failed");
  //   }

  //   const data: UploadResponse = await response.json();
  //   if (!data.success || data.failedUploads > 0) {
  //     throw new Error(data.errors?.[0] || "Upload failed");
  //   }

  //   return data;
  // };

  // const storeFileInDb = async (
  //   fileType: FileType,
  //   fileName: string
  // ): Promise<StoreFileResponse> => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/team/assignment/files`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${user?.token}`,
  //         },
  //         body: JSON.stringify({
  //           assignment_id: Number(assignmentId),
  //           [fileTypeMap[fileType]]: [fileName],
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to store file information");
  //     }

  //     return await response.json();
  //   } catch (error) {
  //     console.error("Error storing file info:", error);
  //     throw error;
  //   }
  // };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: FileType
  ) => {
    const file = event.target.files?.[0] || null;
    setFiles((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  const formatFileType = (type: FileType): string => {
    return type
      .replace(/([A-Z])/g, " $1")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };  const handleSubmit = async (type: FileType) => {
    const file = files[type];
    if (!file || !assignmentId) return;

    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      // Upload file first
      const formData = new FormData();
      formData.append("folder", `/assignments_files`);
      formData.append("file", file);
      
      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_FILE_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await uploadResponse.json();

      if (uploadResponse.ok && data.success && data.files?.[0]) {
        // Store file info in database
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/team/assignment/files`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            assignment_id: Number(assignmentId),
            [fileTypeMap[type]]: [data.files[0].savedAs],
          }),
        });

        if (response.ok) {
          showToast(`${formatFileType(type)} uploaded successfully!`, "success");
          onUploadComplete?.(type, data.files[0].s3Location);
        } else {
          showToast("Failed to save file information", "error");
        }
      } else {
        showToast(data.errors?.[0] || "Failed to upload file", "error");
      }
    } catch (error: any) {
      console.error(`Error uploading ${type}:`, error);
      showToast(`Failed to upload ${formatFileType(type)}. Please try again.`, "error");
    } finally {
      // Reset file input and loading state
      if (fileInputRefs[type].current) {
        fileInputRefs[type].current.value = "";
      }
      setFiles((prev) => ({ ...prev, [type]: null }));
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const fileTypes = [
    { key: "assignment" as const, label: "Assignment" },
    { key: "guidelines" as const, label: "Guidelines" },
    { key: "lectureNotes" as const, label: "Lecture Notes" },
  ];

  return (
    <div className={css.fileUploaderContainer}>
      <h3>Upload Files</h3>
      <div className={css.uploadersGrid}>
        {fileTypes.map(({ key, label }) => (
          <div key={key} className={css.uploaderSection}>
            <div className={css.uploaderHeader}>
              <h4>{label}</h4>
            </div>
            <div className={css.uploaderContent}>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, key)}
                ref={fileInputRefs[key]}
                className={css.fileInput}
              />
              {files[key] && (
                <div className={css.fileName}>{files[key]?.name}</div>
              )}
              <button
                onClick={() => handleSubmit(key)}
                disabled={!files[key] || loading[key]}
                className={css.submitButton}
              >
                {loading[key] ? "Uploading..." : "Submit"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;

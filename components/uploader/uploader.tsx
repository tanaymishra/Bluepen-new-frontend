import React, { useRef, useState } from "react";
import styles from "./uploader.module.scss";
import {
  AlertCircle,
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  File as FileIcon,
} from "lucide-react";

interface UploaderProps {
  onFileChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedFileTypes?: string[];
  value?: File[];
  label?: string;
  boxLabel?: string;
  sublabel?: string;
  error?: string;
  replaceFiles?: boolean;
  existingFiles?: string[];
  onRemoveExisting?: (fileName: string) => void;
  required?: boolean;
  isUploading?: boolean; // Add isUploading prop
}

const Uploader: React.FC<UploaderProps> = ({
  onFileChange,
  maxFiles = 5,
  maxSizeInMB = 5,
  acceptedFileTypes = ["*"], // Changed to accept all files
  value = [],
  label = "Drag or Click to Upload Assignment Guidelines.",
  sublabel = "All file types are supported", // Updated sublabel
  boxLabel = "Upload File",
  error,
  replaceFiles = false,
  existingFiles = [],
  onRemoveExisting,
  required = false,
  isUploading = false, // Default value is false
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalError, setInternalError] = useState<string>("");

  // Calculate total files by combining both arrays
  const totalFileCount = value.length + existingFiles.filter(
    fileName => !value.some(file => file.name === fileName)
  ).length;

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const validateFiles = (
    newFiles: File[],
    existingFiles: File[] = []
  ): boolean => {
    const totalFiles = replaceFiles
      ? newFiles
      : [...existingFiles, ...newFiles];

    if (totalFiles.length + existingFiles.length > maxFiles) {
      setInternalError(`You can upload a maximum of ${maxFiles} files.`);
      return false;
    }

    const oversizedFiles = newFiles.filter(
      (file) => file.size > maxSizeInMB * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      setInternalError(`Each file must be smaller than ${maxSizeInMB}MB.`);
      return false;
    }    // Validate file types if not accepting all files
    if (!acceptedFileTypes.includes("*")) {
      const invalidFiles = newFiles.filter(file => {
        const fileName = file.name.toLowerCase();
        const fileExtension = '.' + fileName.split('.').pop();
        return !acceptedFileTypes.some(type => 
          fileExtension === type.toLowerCase()
        );
      });
      
      if (invalidFiles.length > 0) {
        setInternalError(`Only ${acceptedFileTypes.join(', ')} files are allowed.`);
        return false;
      }
    }

    setInternalError("");
    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    if (validateFiles(newFiles, value)) {
      const updatedFiles = replaceFiles ? newFiles : [...value, ...newFiles];
      // Remove duplicates by comparing file names
      const uniqueFiles = updatedFiles.filter(
        (file, index, self) =>
          index === self.findIndex((f) => f.name === file.name)
      );
      onFileChange(uniqueFiles);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const newFiles = value.filter((_, index) => index !== indexToRemove);
    onFileChange(newFiles);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className={styles.pdf} />;
      case "doc":
      case "docx":
      case "xml":  // Added XML support
        return <FileText className={styles.doc} />;
      case "ppt":
      case "pptx":
        return <FileText className={styles.doc} />;
      case "xls":
      case "xlsx":
        return <FileText className={styles.doc} />;
      case "jpg":
      case "jpeg":
      case "png":
        return <ImageIcon className={styles.image} />;
      default:
        return <FileIcon className={styles.file} />;
    }
  };

  const isRequired = required && totalFileCount === 0;

  return (
    <div className={styles.uploaderContainer}>
      <div className={styles.labelContainer}>
        <label className={`${styles.mainLabel} spartan-500`}>
          {boxLabel}
          {required && <span className={styles.required}>*</span>}
        </label>
      </div>

      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ""} ${error || internalError ? styles.error : ""
          } ${totalFileCount > 0 ? styles.hasFiles : ""}`}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          multiple
          className={styles.fileInput}
          required={isRequired}
        />        <div className={styles.uploadContent}>
          <div className={styles.iconContainer}>
            {isUploading ? (
              <div className={styles.loadingSpinner}></div>
            ) : (
              <Upload className={styles.uploadIcon} />
            )}
          </div>
          <div className={styles.uploadText}>
            <p className={`${styles.label} spartan-500`}>
              {isUploading ? "Uploading files..." : label}
            </p>
            <p className={`${styles.sublabel} spartan-400`}>
              {isUploading 
                ? "Please wait while your files are being uploaded" 
                : `File size limit: ${maxSizeInMB}MB each | ${sublabel}`
              }
            </p>
          </div>
        </div>

        {/* {totalFileCount > 0 && (
          <div className={styles.selectedFiles}>
            <div className={styles.fileCount}>
              <span className="spartan-600">{totalFileCount}</span>
              <span className="spartan-400">/{maxFiles} files selected</span>
            </div>
          </div>
        )} */}
      </div>

      {(totalFileCount > 0) && (
        <div className={styles.fileList}>
          {/* Show existing files that aren't in value array */}
          {existingFiles
            .filter(fileName => !value.some(file => file.name === fileName))
            .map((fileName, index) => (
              <div key={`existing-${index}`} className={`${styles.fileItem} ${styles.existing}`}>
                <div className={styles.fileInfo}>
                  {getFileIcon(fileName)}
                  <div className={styles.fileDetails}>
                    <span className={`${styles.fileName} spartan-500`}>
                      {fileName}
                    </span>
                  </div>
                </div>
                {onRemoveExisting && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveExisting(fileName);
                    }}
                    className={styles.removeButton}
                    aria-label={`Remove ${fileName}`}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}

          {/* Show files from value array */}
          {/* {value.map((file, index) => (
            <div key={`new-${index}`} className={styles.fileItem}>
              <div className={styles.fileInfo}>
                {getFileIcon(file.name)}
                <div className={styles.fileDetails}>
                  <span className={`${styles.fileName} spartan-500`}>
                    {file.name}
                  </span>
                  <span className={`${styles.fileSize} spartan-400`}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
                className={styles.removeButton}
                aria-label={`Remove ${file.name}`}
              >
                <X size={16} />
              </button>
            </div>
          ))} */}
        </div>
      )}

      {(error || internalError) && (
        <div className={`${styles.errorMessage} spartan-400`}>
          <AlertCircle size={16} />
          <span>{error || internalError}</span>
        </div>
      )}

      {/* {(totalFileCount > 0) && (
        <div className={styles.fileList}>
          {existingFiles.map((fileName, index) => (
            <div key={`existing-${index}`} className={`${styles.fileItem} ${styles.existing}`}>
              <div className={styles.fileInfo}>
                {getFileIcon(fileName)}
                <div className={styles.fileDetails}>
                  <span className={`${styles.fileName} spartan-500`}>
                    {fileName}
                  </span>
                </div>
              </div>
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveExisting(fileName);
                  }}
                  className={styles.removeButton}
                  aria-label={`Remove ${fileName}`}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}

           {value.map((file, index) => (
            <div key={`new-${index}`} className={styles.fileItem}>
              <div className={styles.fileInfo}>
                {getFileIcon(file.name)}
                <div className={styles.fileDetails}>
                  <span className={`${styles.fileName} spartan-500`}>
                    {file.name}
                  </span>
                  <span className={`${styles.fileSize} spartan-400`}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
                className={styles.removeButton}
                aria-label={`Remove ${file.name}`}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )} */}


    </div>
  );
};

export default Uploader;
import React from 'react';
import css from './uploadedFiles.module.scss';

interface FileData {
  assignment_file?: string[];
  guidelines_file?: string[];
  lecture_note?: string[] | null;
}

interface UploadedFilesProps {
  files: FileData;
}

const UploadedFiles: React.FC<UploadedFilesProps> = ({ files }) => {
  const fileTypes = [
    { key: 'assignment_file', label: 'Assignment Files' },
    { key: 'guidelines_file', label: 'Guidelines Files' },
    { key: 'lecture_note', label: 'Lecture Notes' },
  ] as const;

  const handleDownload = (fileName: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_FILE_URL;
    window.open(`${baseUrl}/file/assignments_files/${fileName}`);
  };

  return (    <div className={css.uploadedFilesContainer}>
      <h3 className={css.title}>Uploaded Files</h3>
      <div className={css.filesGrid}>
        {fileTypes.map(({ key, label }) => (
          <div key={key} className={css.fileSection}>
            <h4 className={css.fileTypeTitle}>{label}</h4>
            <div className={css.fileList}>
              {files[key] && files[key]?.length > 0 ? (
                files[key]?.map((fileName, index) => (
                  <div key={index} className={css.fileItem} onClick={() => handleDownload(fileName)}>
                    <div className={css.fileIconWrapper}>
                      <svg className={css.fileIcon} viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M14,2H6C4.9,2 4,2.9 4,4V20C4,21.1 4.9,22 6,22H18C19.1,22 20,21.1 20,20V8L14,2M18,20H6V4H13V9H18V20M16,11V18H8V16H10.5L7.5,13L10.5,10V12H16V11Z"/>
                      </svg>
                    </div>
                    <span className={css.fileName}>{fileName}</span>
                    <div className={css.downloadIcon}>
                      <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
                      </svg>
                    </div>
                  </div>
                ))
              ) : (
                <div className={css.noFiles}>No files uploaded</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadedFiles;

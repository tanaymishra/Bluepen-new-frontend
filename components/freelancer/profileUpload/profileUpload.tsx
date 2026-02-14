import React, { useCallback, useState, useRef, useEffect } from 'react';
import styles from '@/styles/freelancer/components/profileUpload.module.scss';

interface ImageUploadPreviewProps {
    onImageUpload?: (file: File | null, dataUrl: string | null) => Promise<boolean> | boolean;
    className?: string;
    maxSize?: number;
    allowedFormats?: string[];
    existingImageUrl?: string;
}

interface ImageDetails {
    name: string;
    size: string;
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
    onImageUpload,
    className,
    maxSize = 5, // Default 5MB
    allowedFormats = ['image/jpeg', 'image/png', 'image/gif'],
    existingImageUrl = "",
}) => {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [imageDetails, setImageDetails] = useState<ImageDetails | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (existingImageUrl) {
            setImageUrl(existingImageUrl);

            // Extract filename from the URL
            const parts = existingImageUrl.split("/");
            const fallbackName = parts[parts.length - 1] || "Profile Image";

            fetch(existingImageUrl, { method: "HEAD" })
                .then(res => {
                    const sizeHeader = res.headers.get("Content-Length");
                    if (sizeHeader) {
                        setImageDetails({
                            name: fallbackName, // Show file name instead of 'Profile Image'
                            size: formatFileSize(parseInt(sizeHeader, 10)),
                        });
                    } else {
                        setImageDetails({
                            name: fallbackName,
                            size: "",
                        });
                    }
                })
                .catch(() => {
                    setImageDetails({
                        name: fallbackName,
                        size: "",
                    });
                });
        }
    }, [existingImageUrl]);

    const handleImageClick = useCallback(() => {
        if (imageUrl) {
            // If image exists, clear it
            setImageUrl('');
            setImageDetails(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            onImageUpload?.(null, null);
        } else {
            // If no image, trigger file upload
            fileInputRef.current?.click();
        }
    }, [imageUrl, onImageUpload]);

    const handleFileChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!allowedFormats.includes(file.type)) {
            alert('Invalid file format. Please upload an allowed image format.');
            return;
        }

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            alert(`File size must be less than ${maxSize}MB`);
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const dataUrl = e.target?.result as string;

            const success = await onImageUpload?.(file, dataUrl);

            if (success) {
                // If parent confirms successful upload, set the preview
                setImageUrl(dataUrl);
                setImageDetails({
                    name: file.name,
                    size: formatFileSize(file.size),
                });
            } else {
                // If upload fails, clear everything
                event.target.value = "";
                setImageUrl("");
                setImageDetails(null);
            }
        };
        reader.readAsDataURL(file);
    }, [onImageUpload, maxSize, allowedFormats]);

    const allowedFormatsText = allowedFormats
        .map(format => format.split('/')[1].toUpperCase())
        .join(', ');

    return (
        <div
            className={`${styles.uploadContainer} ${className || ''}`}
            onClick={handleImageClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleImageClick();
                }
            }}
        >
            <div className={`${styles.wrapper}`}>
                <button
                    className={`${styles.imagePreview} ${!imageUrl ? styles.noImage : ''}`}
                    style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
                    type="button"
                    aria-label={imageUrl ? 'Remove image' : 'Upload image'}
                >
                    {imageUrl && <div className={styles.removeOverlay}>Click to remove</div>}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={allowedFormats.join(',')}
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />
            </div>

            <div className={styles.imageInfo}>
                {!imageUrl ? (
                    <>
                        <span className={styles.uploadText}>Upload your profile picture</span>
                        <span className={styles.formatText}>
                            File format allowed: {allowedFormatsText}
                        </span>
                        <span className={styles.sizeText}>
                            Max file size: {maxSize}MB
                        </span>
                    </>
                ) : (
                    <>
                        <span className={styles.successText}>Wohooo nice pic! 🎉</span>
                        <span className={styles.imageName} title={imageDetails?.name}>
                            {imageDetails?.name}
                        </span>
                        <span className={styles.imageSize}>
                            {imageDetails?.size}

                        </span>
                        <span className={styles.removeImg} title={imageDetails?.name}>
                            {`Tap again to remove`}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageUploadPreview;
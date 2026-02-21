/**
 * Shared file upload utility.
 *
 * Uploads a file to the file service (NEXT_PUBLIC_FILES_UPLOAD_URL)
 * and returns the `savedAs` filename that the backend stores.
 *
 * Usage:
 *   import { uploadFile } from "@/lib/upload";
 *   const savedAs = await uploadFile(file, "/assignments/freelancing");
 */

const UPLOAD_URL = process.env.NEXT_PUBLIC_FILES_UPLOAD_URL!;

export interface UploadResult {
    savedAs: string;
    originalName: string;
    size: number;
}

/**
 * Upload a single file to the file service.
 * @param file     The File object to upload
 * @param folder   The destination folder, e.g. "/assignments/freelancing"
 * @returns        The `savedAs` filename from the upload response
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
    const fd = new FormData();
    fd.append("folder", folder);
    fd.append("file", file);

    const res = await fetch(UPLOAD_URL, { method: "POST", body: fd });
    if (!res.ok) throw new Error(`File upload failed: ${file.name}`);

    const data = await res.json();
    const savedAs: string = data?.files?.[0]?.savedAs;
    if (!savedAs) throw new Error(`No savedAs in upload response for: ${file.name}`);

    return savedAs;
}

/**
 * Upload multiple files sequentially.
 * @param files    Array of File objects
 * @param folder   The destination folder
 * @returns        Array of savedAs filenames
 */
export async function uploadFiles(files: File[], folder: string): Promise<string[]> {
    const results: string[] = [];
    for (const file of files) {
        const savedAs = await uploadFile(file, folder);
        results.push(savedAs);
    }
    return results;
}

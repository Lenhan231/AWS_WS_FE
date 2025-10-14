import { api } from './api';

export class MediaUploadService {
  /**
   * Upload a file to S3 using pre-signed URL from backend
   */
  static async uploadFile(
    file: File,
    folder: string,
    onProgress?: (progress: number) => void
  ): Promise<{ fileKey: string; publicUrl: string }> {
    try {
      // Get file extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      
      // Get pre-signed URL from backend
      const response = await api.media.getPresignedUrl(folder, fileExtension);
      
      if (!response.success || !response.data) {
        throw new Error('Failed to get pre-signed URL');
      }
      
      const presignedData = response.data;
      const { uploadUrl, fileKey, publicUrl } = presignedData;

      // Upload file to S3
      await this.uploadToS3(file, uploadUrl, onProgress);
      
      return { fileKey, publicUrl };
    } catch (error) {
      console.error('Media upload failed:', error);
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload multiple files to S3
   */
  static async uploadMultipleFiles(
    files: File[],
    folder: string,
    onProgress?: (progress: number) => void
  ): Promise<{ fileKeys: string[]; publicUrls: string[] }> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder, onProgress));
    
    try {
      const results = await Promise.all(uploadPromises);
      
      return {
        fileKeys: results.map(r => r.fileKey),
        publicUrls: results.map(r => r.publicUrl)
      };
    } catch (error) {
      console.error('Multiple file upload failed:', error);
      throw new Error(`Failed to upload files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload file to S3 using pre-signed URL
   */
  private static async uploadToS3(
    file: File,
    uploadUrl: string,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 204) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'));
      });
      
      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was aborted'));
      });
      
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }

  /**
   * Validate file before upload
   */
  static validateFile(file: File, options?: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  }): { valid: boolean; error?: string } {
    const maxSizeMB = options?.maxSizeMB || 10;
    const allowedTypes = options?.allowedTypes || ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return {
        valid: false,
        error: `File size must be less than ${maxSizeMB}MB`
      };
    }
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type must be one of: ${allowedTypes.join(', ')}`
      };
    }
    
    return { valid: true };
  }

  /**
   * Compress image before upload
   */
  static async compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            file.type,
            quality
          );
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
    });
  }
}

// Export singleton instance
export const mediaUpload = MediaUploadService;

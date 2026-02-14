import { api } from '../api';

export interface ApiFile {
  id: string;
  organizationId: string;
  fileName: string;
  originalFileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
  uploadedBy: string;
  uploadedAt: string;
  entityType: 'PATIENT' | 'PRESCRIPTION' | 'LAB_RESULT' | 'APPOINTMENT' | 'USER' | 'BILLING' | 'OTHER';
  entityId: string;
  category?: string;
  description?: string;
  tags?: string[];
  isPublic: boolean;
  downloadUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileUploadOptions {
  entityType: string;
  entityId: string;
  category?: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class FileService {
  async uploadFile(
    file: File,
    options: FileUploadOptions,
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<ApiFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', options.entityType);
    formData.append('entityId', options.entityId);
    if (options.category) formData.append('category', options.category);
    if (options.description) formData.append('description', options.description);
    if (options.tags) formData.append('tags', JSON.stringify(options.tags));
    if (options.isPublic !== undefined) formData.append('isPublic', String(options.isPublic));

    return this.uploadWithProgress(formData, onProgress);
  }

  async uploadMultipleFiles(
    files: File[],
    options: FileUploadOptions,
    onProgress?: (fileIndex: number, progress: FileUploadProgress) => void
  ): Promise<ApiFile[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadFile(file, options, (progress) => onProgress?.(index, progress))
    );
    return Promise.all(uploadPromises);
  }

  async downloadFile(id: string): Promise<Blob> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const user = typeof window !== 'undefined' ? localStorage.getItem('healthcare_user') : null;
    const userData = user ? JSON.parse(user) : null;
    const organizationId = userData?.organizationId;

    const response = await fetch(`${this.getBaseUrl()}/api/files/${id}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(organizationId && { 'X-Organization-ID': organizationId })
      }
    });

    if (!response.ok) throw new Error('File download failed');
    return response.blob();
  }

  async downloadFileAsUrl(id: string): Promise<string> {
    const blob = await this.downloadFile(id);
    return URL.createObjectURL(blob);
  }

  async deleteFile(id: string): Promise<void> {
    return api.delete(`/api/files/${id}`);
  }

  async getFile(id: string): Promise<ApiFile> {
    return api.get(`/api/files/${id}`);
  }

  async getEntityFiles(entityType: string, entityId: string): Promise<ApiFile[]> {
    return api.get(`/api/files?entityType=${entityType}&entityId=${entityId}`);
  }

  async getFilesByCategory(entityType: string, entityId: string, category: string): Promise<ApiFile[]> {
    const files = await this.getEntityFiles(entityType, entityId);
    return files.filter(f => f.category === category);
  }

  async searchFiles(query: string, entityType?: string): Promise<ApiFile[]> {
    let endpoint = `/api/files/search?q=${encodeURIComponent(query)}`;
    if (entityType) endpoint += `&entityType=${entityType}`;
    return api.get(endpoint);
  }

  async updateFileMetadata(id: string, metadata: {
    description?: string;
    category?: string;
    tags?: string[];
    isPublic?: boolean;
  }): Promise<ApiFile> {
    return api.put(`/api/files/${id}/metadata`, metadata);
  }

  // Utility methods
  validateFile(file: File, options?: {
    maxSize?: number;
    allowedTypes?: string[];
  }): { valid: boolean; error?: string } {
    const maxSize = options?.maxSize || 10 * 1024 * 1024; // 10MB default
    const allowedTypes = options?.allowedTypes || [
      'image/jpeg', 'image/png', 'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (file.size > maxSize) {
      return { valid: false, error: `File size exceeds ${this.formatFileSize(maxSize)}` };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not allowed' };
    }

    return { valid: true };
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('video')) return '🎥';
    return '📎';
  }

  async getFileThumbnail(id: string): Promise<string | null> {
    try {
      const file = await this.getFile(id);
      if (file.thumbnailUrl) return file.thumbnailUrl;
      if (file.mimeType.startsWith('image/')) {
        return this.downloadFileAsUrl(id);
      }
      return null;
    } catch {
      return null;
    }
  }

  private async uploadWithProgress(
    formData: FormData,
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<ApiFile> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const user = typeof window !== 'undefined' ? localStorage.getItem('healthcare_user') : null;
      const userData = user ? JSON.parse(user) : null;
      const organizationId = userData?.organizationId;

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percentage: Math.round((e.loaded / e.total) * 100)
          });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Upload failed')));
      xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

      xhr.open('POST', `${this.getBaseUrl()}/api/files/upload`);
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      if (organizationId) xhr.setRequestHeader('X-Organization-ID', organizationId);
      xhr.send(formData);
    });
  }

  private getBaseUrl(): string {
    if (typeof window === 'undefined') return 'http://localhost:8080';
    return process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080';
  }
}

export const fileService = new FileService();

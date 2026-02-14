'use client';

import { useState, useEffect } from 'react';
import { fileService, ApiFile } from '@/lib/services/file';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { File, Download, Trash2, Eye } from 'lucide-react';

interface FileListProps {
  entityType: string;
  entityId: string;
  onFileDelete?: (fileId: string) => void;
}

export default function FileList({ entityType, entityId, onFileDelete }: FileListProps) {
  const [files, setFiles] = useState<ApiFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, [entityType, entityId]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const entityFiles = await fileService.getEntityFiles(entityType, entityId);
      setFiles(entityFiles);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: ApiFile) => {
    try {
      const blob = await fileService.downloadFile(file.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalFileName;
      a.click();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Delete this file?')) return;
    try {
      await fileService.deleteFile(fileId);
      loadFiles();
      onFileDelete?.(fileId);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handlePreview = async (file: ApiFile) => {
    try {
      const url = await fileService.downloadFileAsUrl(file.id);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Preview failed:', error);
    }
  };

  if (loading) return <div className="p-4">Loading files...</div>;

  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No files uploaded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <Card key={file.id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="text-2xl">{fileService.getFileIcon(file.mimeType)}</div>
                <div className="flex-1">
                  <p className="font-medium">{file.originalFileName}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>{fileService.formatFileSize(file.fileSize)}</span>
                    {file.category && <span>{file.category}</span>}
                    <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  {file.description && (
                    <p className="text-sm text-gray-600 mt-1">{file.description}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {file.mimeType.startsWith('image/') && (
                  <Button size="sm" variant="outline" onClick={() => handlePreview(file)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => handleDownload(file)}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(file.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

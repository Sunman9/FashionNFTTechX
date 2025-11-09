
import React, { useState, useCallback } from 'react';
import { UploadIcon, XCircleIcon } from './Icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onClear: () => void;
  currentFile: File | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onClear, currentFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  if (currentFile) {
    return (
      <div className="relative">
        <img
          src={URL.createObjectURL(currentFile)}
          alt="Sketch preview"
          className="w-full h-auto max-h-80 object-contain rounded-lg border-2 border-brand-accent"
        />
        <button
          onClick={onClear}
          className="absolute top-2 right-2 p-1 bg-brand-primary/70 rounded-full text-brand-text-secondary hover:text-white transition-colors"
          aria-label="Remove image"
        >
          <XCircleIcon />
        </button>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="file-upload" className="block text-sm font-medium text-brand-text-secondary mb-2">Upload Sketch or Moodboard</label>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative block w-full h-64 border-2 ${isDragging ? 'border-brand-accent' : 'border-brand-secondary'} border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <UploadIcon />
          <span className="mt-2 block text-sm text-brand-text-secondary">
            Drag & drop a file or click to upload
          </span>
        </div>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => handleFileChange(e.target.files)}
          accept="image/png, image/jpeg, image/webp"
        />
      </div>
    </div>
  );
};

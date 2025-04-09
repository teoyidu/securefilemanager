// src/components/FileDropZone.tsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropZoneProps {
  onFileDrop: (files: File[]) => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileDrop }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileDrop(acceptedFiles);
  }, [onFileDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    }
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed border-indigo-300/30 rounded-md bg-indigo-900/20 
                 p-8 text-center cursor-pointer transition-colors
                 ${isDragActive ? 'border-indigo-500 bg-indigo-900/30' : ''}`}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center">
        <div className="mb-4 text-indigo-400">
          <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-lg font-medium mb-1">Click or drop your files here</p>
        <p className="text-sm text-gray-400">DOCX, PDF, XLS, PNG formats are supported</p>
      </div>
    </div>
  );
};

export default FileDropZone;

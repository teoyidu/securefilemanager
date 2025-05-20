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
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif']
    }
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed border-indigo-400/40 rounded-2xl bg-[#2d293b] p-16 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[320px] w-full max-w-2xl mx-auto shadow-lg
                 ${isDragActive ? 'border-indigo-400 bg-indigo-900/30' : ''}`}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center">
        <div className="mb-6 text-indigo-300">
          <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-xl font-medium mb-2 text-white">Click or drop your files here</p>
        <p className="text-base text-indigo-200">DOCX, PDF, XLS, PNG formats are supported</p>
      </div>
    </div>
  );
};

export default FileDropZone;

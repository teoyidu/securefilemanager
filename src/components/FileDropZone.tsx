// src/components/FileDropZone.tsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './FileDropZone.module.css';

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
      className={isDragActive ? `${styles.dropzone} ${styles.dragActive}` : styles.dropzone}
    >
      <input {...getInputProps()} />
      <div className={styles.icon}>
        <svg width="56" height="56" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <p className={styles.title}>Click or drop your files here</p>
      <p className={styles.desc}>DOCX, PDF, XLS, PNG formats are supported</p>
    </div>
  );
};

export default FileDropZone;

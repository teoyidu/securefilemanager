// src/components/FileList.tsx
import React, { useState, useEffect } from 'react';
import { FileType, ConversionOption, ProcessStatus } from '../types';
import MobileFileItem from './MobileFileItem';
import DraggableFileItem from './DraggableFileItem';
import { useFiles } from '../context';
import styles from './FileList.module.css';
import StyledDropdown from './StyledDropdown';

interface FileListProps {
    files: FileType[];
    onDeleteFile: (id: string) => void;
    onConvertTo: (id: string, option: ConversionOption | null) => void;
    onPreviewFile: (file: FileType) => void;
    showLess: boolean;
}

const FileList: React.FC<FileListProps> = ({
                                               files,
                                               onDeleteFile,
                                               onConvertTo,
                                               onPreviewFile,
                                               showLess
                                           }) => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const { reorderFiles } = useFiles();

    useEffect(() => {
        // Function to check screen size
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768); // 768px is typical tablet breakpoint
        };

        // Initial check
        checkIfMobile();

        // Add event listener
        window.addEventListener('resize', checkIfMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const displayFiles = showLess ? files.slice(0, 5) : files;

    // Format file size
    const formatSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Format icon based on file type
    const renderFileIcon = (format: string) => {
        switch (format) {
            case 'docx':
                return (
                    <div className="w-6 h-6 mr-3 bg-blue-600 rounded flex items-center justify-center text-white text-xs">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'pdf':
                return (
                    <div className="w-6 h-6 mr-3 bg-red-600 rounded flex items-center justify-center text-white text-xs">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'xlsx':
                return (
                    <div className="w-6 h-6 mr-3 bg-green-600 rounded flex items-center justify-center text-white text-xs">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'image':
                return (
                    <div className="w-6 h-6 mr-3 bg-purple-600 rounded flex items-center justify-center text-white text-xs">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="w-6 h-6 mr-3 bg-gray-600 rounded flex items-center justify-center text-white text-xs">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
        }
    };

    // Drag handlers
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragEnter = (index: number) => {
        if (draggedIndex !== null && draggedIndex !== index) {
            reorderFiles(draggedIndex, index);
            setDraggedIndex(index);
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <div className={styles.fileListContainer}>
            <div className={styles.headerRow}>
                <div>Format</div>
                <div>File name</div>
                <div>Size</div>
                <div>Delete</div>
                <div>Convert to</div>
            </div>
            {displayFiles.map((file) => (
                <div key={file.id} className={styles.fileRow}>
                    <div className={styles.iconCell}>
                        <span className={styles.fileIcon}>{renderFileIcon(file.format)}</span>
                    </div>
                    <div className={styles.filenameCell}>{file.name}</div>
                    <div className={styles.sizeCell}>{formatSize(file.size)}</div>
                    <div className={styles.deleteCell}>
                        <button className={styles.deleteButton} onClick={() => onDeleteFile(file.id)}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className={styles.dropdownCell}>
                        <StyledDropdown
                            value={file.convertTo || 'None'}
                            onChange={(e) => onConvertTo(file.id, e.target.value === 'None' ? null : e.target.value)}
                            options={[
                                { value: 'None', label: 'None' },
                                { value: 'PDF', label: 'PDF' },
                                { value: 'DOCX', label: 'DOCX' },
                                { value: 'PNG', label: 'PNG' },
                                { value: 'JPEG', label: 'JPEG' },
                                { value: 'XLS', label: 'XLS' }
                            ]}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FileList;
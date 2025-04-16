// src/components/FileList.tsx
import React, { useState, useEffect } from 'react';
import { FileType, ConversionOption, ProcessStatus } from '../types';
import MobileFileItem from './MobileFileItem';
import DraggableFileItem from './DraggableFileItem';
import { useFiles } from '../context';

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
        <div className="rounded-md overflow-hidden">
            {files.length > 0 && (
                <div className="mb-2 text-sm text-gray-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    Drag to reorder files
                </div>
            )}

            {/* Mobile layout */}
            {isMobile ? (
                <div>
                    {displayFiles.map((file) => (
                        <MobileFileItem
                            key={file.id}
                            file={file}
                            onDeleteFile={onDeleteFile}
                            onConvertTo={onConvertTo}
                            onPreviewFile={onPreviewFile}
                        />
                    ))}
                </div>
            ) : (
                /* Desktop layout */
                <>
                    <div className="grid grid-cols-12 text-sm text-gray-300 px-4 py-2">
                        <div className="col-span-1"></div> {/* Empty column for drag handle */}
                        <div className="col-span-1">Format</div>
                        <div className="col-span-4">File name</div>
                        {files.some(f => f.status !== ProcessStatus.NotStarted) && (
                            <div className="col-span-3">Progress</div>
                        )}
                        <div className="col-span-2 text-right">Size</div>
                        <div className="col-span-1 text-center">Actions</div>
                    </div>

                    {displayFiles.map((file, index) => (
                        <DraggableFileItem
                            key={file.id}
                            file={file}
                            index={index}
                            onDragStart={handleDragStart}
                            onDragEnter={handleDragEnter}
                            onDragEnd={handleDragEnd}
                            isDragging={draggedIndex === index}
                            className="mb-1"
                        >
                            <div
                                className="grid grid-cols-12 items-center bg-[#1e1e1e] px-4 py-3 rounded-md"
                            >
                                <div className="col-span-1 flex items-center">
                                    {renderFileIcon(file.format)}
                                </div>

                                <div className="col-span-4 truncate pr-4">
                                    {file.name}
                                </div>

                                {files.some(f => f.status !== ProcessStatus.NotStarted) && (
                                    <div className="col-span-3">
                                        {file.status === ProcessStatus.InProgress && (
                                            <div className="w-full bg-[#2d2d2d] rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-brand-500 h-2 rounded-full"
                                                    style={{ width: `${file.progress}%` }}
                                                ></div>
                                            </div>
                                        )}
                                        {file.status === ProcessStatus.Completed && (
                                            <div className="flex items-center">
                                                <div className="w-full bg-brand-500 rounded-full h-2"></div>
                                                <svg className="w-5 h-5 ml-2 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                        {file.status === ProcessStatus.NotStarted && (
                                            <div className="text-right pr-4">
                                                <span className="text-gray-400">{formatSize(file.size)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="col-span-2 text-right">
                                    {formatSize(file.size)}
                                </div>

                                <div className="col-span-1 flex justify-center space-x-2">
                                    {/* Preview button - only for supported formats */}
                                    {['image', 'pdf'].includes(file.format) && (
                                        <button
                                            onClick={() => onPreviewFile(file)}
                                            className="text-gray-400 hover:text-white transition-colors"
                                            title="Preview file"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    )}

                                    {/* Delete button */}
                                    <button
                                        onClick={() => onDeleteFile(file.id)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                        title="Delete file"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Convert to dropdown - shown below other columns for better layout */}
                                <div className="col-span-12 mt-2 flex justify-end">
                                    <div className="relative">
                                        <select
                                            value={file.convertTo || 'None'}
                                            onChange={(e) => {
                                                const value = e.target.value as ConversionOption;
                                                onConvertTo(file.id, value === 'None' ? null : value);
                                            }}
                                            className="appearance-none bg-[#2d2d2d] border border-[#3c3c3c] text-white py-1 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-[#3c3c3c]"
                                        >
                                            <option value="None">Convert to...</option>
                                            <option value="PDF">PDF</option>
                                            {file.format === 'image' && (
                                                <>
                                                    <option value="JPEG">JPEG</option>
                                                    <option value="PNG">PNG</option>
                                                </>
                                            )}
                                            {file.format === 'docx' && (
                                                <option value="DOCX">DOCX</option>
                                            )}
                                            {file.format === 'xlsx' && (
                                                <option value="XLSX">XLSX</option>
                                            )}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DraggableFileItem>
                    ))}
                </>
            )}
        </div>
    );
};

export default FileList;
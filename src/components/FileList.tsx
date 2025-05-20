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
        <div className="rounded-2xl bg-[#232324] shadow-lg p-0 w-full max-w-2xl mx-auto overflow-hidden border border-[#3c3c3c]">
            {files.length > 0 && (
                <div className="mb-2 text-sm text-gray-400 flex items-center px-6 pt-6">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    Drag to reorder files
                </div>
            )}

            {/* Mobile layout */}
            {isMobile ? (
                <div className="px-4 pb-4">
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
                    <div className="grid grid-cols-12 text-xs text-gray-400 px-6 pt-4 pb-2">
                        <div className="col-span-1"></div> {/* Empty column for drag handle */}
                        <div className="col-span-1">Format</div>
                        <div className="col-span-4">File name</div>
                        {files.some(f => f.status !== ProcessStatus.NotStarted) && (
                            <div className="col-span-3">Progress</div>
                        )}
                        <div className="col-span-2 text-right">Size</div>
                        <div className="col-span-1 text-center">Delete</div>
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
                            className="mb-2"
                        >
                            <div
                                className="grid grid-cols-12 items-center bg-[#1e1e1e] px-6 py-4 rounded-xl mb-2 shadow-sm hover:bg-[#232324] transition-colors"
                            >
                                <div className="col-span-1 flex items-center">
                                    {renderFileIcon(file.format)}
                                </div>

                                <div className="col-span-4 truncate pr-4 text-white font-medium">
                                    {file.name}
                                </div>

                                {files.some(f => f.status !== ProcessStatus.NotStarted) && (
                                    <div className="col-span-3">
                                        {file.status === ProcessStatus.InProgress && (
                                            <div className="w-full bg-[#2d2d2d] rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-brand-500 h-2 rounded-full transition-all duration-300"
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

                                <div className="col-span-2 text-right text-gray-300 font-medium">
                                    {formatSize(file.size)}
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <button onClick={() => onDeleteFile(file.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Convert to dropdown - shown in the correct column */}
                                <div className="col-span-1 flex justify-center">
                                    <div className="relative w-full max-w-[120px]">
                                        <select
                                            value={file.convertTo || 'None'}
                                            onChange={(e) => {
                                                const value = e.target.value as ConversionOption;
                                                onConvertTo(file.id, value === 'None' ? null : value);
                                            }}
                                            className="appearance-none bg-[#2d2d2d] border border-[#3c3c3c] text-white py-2 px-4 pr-10 rounded-xl w-full focus:outline-none focus:bg-[#3c3c3c] shadow-sm transition text-sm"
                                        >
                                            <option value="None">Convert to...</option>
                                            <option value="pdf">PDF</option>
                                            {file.format === 'image' && (
                                                <option value="webp">WebP</option>
                                            )}
                                            {file.format === 'docx' && (
                                                <>
                                                    <option value="txt">Text</option>
                                                    <option value="pdf">PDF</option>
                                                </>
                                            )}
                                            {file.format === 'xlsx' && (
                                                <>
                                                    <option value="csv">CSV</option>
                                                    <option value="json">JSON</option>
                                                </>
                                            )}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
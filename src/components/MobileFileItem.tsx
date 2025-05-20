// src/components/MobileFileItem.tsx
import React from 'react';
import { FileType, ConversionOption, ProcessStatus } from '../types';

interface MobileFileItemProps {
    file: FileType;
    onDeleteFile: (id: string) => void;
    onConvertTo: (id: string, option: ConversionOption | null) => void;
    onPreviewFile: (file: FileType) => void;
}

const MobileFileItem: React.FC<MobileFileItemProps> = ({
                                                           file,
                                                           onDeleteFile,
                                                           onConvertTo,
                                                           onPreviewFile,
                                                       }) => {
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
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'pdf':
                return (
                    <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'xlsx':
                return (
                    <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'image':
                return (
                    <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-xs">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-xs">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
        }
    };

    return (
        <div className="bg-[#1e1e1e] mb-2 rounded-md overflow-hidden">
            <div className="p-3">
                <div className="flex items-center mb-2">
                    {renderFileIcon(file.format)}
                    <div className="ml-3 flex-grow">
                        <div className="text-sm font-medium text-white truncate">{file.name}</div>
                        <div className="text-xs text-gray-400">{formatSize(file.size)}</div>
                    </div>
                </div>

                {/* Progress bar if processing */}
                {file.status === ProcessStatus.InProgress && (
                    <div className="mt-2 mb-3">
                        <div className="w-full bg-[#2d2d2d] rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-brand-500 h-2 rounded-full"
                                style={{ width: `${file.progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Completed status */}
                {file.status === ProcessStatus.Completed && (
                    <div className="mt-2 mb-3 flex items-center">
                        <div className="w-full bg-brand-500 rounded-full h-2"></div>
                        <svg className="w-5 h-5 ml-2 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}

                <div className="flex justify-between items-center mt-2">
                    {/* Convert to dropdown */}
                    <div className="relative">
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

                    {/* Action buttons */}
                    <div className="flex space-x-2">
                        {/* Preview button - only for supported formats */}
                        {['image', 'pdf'].includes(file.format) && (
                            <button
                                onClick={() => onPreviewFile(file)}
                                className="p-1 text-gray-400 hover:text-white transition-colors bg-[#2d2d2d] rounded"
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
                            className="p-1 text-gray-400 hover:text-white transition-colors bg-[#2d2d2d] rounded"
                            title="Delete file"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileFileItem;
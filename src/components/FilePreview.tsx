// src/components/FilePreview.tsx
import React, { useState, useEffect } from 'react';
import { FileType } from '../types';

interface FilePreviewProps {
    file: FileType | null;
    onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // Create preview URL for supported file types
        const fileFormat = file.format.toLowerCase();

        // Check if the file type is previewable
        if (['image', 'pdf'].includes(fileFormat)) {
            try {
                const url = URL.createObjectURL(file.file);
                setPreviewUrl(url);
                setLoading(false);

                // Clean up URL when component unmounts
                return () => {
                    if (url) URL.revokeObjectURL(url);
                };
            } catch (err) {
                console.error('Error creating preview URL:', err);
                setError('Unable to preview this file');
                setLoading(false);
            }
        } else {
            setError('Preview not available for this file format');
            setLoading(false);
        }
    }, [file]);

    if (!file) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
            <div className="bg-main-dark rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="border-b border-gray-700 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white">
                        {file.name}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="text-red-400 mb-2">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <p className="text-gray-300">{error}</p>
                            <p className="text-sm text-gray-400 mt-2">
                                {file.format !== 'image' && file.format !== 'pdf' &&
                                    "Only image and PDF files can be previewed directly."
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            {file.format === 'image' && previewUrl && (
                                <div className="flex justify-center">
                                    <img
                                        src={previewUrl}
                                        alt={file.name}
                                        className="max-w-full max-h-[70vh] object-contain"
                                    />
                                </div>
                            )}

                            {file.format === 'pdf' && previewUrl && (
                                <div className="w-full h-[70vh]">
                                    <iframe
                                        src={previewUrl}
                                        title={file.name}
                                        className="w-full h-full border-0"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-700 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-400">
                            {file.format.toUpperCase()} • {(file.size / 1024).toFixed(0)} KB
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilePreview;
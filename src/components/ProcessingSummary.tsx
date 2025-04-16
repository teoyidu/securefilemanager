// src/components/ProcessingSummary.tsx
import React from 'react';
import { useFiles } from '../context';
import { ProcessStatus } from '../types';

interface ProcessingSummaryProps {
    isOpen: boolean;
    onClose: () => void;
    onDownload: () => void;
    processingTime: number; // in seconds
    success: boolean;
    error?: string;
}

const ProcessingSummary: React.FC<ProcessingSummaryProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 onDownload,
                                                                 processingTime,
                                                                 success,
                                                                 error
                                                             }) => {
    const { files, totalSize } = useFiles();

    if (!isOpen) return null;

    // Format processing time
    const formatTime = (seconds: number): string => {
        if (seconds < 60) {
            return `${seconds.toFixed(1)} seconds`;
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} min ${remainingSeconds.toFixed(0)} sec`;
    };

    // Count files by status
    const completedFiles = files.filter(f => f.status === ProcessStatus.Completed).length;
    const failedFiles = files.filter(f => f.status !== ProcessStatus.Completed).length;

    // Calculate size reduction if applicable
    const hasReduction = files.some(f => f.convertTo !== null);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-black bg-opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-[#1a1a1a] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-[#1a1a1a] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${success ? 'bg-green-100' : 'bg-red-100'} sm:mx-0 sm:h-10 sm:w-10`}>
                                {success ? (
                                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                )}
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-white">
                                    {success ? 'Processing Complete' : 'Processing Failed'}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-300">
                                        {success
                                            ? `Successfully processed ${completedFiles} out of ${files.length} files in ${formatTime(processingTime)}.`
                                            : `Processing failed after ${formatTime(processingTime)}. ${error || 'An unknown error occurred.'}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {success && (
                            <div className="mt-5 border-t border-gray-700 pt-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border-r border-gray-700 pr-4">
                                        <div className="text-sm font-medium text-gray-400 mb-1">Files Processed</div>
                                        <div className="text-lg font-bold text-white">{completedFiles} / {files.length}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {failedFiles > 0 ? `${failedFiles} files failed` : 'All files processed successfully'}
                                        </div>
                                    </div>

                                    <div className="pl-4">
                                        <div className="text-sm font-medium text-gray-400 mb-1">Processing Time</div>
                                        <div className="text-lg font-bold text-white">{formatTime(processingTime)}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {(processingTime / files.length).toFixed(1)} sec per file on average
                                        </div>
                                    </div>
                                </div>

                                {hasReduction && (
                                    <div className="mt-5">
                                        <div className="text-sm font-medium text-gray-400 mb-1">Size Reduction</div>
                                        <div className="flex items-center">
                                            <div className="text-lg font-bold text-white">{(totalSize / (1024 * 1024)).toFixed(2)} MB</div>
                                            <div className="mx-2 text-gray-500">➝</div>
                                            <div className="text-lg font-bold text-green-500">{(totalSize * 0.7 / (1024 * 1024)).toFixed(2)} MB</div>
                                            <div className="ml-2 text-sm text-green-400">(-30%)</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-[#242424] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        {success ? (
                            <>
                                <button
                                    onClick={onDownload}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-500 text-base font-medium text-white hover:bg-indigo-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Download Files
                                </button>
                                <button
                                    onClick={onClose}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-[#1a1a1a] text-base font-medium text-gray-300 hover:bg-[#242424] focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={onClose}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-500 text-base font-medium text-white hover:bg-indigo-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={onClose}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-[#1a1a1a] text-base font-medium text-gray-300 hover:bg-[#242424] focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcessingSummary;
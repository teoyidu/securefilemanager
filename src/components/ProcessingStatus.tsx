// src/components/ProcessingStatus.tsx
import React from 'react';
import { useApp, useFiles } from '../context';
import { ProcessStatus } from '../types';

type ProcessingState = 'uploading' | 'processing' | 'completed' | 'failed';

const ProcessingStatus: React.FC = () => {
    const { appState, finishProcessing, setProcessingState } = useApp();
    const { files, totalSize, processedFiles } = useFiles();

    // Only show if processing is active or if we're in a final state (completed/failed)
    // and the modal hasn't been explicitly closed
    if (!appState.isProcessing && appState.processingState !== 'completed' && appState.processingState !== 'failed') {
        return null;
    }

    // Count files by status
    const statusCounts = {
        completed: files.filter(f => f.status === ProcessStatus.Completed).length,
        inProgress: files.filter(f => f.status === ProcessStatus.InProgress).length,
        notStarted: files.filter(f => f.status === ProcessStatus.NotStarted).length,
    };

    // Calculate overall percentage
    const overallPercentage = appState.processingProgress;

    // Get status icon
    const getStatusIcon = () => {
        const state: ProcessingState = appState.processingState;
        switch (state) {
            case 'uploading':
                return (
                    <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                );
            case 'processing':
                return (
                    <svg className="w-5 h-5 text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                );
            case 'completed':
                return (
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'failed':
                return (
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
        }
    };

    const handleClose = () => {
        if (appState.processingState === 'completed' || appState.processingState === 'failed') {
            // Set isProcessing to false to hide the modal
            finishProcessing(appState.processingState === 'completed');
            // Force a re-render by setting processing state to a non-visible state
            setProcessingState('processing', '');
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 p-4 shadow-lg z-10">
            <div className="max-w-screen-xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        {getStatusIcon()}
                        <span className="ml-2 font-medium text-white">
                            {appState.processingMessage}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <div className="text-sm text-gray-400 mr-4">
                            {statusCounts.completed} of {files.length} files completed
                        </div>
                        {(appState.processingState === 'completed' || appState.processingState === 'failed') && (
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="Close"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-1">
                        <div>
                            <span className="text-xs font-semibold inline-block text-indigo-400">
                                Overall Progress
                            </span>
                        </div>
                        <div>
                            <span className="text-xs font-semibold inline-block text-indigo-400">
                                {Math.round(overallPercentage)}%
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-800">
                        <div
                            style={{ width: `${overallPercentage}%` }}
                            className="transition-all duration-300 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                        ></div>
                    </div>
                </div>

                {appState.processingState === 'processing' && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <div className="text-xs text-gray-400 mb-1">Files processed</div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white">{statusCounts.completed} completed</span>
                                <span className="text-yellow-400">{statusCounts.inProgress} in progress</span>
                                <span className="text-gray-500">{statusCounts.notStarted} waiting</span>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs text-gray-400 mb-1">Processing details</div>
                            <div className="text-sm text-white">
                                {(() => {
                                    const state = appState.processingState as ProcessingState;
                                    if (state === 'uploading') return 'Uploading files...';
                                    if (state === 'processing') return `Processing ${statusCounts.inProgress} files simultaneously...`;
                                    if (state === 'completed') return 'All files processed successfully';
                                    return 'Processing failed';
                                })()}
                            </div>
                        </div>
                    </div>
                )}

                {appState.processingState === 'completed' && (
                    <div className="mt-2 flex justify-end">
                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded text-sm transition-colors">
                            Download Results
                        </button>
                    </div>
                )}

                {appState.processingState === 'failed' && (
                    <div className="mt-2 flex justify-end">
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors mr-2">
                            View Error Details
                        </button>
                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded text-sm transition-colors">
                            Retry
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProcessingStatus;
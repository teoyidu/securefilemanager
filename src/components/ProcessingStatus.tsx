// src/components/ProcessingStatus.tsx
import React from 'react';
import { useApp, useFiles } from '../context';
import { ProcessStatus } from '../types';

const ProcessingStatus: React.FC = () => {
    const { appState } = useApp();
    const { files, totalSize, processedFiles } = useFiles();

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
        switch (appState.processingState) {
            case 'uploading':
                return (
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                );
            case 'processing':
                return (
                    <svg className="w-6 h-6 text-yellow-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                );
            case 'completed':
                return (
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'failed':
                return (
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                );
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

                    <div className="text-sm text-gray-400">
                        {statusCounts.completed} of {files.length} files completed
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
                                {appState.processingState === 'uploading' ? 'Uploading files...' :
                                    appState.processingState === 'processing' ? `Processing ${statusCounts.inProgress} files simultaneously...` :
                                        appState.processingState === 'completed' ? 'All files processed successfully' :
                                            'Processing failed'}
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
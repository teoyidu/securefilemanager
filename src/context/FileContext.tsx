// src/context/FileContext.tsx
import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { FileType, ConversionOption, ProcessStatus } from '../types';

// Define context types
type FileContextType = {
    files: FileType[];
    totalSize: number;
    processedFiles: number;
    addFiles: (newFiles: File[]) => void;
    deleteFile: (id: string) => void;
    setFileConversion: (id: string, option: ConversionOption | null) => void;
    updateFileStatus: (id: string, status: ProcessStatus, progress: number) => void;
    updateAllFileStatuses: (status: ProcessStatus, progress: number) => void;
    clearFiles: () => void;
    reorderFiles: (startIndex: number, endIndex: number) => void;
};

// Create context with default values
const FileContext = createContext<FileContextType>({
    files: [],
    totalSize: 0,
    processedFiles: 0,
    addFiles: () => {},
    deleteFile: () => {},
    setFileConversion: () => {},
    updateFileStatus: () => {},
    updateAllFileStatuses: () => {},
    clearFiles: () => {},
    reorderFiles: () => {},
});

// Define action types for reducer
type FileAction =
    | { type: 'ADD_FILES'; payload: FileType[] }
    | { type: 'DELETE_FILE'; payload: string }
    | { type: 'SET_CONVERSION'; payload: { id: string; option: ConversionOption | null } }
    | { type: 'UPDATE_STATUS'; payload: { id: string; status: ProcessStatus; progress: number } }
    | { type: 'UPDATE_ALL_STATUSES'; payload: { status: ProcessStatus; progress: number } }
    | { type: 'CLEAR_FILES' };

// Reducer function
const fileReducer = (state: FileType[], action: FileAction): FileType[] => {
    switch (action.type) {
        case 'ADD_FILES':
            return [...state, ...action.payload];

        case 'DELETE_FILE':
            return state.filter(file => file.id !== action.payload);

        case 'SET_CONVERSION':
            return state.map(file =>
                file.id === action.payload.id
                    ? { ...file, convertTo: action.payload.option }
                    : file
            );

        case 'UPDATE_STATUS':
            return state.map(file =>
                file.id === action.payload.id
                    ? {
                        ...file,
                        status: action.payload.status,
                        progress: action.payload.progress
                    }
                    : file
            );

        case 'UPDATE_ALL_STATUSES':
            return state.map(file => ({
                ...file,
                status: action.payload.status,
                progress: action.payload.progress
            }));

        case 'CLEAR_FILES':
            return [];

        default:
            return state;
    }
};

// Provider component
export const FileProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [files, dispatch] = useReducer(fileReducer, []);
    const [totalSize, setTotalSize] = useState<number>(0);
    const [processedFiles, setProcessedFiles] = useState<number>(0);

    // Calculate total size whenever files change
    useEffect(() => {
        const size = files.reduce((total, file) => total + file.size, 0);
        setTotalSize(size);

        // Count processed files
        const completed = files.filter(file => file.status === ProcessStatus.Completed).length;
        setProcessedFiles(completed);
    }, [files]);

    // Add new files
    const addFiles = (newFiles: File[]) => {
        console.log(`[FileContext] Starting to add ${newFiles.length} files`);
        
        const fileObjects = newFiles.map((file) => {
            console.log(`[FileContext] Processing file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
            
            // Determine file format based on extension
            const extension = file.name.split('.').pop()?.toLowerCase() || '';
            let format = '';

            if (['docx', 'doc'].includes(extension)) {
                format = 'docx';
            } else if (extension === 'pdf') {
                format = 'pdf';
            } else if (['xls', 'xlsx'].includes(extension)) {
                format = 'xlsx';
            } else if (['png', 'jpg', 'jpeg', 'gif'].includes(extension)) {
                format = 'image';
            } else {
                format = 'other';
                console.warn(`[FileContext] Unsupported file format: ${extension} for file: ${file.name}`);
            }

            console.log(`[FileContext] Detected format: ${format} for file: ${file.name}`);

            const fileObject = {
                id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: file.name,
                size: file.size,
                format,
                file,
                convertTo: null,
                status: ProcessStatus.NotStarted,
                progress: 0
            };

            console.log(`[FileContext] Created file object:`, fileObject);
            return fileObject;
        });

        console.log(`[FileContext] Dispatching ADD_FILES action with ${fileObjects.length} files`);
        dispatch({ type: 'ADD_FILES', payload: fileObjects });
    };

    // Delete a file
    const deleteFile = (id: string) => {
        console.log(`[FileContext] Deleting file with ID: ${id}`);
        dispatch({ type: 'DELETE_FILE', payload: id });
    };

    // Set file conversion
    const setFileConversion = (id: string, option: ConversionOption | null) => {
        console.log(`[FileContext] Setting conversion for file ${id} to: ${option || 'None'}`);
        dispatch({ type: 'SET_CONVERSION', payload: { id, option } });
    };

    // Update file status
    const updateFileStatus = (id: string, status: ProcessStatus, progress: number) => {
        console.log(`[FileContext] Updating status for file ${id}: ${status} (${progress}%)`);
        dispatch({ type: 'UPDATE_STATUS', payload: { id, status, progress } });
    };

    // Update all file statuses
    const updateAllFileStatuses = (status: ProcessStatus, progress: number) => {
        console.log(`[FileContext] Updating all files to status: ${status} (${progress}%)`);
        dispatch({ type: 'UPDATE_ALL_STATUSES', payload: { status, progress } });
    };

    // Clear all files
    const clearFiles = () => {
        console.log('[FileContext] Clearing all files');
        dispatch({ type: 'CLEAR_FILES' });
    };

    // Reorder files
    const reorderFiles = (startIndex: number, endIndex: number) => {
        console.log(`[FileContext] Reordering files from index ${startIndex} to ${endIndex}`);
        const result = Array.from(files);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        dispatch({ type: 'ADD_FILES', payload: result });
    };

    return (
        <FileContext.Provider
            value={{
                files,
                totalSize,
                processedFiles,
                addFiles,
                deleteFile,
                setFileConversion,
                updateFileStatus,
                updateAllFileStatuses,
                clearFiles,
                reorderFiles
            }}
        >
            {children}
        </FileContext.Provider>
    );
};

// Custom hook for using the file context
export const useFiles = () => useContext(FileContext);
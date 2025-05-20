import React, { createContext, useContext, useState } from 'react';

type ProcessingState = 'uploading' | 'processing' | 'completed' | 'failed';

interface AppState {
    isProcessing: boolean;
    processingMessage: string;
    processingProgress: number;
    processingSuccess: boolean;
    processingError: string | null;
    processingTime: number | null;
    showLess: boolean;
    previewFile: any | null;
    processingState: ProcessingState;
}

interface AppContextType {
    appState: AppState;
    startProcessing: (message: string) => void;
    setProcessingState: (state: 'processing' | 'success' | 'error', message: string) => void;
    setProcessingProgress: (progress: number) => void;
    setProcessingSuccess: (success: boolean) => void;
    setProcessingError: (error: string | null) => void;
    setProcessingTime: (time: number | null) => void;
    finishProcessing: (success: boolean) => void;
    toggleShowLess: () => void;
    setPreviewFile: (file: any | null) => void;
}

const defaultAppState: AppState = {
    isProcessing: false,
    processingMessage: '',
    processingProgress: 0,
    processingSuccess: false,
    processingError: null,
    processingTime: null,
    showLess: false,
    previewFile: null,
    processingState: 'uploading'
};

const AppContext = createContext<AppContextType>({
    appState: defaultAppState,
    startProcessing: () => {},
    setProcessingState: () => {},
    setProcessingProgress: () => {},
    setProcessingSuccess: () => {},
    setProcessingError: () => {},
    setProcessingTime: () => {},
    finishProcessing: () => {},
    toggleShowLess: () => {},
    setPreviewFile: () => {}
});

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [appState, setAppState] = useState<AppState>(defaultAppState);

    const startProcessing = (message: string) => {
        setAppState(prev => ({
            ...prev,
            isProcessing: true,
            processingMessage: message,
            processingProgress: 0,
            processingSuccess: false,
            processingError: null,
            processingTime: null,
            processingState: 'uploading'
        }));
    };

    const setProcessingState = (state: 'processing' | 'success' | 'error', message: string) => {
        setAppState(prev => ({
            ...prev,
            processingMessage: message,
            processingState: state === 'success' ? 'completed' : state === 'error' ? 'failed' : 'processing'
        }));
    };

    const setProcessingProgress = (progress: number) => {
        setAppState(prev => ({
            ...prev,
            processingProgress: progress
        }));
    };

    const setProcessingSuccess = (success: boolean) => {
        setAppState(prev => ({
            ...prev,
            processingSuccess: success
        }));
    };

    const setProcessingError = (error: string | null) => {
        setAppState(prev => ({
            ...prev,
            processingError: error
        }));
    };

    const setProcessingTime = (time: number | null) => {
        setAppState(prev => ({
            ...prev,
            processingTime: time
        }));
    };

    const finishProcessing = (success: boolean) => {
        setAppState(prev => ({
            ...prev,
            isProcessing: false,
            processingSuccess: success,
            processingState: success ? 'completed' : 'failed'
        }));
    };

    const toggleShowLess = () => {
        setAppState(prev => ({
            ...prev,
            showLess: !prev.showLess
        }));
    };

    const setPreviewFile = (file: any | null) => {
        setAppState(prev => ({
            ...prev,
            previewFile: file
        }));
    };

    return (
        <AppContext.Provider
            value={{
                appState,
                startProcessing,
                setProcessingState,
                setProcessingProgress,
                setProcessingSuccess,
                setProcessingError,
                setProcessingTime,
                finishProcessing,
                toggleShowLess,
                setPreviewFile
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);

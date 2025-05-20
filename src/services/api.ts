// src/services/api.ts
import { FileType, ActionType, ProcessStatus } from '../types';

// Base API URL - replace with your actual backend API endpoint
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.securefilemanager.com/api';

// Helper function to handle errors
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'An error occurred');
    }
    return response.json();
};

// File upload and processing service
export const fileService = {
    /**
     * Upload files to the server
     * @param files Array of files to upload
     * @returns Promise with upload response
     */
    uploadFiles: async (files: FileType[]): Promise<{ uploadId: string }> => {
        const formData = new FormData();

        // Add each file to form data
        files.forEach(fileItem => {
            formData.append('files', fileItem.file);
        });

        // Add metadata for each file
        formData.append('metadata', JSON.stringify(
            files.map(file => ({
                id: file.id,
                name: file.name,
                format: file.format,
                convertTo: file.convertTo
            }))
        ));

        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
        });

        return handleResponse(response);
    },

    /**
     * Process files with selected actions
     * @param uploadId The upload ID received from uploadFiles
     * @param actions Array of actions to perform on the files
     * @returns Promise with processing response
     */
    processFiles: async (uploadId: string, actions: ActionType[]): Promise<{ processId: string }> => {
        const response = await fetch(`${API_BASE_URL}/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uploadId,
                actions
            }),
        });

        return handleResponse(response);
    },

    /**
     * Check processing status
     * @param processId The process ID received from processFiles
     * @returns Promise with processing status
     */
    checkStatus: async (processId: string): Promise<{
        status: 'pending' | 'processing' | 'completed' | 'failed',
        progress: number,
        fileStatuses: { fileId: string, progress: number, status: ProcessStatus }[]
    }> => {
        const response = await fetch(`${API_BASE_URL}/status/${processId}`);
        return handleResponse(response);
    },

    /**
     * Get download URL for processed files
     * @param processId The process ID received from processFiles
     * @returns Promise with download URL
     */
    getDownloadUrl: async (processId: string): Promise<{ downloadUrl: string }> => {
        const response = await fetch(`${API_BASE_URL}/download/${processId}`);
        return handleResponse(response);
    }
};

/**
 * Service for saved action sets
 */
export const actionSetService = {
    /**
     * Save an action set
     * @param name Name of the action set
     * @param actions Array of actions in the set
     * @returns Promise with save response
     */
    saveActionSet: async (name: string, actions: ActionType[]): Promise<{ id: string }> => {
        const response = await fetch(`${API_BASE_URL}/action-sets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                actions
            }),
        });

        return handleResponse(response);
    },

    /**
     * Get saved action sets
     * @returns Promise with array of action sets
     */
    getActionSets: async (): Promise<{ id: string, name: string, actions: ActionType[] }[]> => {
        const response = await fetch(`${API_BASE_URL}/action-sets`);
        return handleResponse(response);
    }
};
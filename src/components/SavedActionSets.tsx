// src/components/SavedActionSets.tsx
import React, { useState, useEffect } from 'react';
import { useActions } from '../context';
import { storageService } from '../services/localStorage';
import { ActionType } from '../types';

interface SavedActionSetsProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ActionSetItem {
    id: string;
    name: string;
    actions: ActionType[];
    createdAt: number;
}

const SavedActionSets: React.FC<SavedActionSetsProps> = ({ isOpen, onClose }) => {
    const [actionSets, setActionSets] = useState<ActionSetItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { setActions } = useActions();

    useEffect(() => {
        if (isOpen) {
            loadActionSets();
        }
    }, [isOpen]);

    const loadActionSets = () => {
        setLoading(true);
        const sets = storageService.getActionSets();
        setActionSets(sets);
        setLoading(false);
    };

    const handleLoadSet = (set: ActionSetItem) => {
        setActions(set.actions);
        onClose();
    };

    const handleDeleteSet = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this action set?')) {
            storageService.deleteActionSet(id);
            loadActionSets();
        }
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-black bg-opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-[#1a1a1a] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-[#1a1a1a] px-4 pt-5 pb-4 sm:p-6">
                        <div className="sm:flex sm:items-start mb-4">
                            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-white flex justify-between items-center">
                                    <span>Saved Action Sets</span>
                                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-400">
                                        Load a previously saved set of actions to quickly reuse common workflows.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="py-10 flex justify-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : actionSets.length === 0 ? (
                            <div className="py-10 text-center">
                                <p className="text-gray-400">No saved action sets found.</p>
                                <p className="text-sm text-gray-500 mt-2">Save an action set to see it here.</p>
                            </div>
                        ) : (
                            <div className="mt-4 max-h-60 overflow-y-auto">
                                {actionSets.map((set) => (
                                    <div
                                        key={set.id}
                                        className="bg-[#242424] hover:bg-[#2a2a2a] rounded-md p-3 mb-2 cursor-pointer transition-colors"
                                        onClick={() => handleLoadSet(set)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-white font-medium">{set.name}</h4>
                                            <button
                                                onClick={(e) => handleDeleteSet(set.id, e)}
                                                className="text-gray-400 hover:text-red-400 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="mt-1 flex justify-between text-xs">
                                            <span className="text-gray-400">{set.actions.length} actions</span>
                                            <span className="text-gray-500">Saved {formatDate(set.createdAt)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-[#242424] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            onClick={onClose}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-500 text-base font-medium text-white hover:bg-indigo-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedActionSets;
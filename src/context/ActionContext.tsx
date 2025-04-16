// src/context/ActionContext.tsx
import React, { createContext, useContext, useReducer } from 'react';
import { ActionType, ActionOptionType } from '../types';

// Define context types
type ActionContextType = {
    actions: ActionType[];
    addAction: (type: ActionOptionType) => void;
    deleteAction: (id: string) => void;
    updateAction: (id: string, options: Record<string, string>) => void;
    setActions: (actions: ActionType[]) => void;
    clearActions: () => void;
};

// Create context with default values
const ActionContext = createContext<ActionContextType>({
    actions: [],
    addAction: () => {},
    deleteAction: () => {},
    updateAction: () => {},
    setActions: () => {},
    clearActions: () => {},
});

// Define action types for reducer
type ActionDispatch =
    | { type: 'ADD_ACTION'; payload: ActionType }
    | { type: 'DELETE_ACTION'; payload: string }
    | { type: 'UPDATE_ACTION'; payload: { id: string; options: Record<string, string> } }
    | { type: 'SET_ACTIONS'; payload: ActionType[] }
    | { type: 'CLEAR_ACTIONS' };

// Reducer function
const actionReducer = (state: ActionType[], action: ActionDispatch): ActionType[] => {
    switch (action.type) {
        case 'ADD_ACTION':
            return [...state, action.payload];

        case 'DELETE_ACTION':
            return state.filter(item => item.id !== action.payload);

        case 'UPDATE_ACTION':
            return state.map(item =>
                item.id === action.payload.id
                    ? { ...item, options: { ...item.options, ...action.payload.options } }
                    : item
            );

        case 'SET_ACTIONS':
            return action.payload;

        case 'CLEAR_ACTIONS':
            return [];

        default:
            return state;
    }
};

// Provider component
export const ActionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [actions, dispatch] = useReducer(actionReducer, []);

    // Add a new action
    const addAction = (type: ActionOptionType) => {
        const newAction: ActionType = {
            id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            options: {}
        };
        dispatch({ type: 'ADD_ACTION', payload: newAction });
    };

    // Delete an action
    const deleteAction = (id: string) => {
        dispatch({ type: 'DELETE_ACTION', payload: id });
    };

    // Update action options
    const updateAction = (id: string, options: Record<string, string>) => {
        dispatch({ type: 'UPDATE_ACTION', payload: { id, options } });
    };

    // Set all actions (for loading saved action sets)
    const setActions = (newActions: ActionType[]) => {
        dispatch({ type: 'SET_ACTIONS', payload: newActions });
    };

    // Clear all actions
    const clearActions = () => {
        dispatch({ type: 'CLEAR_ACTIONS' });
    };

    return (
        <ActionContext.Provider
            value={{
                actions,
                addAction,
                deleteAction,
                updateAction,
                setActions,
                clearActions
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};

// Custom hook for using the action context
export const useActions = () => useContext(ActionContext);
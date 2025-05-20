// src/services/localStorage.ts
import { ActionType } from '../types';

// Storage keys
const KEYS = {
    RECENT_ACTIONS: 'secureFileManager_recentActions',
    ACTION_SETS: 'secureFileManager_actionSets',
    USER_PREFERENCES: 'secureFileManager_preferences',
};

// Types
interface ActionSet {
    id: string;
    name: string;
    actions: ActionType[];
    createdAt: number;
}

interface UserPreferences {
    theme: 'dark' | 'light';
    showFileDetails: boolean;
    defaultView: 'list' | 'grid';
    recentSearches: string[];
    maxRecentSearches: number;
}

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'dark',
    showFileDetails: true,
    defaultView: 'list',
    recentSearches: [],
    maxRecentSearches: 5,
};

// Local storage service
export const storageService = {
    /**
     * Save the most recent action set to localStorage
     */
    saveRecentActions: (actions: ActionType[]): void => {
        try {
            localStorage.setItem(KEYS.RECENT_ACTIONS, JSON.stringify(actions));
        } catch (error) {
            console.error('Error saving recent actions to localStorage:', error);
        }
    },

    /**
     * Get the most recent action set from localStorage
     */
    getRecentActions: (): ActionType[] => {
        try {
            const actions = localStorage.getItem(KEYS.RECENT_ACTIONS);
            return actions ? JSON.parse(actions) : [];
        } catch (error) {
            console.error('Error getting recent actions from localStorage:', error);
            return [];
        }
    },

    /**
     * Save a named action set to localStorage
     */
    saveActionSet: (name: string, actions: ActionType[]): ActionSet => {
        try {
            // Get existing action sets
            const actionSets = storageService.getActionSets();

            // Create new action set
            const newActionSet: ActionSet = {
                id: `set-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name,
                actions,
                createdAt: Date.now(),
            };

            // Add to beginning of array (most recent first)
            actionSets.unshift(newActionSet);

            // Save to localStorage
            localStorage.setItem(KEYS.ACTION_SETS, JSON.stringify(actionSets));

            return newActionSet;
        } catch (error) {
            console.error('Error saving action set to localStorage:', error);
            return {
                id: '',
                name: '',
                actions: [],
                createdAt: 0,
            };
        }
    },

    /**
     * Get all saved action sets from localStorage
     */
    getActionSets: (): ActionSet[] => {
        try {
            const actionSets = localStorage.getItem(KEYS.ACTION_SETS);
            return actionSets ? JSON.parse(actionSets) : [];
        } catch (error) {
            console.error('Error getting action sets from localStorage:', error);
            return [];
        }
    },

    /**
     * Delete an action set from localStorage
     */
    deleteActionSet: (id: string): boolean => {
        try {
            // Get existing action sets
            const actionSets = storageService.getActionSets();

            // Filter out the one to delete
            const updatedActionSets = actionSets.filter(set => set.id !== id);

            // Save to localStorage
            localStorage.setItem(KEYS.ACTION_SETS, JSON.stringify(updatedActionSets));

            return true;
        } catch (error) {
            console.error('Error deleting action set from localStorage:', error);
            return false;
        }
    },

    /**
     * Get user preferences from localStorage
     */
    getPreferences: (): UserPreferences => {
        try {
            const preferences = localStorage.getItem(KEYS.USER_PREFERENCES);
            return preferences ? { ...DEFAULT_PREFERENCES, ...JSON.parse(preferences) } : DEFAULT_PREFERENCES;
        } catch (error) {
            console.error('Error getting preferences from localStorage:', error);
            return DEFAULT_PREFERENCES;
        }
    },

    /**
     * Save user preferences to localStorage
     */
    savePreferences: (preferences: Partial<UserPreferences>): UserPreferences => {
        try {
            // Get existing preferences
            const existingPreferences = storageService.getPreferences();

            // Merge with new preferences
            const updatedPreferences = { ...existingPreferences, ...preferences };

            // Save to localStorage
            localStorage.setItem(KEYS.USER_PREFERENCES, JSON.stringify(updatedPreferences));

            return updatedPreferences;
        } catch (error) {
            console.error('Error saving preferences to localStorage:', error);
            return DEFAULT_PREFERENCES;
        }
    },

    /**
     * Add a search term to recent searches
     */
    addRecentSearch: (term: string): void => {
        try {
            const preferences = storageService.getPreferences();

            // Remove if already exists (to move to front)
            const searches = preferences.recentSearches.filter(s => s !== term);

            // Add to front of array
            searches.unshift(term);

            // Limit to max number of searches
            const limitedSearches = searches.slice(0, preferences.maxRecentSearches);

            // Save updated preferences
            storageService.savePreferences({ recentSearches: limitedSearches });
        } catch (error) {
            console.error('Error adding recent search:', error);
        }
    },

    /**
     * Clear all data from localStorage
     */
    clearAll: (): void => {
        try {
            localStorage.removeItem(KEYS.RECENT_ACTIONS);
            localStorage.removeItem(KEYS.ACTION_SETS);
            localStorage.removeItem(KEYS.USER_PREFERENCES);
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    },
};
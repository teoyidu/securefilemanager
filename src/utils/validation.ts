// src/utils/validation.ts
import { ActionOptionType } from '../types';

// Generic validation result type
export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

// Validation functions for different field types
export const validateRequired = (value: string, fieldName: string): string | null => {
    return value.trim() === '' ? `${fieldName} is required` : null;
};

export const validateNumber = (value: string, fieldName: string, min?: number, max?: number): string | null => {
    if (value.trim() === '') {
        return `${fieldName} is required`;
    }

    const num = Number(value);
    if (isNaN(num)) {
        return `${fieldName} must be a valid number`;
    }

    if (min !== undefined && num < min) {
        return `${fieldName} must be at least ${min}`;
    }

    if (max !== undefined && num > max) {
        return `${fieldName} must be at most ${max}`;
    }

    return null;
};

export const validateFileName = (value: string): string | null => {
    if (value.trim() === '') {
        return 'Filename is required';
    }

    // Check for invalid characters in a filename
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g;
    if (invalidChars.test(value)) {
        return 'Filename contains invalid characters';
    }

    return null;
};

export const validateEmail = (value: string): string | null => {
    if (value.trim() === '') {
        return null; // Email might be optional
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
    }

    return null;
};

// Validate action options based on action type
export const validateActionOptions = (
    actionType: ActionOptionType,
    options: Record<string, string>
): ValidationResult => {
    const errors: Record<string, string> = {};

    switch (actionType) {
        case ActionOptionType.FileRenaming:
            if (options.prefix && options.prefix.trim() === '') {
                errors.prefix = 'Prefix/suffix text is required';
            }
            break;

        case ActionOptionType.CompressFiles:
            const zipNameError = validateFileName(options.outputName || '');
            if (zipNameError) {
                errors.outputName = zipNameError;
            }
            break;

        case ActionOptionType.CombineFiles:
            if (options.combineType === 'pdf' || options.combineType === 'merge-excel') {
                const outputNameError = validateFileName(options.outputName || '');
                if (outputNameError) {
                    errors.outputName = outputNameError;
                }
            }
            break;

        case ActionOptionType.ResizeImages:
            if (options.resizeOption === 'percentage') {
                const percentageError = validateNumber(options.percentage || '', 'Percentage', 1, 100);
                if (percentageError) {
                    errors.percentage = percentageError;
                }
            } else if (options.resizeOption === 'dimensions') {
                const widthError = validateNumber(options.width || '', 'Width', 1);
                if (widthError) {
                    errors.width = widthError;
                }

                const heightError = validateNumber(options.height || '', 'Height', 1);
                if (heightError) {
                    errors.height = heightError;
                }
            } else if (options.resizeOption === 'maxWidth') {
                const widthError = validateNumber(options.width || '', 'Maximum width', 1);
                if (widthError) {
                    errors.width = widthError;
                }
            } else if (options.resizeOption === 'maxHeight') {
                const heightError = validateNumber(options.height || '', 'Maximum height', 1);
                if (heightError) {
                    errors.height = heightError;
                }
            }
            break;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
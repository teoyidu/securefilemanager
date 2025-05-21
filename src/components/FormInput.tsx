// src/components/FormInput.tsx
import React, { useState, useEffect } from 'react';
import styles from './FormInput.module.css';

interface FormInputProps {
    type: 'text' | 'number' | 'email' | 'select';
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onBlur?: () => void;
    label?: string;
    placeholder?: string;
    error?: string;
    className?: string;
    min?: number;
    max?: number;
    required?: boolean;
    options?: { value: string; label: string }[];
    validateOnChange?: boolean;
    validateFn?: (value: string) => string | null;
}

const FormInput: React.FC<FormInputProps> = ({
                                                 type,
                                                 id,
                                                 name,
                                                 value,
                                                 onChange,
                                                 onBlur,
                                                 label,
                                                 placeholder,
                                                 error: externalError,
                                                 className = '',
                                                 min,
                                                 max,
                                                 required = false,
                                                 options = [],
                                                 validateOnChange = false,
                                                 validateFn
                                             }) => {
    const [touched, setTouched] = useState(false);
    const [error, setError] = useState<string | null>(externalError || null);

    // When external error prop changes, update internal error state
    useEffect(() => {
        setError(externalError || null);
    }, [externalError]);

    // Validate on change if option is enabled
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onChange(e);

        if (validateOnChange && validateFn) {
            const validationError = validateFn(e.target.value);
            setError(validationError);
        }
    };

    // Validate on blur
    const handleBlur = () => {
        setTouched(true);

        if (validateFn) {
            const validationError = validateFn(value);
            setError(validationError);
        }

        if (onBlur) {
            onBlur();
        }
    };

    // Common classes for inputs
    const inputClasses = `bg-[#1e1e1e] border ${
        touched && error ? 'border-red-500' : 'border-[#3c3c3c]'
    } text-white py-2 px-4 rounded w-full focus:outline-none ${
        touched && error ? 'focus:border-red-500' : 'focus:border-brand-500'
    }`;

    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-300 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {type === 'select' ? (
                <div className={styles.selectWrapper}>
                    <select
                        id={id}
                        name={name}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={styles.select}
                        required={required}
                        aria-invalid={touched && error ? 'true' : 'false'}
                        aria-describedby={touched && error ? `${id}-error` : undefined}
                    >
                        {options.map(option => (
                            <option key={option.value} value={option.value} className={styles.option}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className={styles.selectChevron}>
                        <svg className={styles.chevronIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            ) : (
                <input
                    type={type}
                    id={id}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className={inputClasses}
                    min={min}
                    max={max}
                    required={required}
                    aria-invalid={touched && error ? 'true' : 'false'}
                    aria-describedby={touched && error ? `${id}-error` : undefined}
                />
            )}

            {touched && error && (
                <p
                    id={`${id}-error`}
                    className="mt-1 text-sm text-red-500"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormInput;
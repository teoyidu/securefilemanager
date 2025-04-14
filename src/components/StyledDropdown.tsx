// src/components/StyledDropdown.tsx
import React from 'react';

interface StyledDropdownProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: {value: string, label: string}[];
    className?: string;
    disabled?: boolean;
}

const StyledDropdown: React.FC<StyledDropdownProps> = ({
                                                           value,
                                                           onChange,
                                                           options,
                                                           className = '',
                                                           disabled = false
                                                       }) => {
    return (
        <div className={`relative ${className}`}>
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="custom-select w-full"
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="select-arrow">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

export default StyledDropdown;
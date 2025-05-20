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
                className="appearance-none bg-[#2d2d2d] border border-[#3c3c3c] text-white py-2 px-4 pr-10 rounded-xl w-full focus:outline-none focus:bg-[#3c3c3c] shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="select-arrow pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

export default StyledDropdown;
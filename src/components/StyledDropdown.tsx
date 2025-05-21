// src/components/StyledDropdown.tsx
import React from 'react';
import Select from 'react-select';
import styles from './StyledDropdown.module.css';

interface OptionType {
    value: string;
    label: string;
}

interface StyledDropdownProps {
    value: string;
    onChange: (e: any) => void;
    options: OptionType[];
    className?: string;
    disabled?: boolean;
}

const customStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: '#2d2d2d',
        borderColor: '#3c3c3c',
        borderRadius: 12,
        minHeight: 40,
        boxShadow: state.isFocused ? '0 0 0 2px #a259ff' : 'none',
        color: '#fff',
        fontSize: 15,
        fontWeight: 500,
        paddingLeft: 2,
        paddingRight: 2,
        transition: 'border-color 0.2s',
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: '#fff',
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: '#232032',
        borderRadius: 12,
        marginTop: 2,
        zIndex: 10,
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? '#a259ff'
            : state.isFocused
            ? '#2d2d2d'
            : 'transparent',
        color: state.isSelected ? '#fff' : '#fff',
        fontWeight: state.isSelected ? 600 : 400,
        cursor: 'pointer',
        fontSize: 15,
        padding: '10px 16px',
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        color: '#bfbfbf',
        paddingRight: 8,
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    input: (provided: any) => ({
        ...provided,
        color: '#fff',
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: '#bfbfbf',
    }),
};

const StyledDropdown: React.FC<StyledDropdownProps> = ({
    value,
    onChange,
    options,
    className = '',
    disabled = false,
}) => {
    const selectedOption = options.find((opt) => opt.value === value) || null;
    return (
        <div className={styles.dropdownWrapper}>
            <Select
                value={selectedOption}
                onChange={(option) => {
                    if (option) {
                        onChange({ target: { value: option.value } });
                    } else {
                        onChange({ target: { value: '' } });
                    }
                }}
                options={options}
                isDisabled={disabled}
                classNamePrefix="custom-select"
                menuPlacement="auto"
                isSearchable={false}
                styles={customStyles}
            />
        </div>
    );
};

export default StyledDropdown;
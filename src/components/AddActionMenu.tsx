// src/components/AddActionMenu.tsx
import React, { useEffect, useRef } from 'react';
import { ActionOption, ActionOptionType } from '../types';

interface AddActionMenuProps {
  options: ActionOption[];
  onSelect: (type: ActionOptionType) => void;
  onClose: () => void;
}

const AddActionMenu: React.FC<AddActionMenuProps> = ({ options, onSelect, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
      <div ref={menuRef} className="absolute z-10 bg-[#1e1e1e] border border-[#3c3c3c] rounded-md shadow-lg w-full">
        <div className="p-4 text-white">
          <h3 className="text-sm font-medium mb-2">Add an action</h3>

          <div className="space-y-2">
            {options.map((option) => (
                <button
                    key={option.id}
                    className="w-full flex items-center py-3 px-4 rounded-md text-left hover:bg-[#2d2d2d] transition-colors"
                    onClick={() => onSelect(option.type)}
                >
                  <div className="flex items-center justify-center w-6 h-6 bg-brand-500 rounded-md mr-3 text-white">
                    {option.icon}
                  </div>
                  <span className="text-sm">{option.title}</span>
                </button>
            ))}
          </div>
        </div>
      </div>
  );
};

export default AddActionMenu;
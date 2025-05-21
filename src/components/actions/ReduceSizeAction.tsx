// src/components/actions/ReduceSizeAction.tsx
import React, { useState } from 'react';
import { ActionType } from '../../types';
import StyledDropdown from '../StyledDropdown';

interface ReduceSizeActionProps {
  action: ActionType;
  onDelete: () => void;
}

const ReduceSizeAction: React.FC<ReduceSizeActionProps> = ({ action, onDelete }) => {
  const [sizeOption, setSizeOption] = useState<string>('max');
  const [quality, setQuality] = useState<string>('less');
  const [selectedOption, setSelectedOption] = useState<string>('max');
  const sizeOptions = [
    { value: 'max', label: 'Maximum compression' },
    { value: 'email', label: 'Optimize file size for email' }
  ];
  const qualityOptions = [
    { value: 'less', label: 'less quality' },
    { value: 'medium', label: 'medium quality' },
    { value: 'high', label: 'high quality' }
  ];
  const emailSizeOptions = [
    { value: '10MB', label: 'under 10MB' },
    { value: '5MB', label: 'under 5MB' },
    { value: '2MB', label: 'under 2MB' }
  ];
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleOptionChange = (e: any) => {
    setSelectedOption(e.target.value);
    setSizeOption(e.target.value);
  };

  return (
      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <div className="flex items-center text-sm text-white">
            <span>Reduce file size</span>
            <button
                onClick={onDelete}
                className="ml-2 text-xs text-gray-400 hover:text-gray-300"
            >
              Delete this action
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-grow">
            <StyledDropdown
              value={selectedOption}
              onChange={handleOptionChange}
              options={sizeOptions}
              disabled={isProcessing}
            />
          </div>

          {sizeOption === 'max' && (
              <div className="w-40">
                <StyledDropdown
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  options={qualityOptions}
                  disabled={isProcessing}
                />
              </div>
          )}

          {sizeOption === 'email' && (
              <div className="w-40">
                <StyledDropdown
                  value="10MB"
                  onChange={() => {}}
                  options={emailSizeOptions}
                  disabled={true}
                />
              </div>
          )}
        </div>

        {sizeOption === 'email' && (
            <div className="text-xs text-gray-400 mt-2">
              Email optimization may result in your files being split into separate folders to fit within email attachment limits.
            </div>
        )}
      </div>
  );
};

export default ReduceSizeAction;
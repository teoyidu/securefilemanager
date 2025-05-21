// src/components/actions/CombineAction.tsx
import React, { useState } from 'react';
import { ActionType } from '../../types';
import StyledDropdown from '../StyledDropdown';

interface CombineActionProps {
  action: ActionType;
  onDelete: () => void;
}

const CombineAction: React.FC<CombineActionProps> = ({ action, onDelete }) => {
  const [combineType, setCombineType] = useState<string>('same-format');
  const [selectedFormat, setSelectedFormat] = useState<string>('XLS');
  const [outputName, setOutputName] = useState<string>('Project-Budget');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const formatOptions = [
    { value: 'PDF', label: 'PDF' },
    { value: 'XLS', label: 'XLS' },
    { value: 'DOCX', label: 'DOCX' },
    { value: 'JPEG', label: 'JPEG' },
  ];

  const combineTypeOptions = [
    { value: 'same-format', label: 'Combine same format files' },
    { value: 'pdf', label: 'Create a single PDF file' },
    { value: 'merge-excel', label: 'Merge Excel workbooks' }
  ];

  const handleFormatChange = (value: string) => {
    setSelectedFormat(value);
  };

  return (
      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <div className="flex items-center text-sm text-white">
            <span>Combine files together</span>
            <button
                onClick={onDelete}
                className="ml-2 text-xs text-gray-400 hover:text-gray-300"
            >
              Delete this action
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-3">
          <div className="flex-grow">
            <div className="relative">
              <StyledDropdown
                value={combineType}
                onChange={(e) => setCombineType(e.target.value)}
                options={combineTypeOptions}
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="w-32">
            <div className="relative">
              <StyledDropdown
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                options={formatOptions}
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>

        {(combineType === 'pdf' || combineType === 'merge-excel') && (
            <div className="mt-2">
              <input
                  type="text"
                  value={outputName}
                  onChange={(e) => setOutputName(e.target.value)}
                  className="bg-[#1e1e1e] border border-[#3c3c3c] text-white py-2 px-4 rounded w-full focus:outline-none focus:border-brand-500"
                  placeholder={combineType === 'pdf' ? "Output PDF filename" : "Output Excel filename"}
              />
              <div className="text-xs text-gray-400 mt-1">
                Example: {combineType === 'pdf' ? `${outputName}.pdf` : `${outputName}.xls`}
              </div>
            </div>
        )}
      </div>
  );
};

export default CombineAction;
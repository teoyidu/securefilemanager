// src/components/actions/ConvertAction.tsx
import React, { useState } from 'react';
import { ActionType } from '../../types';
import StyledDropdown from '../StyledDropdown';

interface ConvertActionProps {
  action: ActionType;
  onDelete: () => void;
}

const ConvertAction: React.FC<ConvertActionProps> = ({ action, onDelete }) => {
  const [conversionType, setConversionType] = useState<string>('separately');
  const [selectedFormat, setSelectedFormat] = useState<string>('PDF');

  return (
      <div className="mt-6 bg-[#1e1e1e] border border-[#3c3c3c] rounded-md p-4">
        <div className="flex justify-between mb-4">
          <div className="text-sm font-medium text-white">Convert file to other format</div>
          <button
              onClick={onDelete}
              className="text-xs text-gray-400 hover:text-gray-300"
          >
            Delete this action
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <StyledDropdown
              value={conversionType}
              onChange={(e) => setConversionType(e.target.value)}
              options={[
                { value: 'separately', label: 'Convert files separately' },
                { value: 'all', label: 'Convert all files to same format' },
                { value: 'single', label: 'Combine all into single PDF file' },
                { value: 'pdf-separate', label: 'Create separate PDF files' }
              ]}
              className="flex-grow"
          />

          {conversionType !== 'single' && conversionType !== 'pdf-separate' && (
              <StyledDropdown
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  options={[
                    { value: 'PDF', label: 'PDF' },
                    { value: 'DOCX', label: 'DOCX' },
                    { value: 'PNG', label: 'PNG' },
                    { value: 'JPEG', label: 'JPEG' }
                  ]}
                  className="w-32"
              />
          )}
        </div>
      </div>
  );
};

export default ConvertAction;
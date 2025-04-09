// src/components/actions/ConvertAction.tsx
import React, {useState} from 'react';
import {ActionType} from '../../types';

interface ConvertActionProps {
  action: ActionType;
  onDelete: () => void;
}

const ConvertAction: React.FC<ConvertActionProps> = ({ action, onDelete }) => {
  const [conversionType, setConversionType] = useState<string>('separately');
  const [selectedFormat, setSelectedFormat] = useState<string>('PDF');

  return (
    <div className="mt-6">
      <div className="flex justify-between mb-2">
        <div className="flex items-center text-sm text-gray-300">
          <span>Convert file to other format</span>
          <button 
            onClick={onDelete}
            className="ml-2 text-xs text-gray-500 hover:text-gray-400"
          >
            Delete this action
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-grow">
          <div className="relative">
            <select
              value={conversionType}
              onChange={(e) => setConversionType(e.target.value)}
              className="appearance-none bg-gray-700 border border-gray-600 text-white py-2 px-4 pr-8 rounded w-full focus:outline-none focus:bg-gray-600"
            >
              <option value="separately">Convert files separately</option>
              <option value="all">Convert all files to same format</option>
              <option value="single">Combine all into single PDF file</option>
              <option value="pdf-separate">Create separate PDF files</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {conversionType !== 'single' && conversionType !== 'pdf-separate' && (
          <div className="w-32">
            <div className="relative">
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="appearance-none bg-gray-700 border border-gray-600 text-white py-2 px-4 pr-8 rounded w-full focus:outline-none focus:bg-gray-600"
              >
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="PNG">PNG</option>
                <option value="JPEG">JPEG</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConvertAction;

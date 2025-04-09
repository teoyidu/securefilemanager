// src/components/actions/CombineAction.tsx
import React, { useState } from 'react';
import { ActionType } from '../../types';

interface CombineActionProps {
  action: ActionType;
  onDelete: () => void;
}

const CombineAction: React.FC<CombineActionProps> = ({ action, onDelete }) => {
  const [combineType, setCombineType] = useState<string>('same-format');
  const [selectedFormat, setSelectedFormat] = useState<string>('XLS');
  const [outputName, setOutputName] = useState<string>('Project-Budget');

  return (
    <div className="mt-6">
      <div className="flex justify-between mb-2">
        <div className="flex items-center text-sm text-gray-300">
          <span>Combine files together</span>
          <button 
            onClick={onDelete}
            className="ml-2 text-xs text-gray-500 hover:text-gray-400"
          >
            Delete this action
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-3">
        <div className="flex-grow">
          <div className="relative">
            <select
              value={combineType}
              onChange={(e) => setCombineType(e.target.value)}
              className="appearance-none bg-gray-700 border border-gray-600 text-white py-2 px-4 pr-8 rounded w-full focus:outline-none focus:bg-gray-600"
            >
              <option value="same-format">Combine same format files</option>
              <option value="pdf">Create a single PDF file</option>
              <option value="merge-excel">Merge Excel workbooks</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="w-32">
          <div className="relative">
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="appearance-none bg-gray-700 border border-gray-600 text-white py-2 px-4 pr-8 rounded w-full focus:outline-none focus:bg-gray-600"
            >
              {combineType === 'same-format' && (
                <>
                  <option value="PDF">PDF</option>
                  <option value="XLS">XLS</option>
                  <option value="DOCX">DOCX</option>
                  <option value="JPEG">JPEG</option>
                </>
              )}
              {combineType === 'pdf' && (
                <option value="PDF">PDF</option>
              )}
              {combineType === 'merge-excel' && (
                <option value="XLS">XLS</option>
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {(combineType === 'pdf' || combineType === 'merge-excel') && (
        <div className="mt-2">
          <input
            type="text"
            value={outputName}
            onChange={(e) => setOutputName(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white py-2 px-4 rounded w-full focus:outline-none focus:border-indigo-500"
            placeholder={combineType === 'pdf' ? "Output PDF filename" : "Output Excel filename"}
          />
          <div className="text-xs text-gray-500 mt-1">
            Example: {combineType === 'pdf' ? `${outputName}.pdf` : `${outputName}.xls`}
          </div>
        </div>
      )}
    </div>
  );
};

export default CombineAction;

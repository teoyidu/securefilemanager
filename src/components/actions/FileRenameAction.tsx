// src/components/actions/FileRenameAction.tsx
import React, { useState } from 'react';
import { ActionType } from '../../types';

interface FileRenameActionProps {
  action: ActionType;
  onDelete: () => void;
}

const FileRenameAction: React.FC<FileRenameActionProps> = ({ action, onDelete }) => {
  const [renameOption, setRenameOption] = useState<string>('before');
  const [prefix, setPrefix] = useState<string>('Phase1Handoff - ');

  return (
      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <div className="flex items-center text-sm text-white">
            <span>File renaming</span>
            <button
                onClick={onDelete}
                className="ml-2 text-xs text-gray-400 hover:text-gray-300"
            >
              Delete this action
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex-grow">
            <div className="relative">
              <select
                  value={renameOption}
                  onChange={(e) => setRenameOption(e.target.value)}
                  className="appearance-none bg-[#2d2d2d] border border-[#3c3c3c] text-white py-2 px-4 pr-8 rounded w-full focus:outline-none focus:bg-[#3c3c3c]"
              >
                <option value="before">Add text before file names</option>
                <option value="after">Add text after file names</option>
                <option value="replace">Replace text in file names</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="bg-[#1e1e1e] border border-[#3c3c3c] text-white py-2 px-4 rounded w-full focus:outline-none focus:border-brand-500"
                placeholder={renameOption === 'before' ? "Prefix to add" : renameOption === 'after' ? "Suffix to add" : "Text to replace"}
            />
            <div className="text-xs text-gray-400 mt-1">
              Example: {renameOption === 'before' ? `${prefix}Proposal_Draft.docx` : renameOption === 'after' ? `Proposal_Draft${prefix}.docx` : `${prefix}.docx`}
            </div>
          </div>
        </div>
      </div>
  );
};

export default FileRenameAction;
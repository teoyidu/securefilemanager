// src/components/actions/FileRenameAction.tsx
import React, { useState } from 'react';
import { ActionType } from '../../types';
import StyledDropdown from '../StyledDropdown';

interface FileRenameActionProps {
  action: ActionType;
  onDelete: () => void;
}

const FileRenameAction: React.FC<FileRenameActionProps> = ({ action, onDelete }) => {
  const [renameOption, setRenameOption] = useState<string>('before');
  const [prefix, setPrefix] = useState<string>('Phase1Handoff - ');

  const renameOptions = [
    { value: 'before', label: 'Add text before file names' },
    { value: 'after', label: 'Add text after file names' },
    { value: 'replace', label: 'Replace text in file names' }
  ];

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
              <StyledDropdown
                  value={renameOption}
                  onChange={(e) => setRenameOption(e.target.value)}
                  options={renameOptions}
              />
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
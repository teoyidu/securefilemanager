// src/components/actions/CompressAction.tsx
import React, { useState } from 'react';
import { ActionType } from '../../types';

interface CompressActionProps {
  action: ActionType;
  onDelete: () => void;
}

const CompressAction: React.FC<CompressActionProps> = ({ action, onDelete }) => {
  const [zipName, setZipName] = useState<string>('Phase1Handoff - Delivery Files');

  return (
      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <div className="flex items-center text-sm text-white">
            <span>Compress files</span>
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
            <input
                type="text"
                value={zipName}
                onChange={(e) => setZipName(e.target.value)}
                className="bg-[#1e1e1e] border border-[#3c3c3c] text-white py-2 px-4 rounded w-full focus:outline-none focus:border-brand-500"
                placeholder="Name for ZIP file"
            />
          </div>

          <div className="w-16 text-center">
            <span className="text-gray-400">.zip</span>
          </div>
        </div>
      </div>
  );
};

export default CompressAction;
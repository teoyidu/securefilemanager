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
        <div className="flex items-center text-sm text-gray-300">
          <span>Compress files</span>
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
          <input
            type="text"
            value={zipName}
            onChange={(e) => setZipName(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-white py-2 px-4 rounded w-full focus:outline-none focus:border-indigo-500"
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

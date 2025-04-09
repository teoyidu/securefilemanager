// src/components/actions/ReduceSizeAction.tsx
import React, { useState } from 'react';
import { ActionType } from '../../types';

interface ReduceSizeActionProps {
  action: ActionType;
  onDelete: () => void;
}

const ReduceSizeAction: React.FC<ReduceSizeActionProps> = ({ action, onDelete }) => {
  const [sizeOption, setSizeOption] = useState<string>('max');
  const [quality, setQuality] = useState<string>('less');

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
            <div className="relative">
              <select
                  value={sizeOption}
                  onChange={(e) => setSizeOption(e.target.value)}
                  className="appearance-none bg-[#2d2d2d] border border-[#3c3c3c] text-white py-2 px-4 pr-8 rounded w-full focus:outline-none focus:bg-[#3c3c3c]"
              >
                <option value="max">Maximum compression</option>
                <option value="email">Optimize file size for email</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {sizeOption === 'max' && (
              <div className="w-40">
                <div className="relative">
                  <select
                      value={quality}
                      onChange={(e) => setQuality(e.target.value)}
                      className="appearance-none bg-[#2d2d2d] border border-[#3c3c3c] text-white py-2 px-4 pr-8 rounded w-full focus:outline-none focus:bg-[#3c3c3c]"
                  >
                    <option value="less">less quality</option>
                    <option value="medium">medium quality</option>
                    <option value="high">high quality</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
          )}

          {sizeOption === 'email' && (
              <div className="w-40">
                <div className="relative">
                  <select
                      value="10MB"
                      className="appearance-none bg-[#2d2d2d] border border-[#3c3c3c] text-white py-2 px-4 pr-8 rounded w-full focus:outline-none focus:bg-[#3c3c3c]"
                  >
                    <option value="10MB">under 10MB</option>
                    <option value="5MB">under 5MB</option>
                    <option value="2MB">under 2MB</option>
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

        {sizeOption === 'email' && (
            <div className="text-xs text-gray-400 mt-2">
              Email optimization may result in your files being split into separate folders to fit within email attachment limits.
            </div>
        )}
      </div>
  );
};

export default ReduceSizeAction;
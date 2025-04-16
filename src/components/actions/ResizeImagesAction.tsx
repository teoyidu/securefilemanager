// src/components/actions/ResizeImagesAction.tsx
import React, { useState } from 'react';
import { ActionType } from '../../types';

interface ResizeImagesActionProps {
    action: ActionType;
    onDelete: () => void;
}

const ResizeImagesAction: React.FC<ResizeImagesActionProps> = ({ action, onDelete }) => {
    const [resizeOption, setResizeOption] = useState<string>('percentage');
    const [percentage, setPercentage] = useState<string>('50');
    const [width, setWidth] = useState<string>('800');
    const [height, setHeight] = useState<string>('600');
    const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
    const [outputFormat, setOutputFormat] = useState<string>('original');

    return (
        <div className="mt-6">
            <div className="flex justify-between mb-2">
                <div className="flex items-center text-sm text-white">
                    <span>Resize images</span>
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
                            value={resizeOption}
                            onChange={(e) => setResizeOption(e.target.value)}
                            className="appearance-none bg-[#2d2d2d] border border-[#3c3c3c] text-white py-2 px-4 pr-8 rounded w-full focus:outline-none focus:bg-[#3c3c3c]"
                        >
                            <option value="percentage">Scale by percentage</option>
                            <option value="dimensions">Set specific dimensions</option>
                            <option value="maxWidth">Set maximum width</option>
                            <option value="maxHeight">Set maximum height</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {resizeOption === 'percentage' && (
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={percentage}
                            onChange={(e) => setPercentage(e.target.value)}
                            className="bg-[#1e1e1e] border border-[#3c3c3c] text-white py-2 px-4 rounded w-20 focus:outline-none focus:border-brand-500"
                        />
                        <span className="text-gray-300">% of original size</span>
                    </div>
                )}

                {resizeOption === 'dimensions' && (
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-300 w-16">Width:</span>
                            <input
                                type="number"
                                min="1"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                className="bg-[#1e1e1e] border border-[#3c3c3c] text-white py-2 px-4 rounded w-24 focus:outline-none focus:border-brand-500"
                            />
                            <span className="text-gray-300">px</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-300 w-16">Height:</span>
                            <input
                                type="number"
                                min="1"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="bg-[#1e1e1e] border border-[#3c3c3c] text-white py-2 px-4 rounded w-24 focus:outline-none focus:border-brand-500"
                            />
                            <span className="text-gray-300">px</span>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="aspectRatio"
                                checked={maintainAspectRatio}
                                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="aspectRatio" className="text-gray-300">Maintain aspect ratio</label>
                        </div>
                    </div>
                )}

                {(resizeOption === 'maxWidth' || resizeOption === 'maxHeight') && (
                    <div className="flex items-center space-x-2">
            <span className="text-gray-300 w-32">
              {resizeOption === 'maxWidth' ? 'Maximum width:' : 'Maximum height:'}
            </span>
                        <input
                            type="number"
                            min="1"
                            value={resizeOption === 'maxWidth' ? width : height}
                            onChange={(e) => resizeOption === 'maxWidth' ? setWidth(e.target.value) : setHeight(e.target.value)}
                            className="bg-[#1e1e1e] border border-[#3c3c3c] text-white py-2 px-4 rounded w-24 focus:outline-none focus:border-brand-500"
                        />
                        <span className="text-gray-300">px</span>
                    </div>
                )}

                <div className="flex-grow">
                    <div className="relative">
                        <select
                            value={outputFormat}
                            onChange={(e) => setOutputFormat(e.target.value)}
                            className="appearance-none bg-[#2d2d2d] border border-[#3c3c3c] text-white py-2 px-4 pr-8 rounded w-full focus:outline-none focus:bg-[#3c3c3c]"
                        >
                            <option value="original">Keep original format</option>
                            <option value="jpg">Convert to JPG</option>
                            <option value="png">Convert to PNG</option>
                            <option value="webp">Convert to WebP</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResizeImagesAction;
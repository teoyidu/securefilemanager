// src/components/actions/ResizeImagesAction.tsx
import React, { useState, useEffect } from 'react';
import { ActionType } from '../../types';
import FormInput from '../FormInput';
import { validateNumber } from '../../utils/validation';
import { useActions } from '../../context';

interface ResizeImagesActionProps {
    action: ActionType;
    onDelete: () => void;
}

const ResizeImagesAction: React.FC<ResizeImagesActionProps> = ({ action, onDelete }) => {
    const { updateAction } = useActions();
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialize state from action options or defaults
    const [resizeOption, setResizeOption] = useState<string>(
        action.options?.resizeOption || 'percentage'
    );
    const [percentage, setPercentage] = useState<string>(
        action.options?.percentage || '50'
    );
    const [width, setWidth] = useState<string>(
        action.options?.width || '800'
    );
    const [height, setHeight] = useState<string>(
        action.options?.height || '600'
    );
    const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(
        action.options?.maintainAspectRatio !== 'false'
    );
    const [outputFormat, setOutputFormat] = useState<string>(
        action.options?.outputFormat || 'original'
    );

    // Update action options when form values change
    useEffect(() => {
        updateAction(action.id, {
            resizeOption,
            percentage,
            width,
            height,
            maintainAspectRatio: maintainAspectRatio.toString(),
            outputFormat
        });
    }, [resizeOption, percentage, width, height, maintainAspectRatio, outputFormat]);

    // Validate percentage input
    const validatePercentage = (value: string) => {
        return validateNumber(value, 'Percentage', 1, 100);
    };

    // Validate width/height inputs
    const validateDimension = (value: string, fieldName: string) => {
        return validateNumber(value, fieldName, 1);
    };

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
                <FormInput
                    type="select"
                    id={`resize-option-${action.id}`}
                    name="resizeOption"
                    value={resizeOption}
                    onChange={(e) => setResizeOption(e.target.value)}
                    label="Resize method"
                    options={[
                        { value: 'percentage', label: 'Scale by percentage' },
                        { value: 'dimensions', label: 'Set specific dimensions' },
                        { value: 'maxWidth', label: 'Set maximum width' },
                        { value: 'maxHeight', label: 'Set maximum height' }
                    ]}
                />

                {resizeOption === 'percentage' && (
                    <div className="flex items-center space-x-2">
                        <FormInput
                            type="number"
                            id={`percentage-${action.id}`}
                            name="percentage"
                            value={percentage}
                            onChange={(e) => setPercentage(e.target.value)}
                            validateFn={validatePercentage}
                            min={1}
                            max={100}
                            required
                            className="w-24"
                        />
                        <span className="text-gray-300">% of original size</span>
                    </div>
                )}

                {resizeOption === 'dimensions' && (
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-300 w-16">Width:</span>
                            <FormInput
                                type="number"
                                id={`width-${action.id}`}
                                name="width"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                validateFn={(val) => validateDimension(val, 'Width')}
                                min={1}
                                required
                                className="w-24"
                            />
                            <span className="text-gray-300">px</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-300 w-16">Height:</span>
                            <FormInput
                                type="number"
                                id={`height-${action.id}`}
                                name="height"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                validateFn={(val) => validateDimension(val, 'Height')}
                                min={1}
                                required
                                className="w-24"
                            />
                            <span className="text-gray-300">px</span>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id={`aspect-ratio-${action.id}`}
                                checked={maintainAspectRatio}
                                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor={`aspect-ratio-${action.id}`} className="text-gray-300">
                                Maintain aspect ratio
                            </label>
                        </div>
                    </div>
                )}

                {(resizeOption === 'maxWidth' || resizeOption === 'maxHeight') && (
                    <div className="flex items-center space-x-2">
            <span className="text-gray-300 w-32">
              {resizeOption === 'maxWidth' ? 'Maximum width:' : 'Maximum height:'}
            </span>
                        <FormInput
                            type="number"
                            id={`${resizeOption === 'maxWidth' ? 'max-width' : 'max-height'}-${action.id}`}
                            name={resizeOption === 'maxWidth' ? 'width' : 'height'}
                            value={resizeOption === 'maxWidth' ? width : height}
                            onChange={(e) => resizeOption === 'maxWidth' ? setWidth(e.target.value) : setHeight(e.target.value)}
                            validateFn={(val) => validateDimension(val, resizeOption === 'maxWidth' ? 'Maximum width' : 'Maximum height')}
                            min={1}
                            required
                            className="w-24"
                        />
                        <span className="text-gray-300">px</span>
                    </div>
                )}

                <FormInput
                    type="select"
                    id={`output-format-${action.id}`}
                    name="outputFormat"
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    label="Output format"
                    options={[
                        { value: 'original', label: 'Keep original format' },
                        { value: 'jpg', label: 'Convert to JPG' },
                        { value: 'png', label: 'Convert to PNG' },
                        { value: 'webp', label: 'Convert to WebP' }
                    ]}
                />
            </div>
        </div>
    );
};

export default ResizeImagesAction;
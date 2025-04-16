// src/components/DraggableFileItem.tsx
import React, { useRef } from 'react';
import { FileType } from '../types';

interface DraggableFileItemProps {
    file: FileType;
    index: number;
    onDragStart: (index: number) => void;
    onDragEnter: (index: number) => void;
    onDragEnd: () => void;
    isDragging: boolean;
    className?: string;
    children: React.ReactNode;
}

const DraggableFileItem: React.FC<DraggableFileItemProps> = ({
                                                                 file,
                                                                 index,
                                                                 onDragStart,
                                                                 onDragEnter,
                                                                 onDragEnd,
                                                                 isDragging,
                                                                 className = '',
                                                                 children
                                                             }) => {
    const itemRef = useRef<HTMLDivElement>(null);

    // Handle drag start
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        // Set data transfer for drag operation
        e.dataTransfer.setData('text/plain', index.toString());
        e.dataTransfer.effectAllowed = 'move';

        // Set a timeout to add dragging class for visual feedback
        setTimeout(() => {
            if (itemRef.current) {
                itemRef.current.classList.add('opacity-50');
            }
        }, 0);

        onDragStart(index);
    };

    // Handle drag end
    const handleDragEnd = () => {
        if (itemRef.current) {
            itemRef.current.classList.remove('opacity-50');
        }
        onDragEnd();
    };

    // Handle drag enter
    const handleDragEnter = () => {
        onDragEnter(index);
    };

    // Handle drag over
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    return (
        <div
            ref={itemRef}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            className={`relative ${className} ${
                isDragging ? 'border-2 border-dashed border-indigo-400 bg-indigo-900 bg-opacity-10' : ''
            } transition-all duration-200`}
        >
            <div className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center bg-gray-800 bg-opacity-30 cursor-move rounded-l-md">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
            </div>

            {/* Content with padding for the drag handle */}
            <div className="pl-6">
                {children}
            </div>
        </div>
    );
};

export default DraggableFileItem;
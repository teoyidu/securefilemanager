// src/components/DraggableActionItem.tsx
import React, { useRef } from 'react';
import { ActionType } from '../types';

interface DraggableActionItemProps {
    action: ActionType;
    index: number;
    onDelete: () => void;
    onDragStart: (index: number) => void;
    onDragEnter: (index: number) => void;
    onDragEnd: () => void;
    isDragging: boolean;
    className?: string;
    children: React.ReactNode;
}

const DraggableActionItem: React.FC<DraggableActionItemProps> = ({
                                                                     action,
                                                                     index,
                                                                     onDelete,
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
            } transition-all duration-200 rounded-md`}
        >
            {/* Drag handle */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-move">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
            </div>

            {/* Content wrapper with padding for the drag handle */}
            <div className="pl-8 pr-2">
                {children}
            </div>
        </div>
    );
};

export default DraggableActionItem;
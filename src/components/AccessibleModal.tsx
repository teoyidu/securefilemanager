// src/components/AccessibleModal.tsx
import React, { useRef, useEffect } from 'react';
import { useFocusTrap, useEscapeKey } from '../utils/accessibility';
import { useTheme } from '../context';

interface AccessibleModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    closeOnOutsideClick?: boolean;
}

const AccessibleModal: React.FC<AccessibleModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             title,
                                                             children,
                                                             actions,
                                                             size = 'md',
                                                             closeOnOutsideClick = true,
                                                         }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    // Trap focus within modal
    useFocusTrap(modalRef, isOpen);

    // Handle escape key press
    useEscapeKey(onClose, isOpen);

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close when clicking outside if enabled
    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnOutsideClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    // Width class based on size
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
                aria-hidden="true"
            ></div>

            {/* Modal container */}
            <div
                className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0"
                onClick={handleOutsideClick}
            >
                {/* Modal content */}
                <div
                    ref={modalRef}
                    className={`${sizeClasses[size]} w-full transform overflow-hidden rounded-lg bg-[#1e1e1e] text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle`}
                >
                    {/* Header */}
                    <div className="border-b border-gray-700 px-4 py-3 sm:px-6">
                        <div className="flex items-center justify-between">
                            <h3
                                id="modal-title"
                                className="text-lg font-medium leading-6 text-white"
                            >
                                {title}
                            </h3>
                            <button
                                type="button"
                                className="rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-4 py-4 sm:px-6">
                        {children}
                    </div>

                    {/* Footer with actions */}
                    {actions && (
                        <div className="border-t border-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccessibleModal;
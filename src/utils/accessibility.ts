// src/utils/accessibility.ts
import { RefObject, useEffect, useRef } from 'react';

// Key codes for keyboard navigation
export enum KeyCode {
    TAB = 9,
    ENTER = 13,
    ESCAPE = 27,
    SPACE = 32,
    PAGE_UP = 33,
    PAGE_DOWN = 34,
    END = 35,
    HOME = 36,
    LEFT_ARROW = 37,
    UP_ARROW = 38,
    RIGHT_ARROW = 39,
    DOWN_ARROW = 40
}

// Trap focus within a container (for modals, dialogs, etc.)
export const useFocusTrap = (containerRef: RefObject<HTMLElement>, isActive: boolean = true) => {
    useEffect(() => {
        if (!isActive || !containerRef.current) {
            return;
        }

        const container = containerRef.current;

        // Get all focusable elements
        const getFocusableElements = () => {
            return Array.from(
                container.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                )
            ).filter(el => !el.hasAttribute('disabled'));
        };

        // Handle tab key to trap focus
        const handleTabKey = (e: KeyboardEvent) => {
            if (e.keyCode !== KeyCode.TAB) return;

            const focusableElements = getFocusableElements();
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            // Shift + Tab
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            }
            // Tab
            else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        // Focus the first focusable element initially
        const setInitialFocus = () => {
            const focusableElements = getFocusableElements();
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        };

        // Add event listener
        document.addEventListener('keydown', handleTabKey);

        // Set initial focus after a short delay to ensure DOM is ready
        setTimeout(setInitialFocus, 50);

        // Remember previously focused element
        const previouslyFocused = document.activeElement as HTMLElement;

        return () => {
            document.removeEventListener('keydown', handleTabKey);

            // Restore focus to previously focused element when trap is removed
            if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
                previouslyFocused.focus();
            }
        };
    }, [containerRef, isActive]);
};

// Hook to detect clicks outside of a component
export const useOutsideClick = (
    ref: RefObject<HTMLElement>,
    callback: () => void,
    isActive: boolean = true
) => {
    const handleClick = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            callback();
        }
    };

    useEffect(() => {
        if (!isActive) return;

        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [ref, callback, isActive]);
};

// Hook to handle escape key press
export const useEscapeKey = (callback: () => void, isActive: boolean = true) => {
    useEffect(() => {
        if (!isActive) return;

        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                callback();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [callback, isActive]);
};

// Announce message to screen readers
export const useAnnounce = () => {
    const announcerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Create announcer element if it doesn't exist
        if (!announcerRef.current) {
            const announcer = document.createElement('div');
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.setAttribute('class', 'sr-only'); // screen reader only
            document.body.appendChild(announcer);
            announcerRef.current = announcer;
        }

        return () => {
            // Clean up on unmount
            if (announcerRef.current) {
                document.body.removeChild(announcerRef.current);
            }
        };
    }, []);

    // Function to announce message
    const announce = (message: string) => {
        if (announcerRef.current) {
            announcerRef.current.textContent = '';
            // Use setTimeout to ensure screen readers register the change
            setTimeout(() => {
                if (announcerRef.current) {
                    announcerRef.current.textContent = message;
                }
            }, 50);
        }
    };

    return announce;
};
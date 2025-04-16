// src/components/SkipLink.tsx
import React from 'react';

interface SkipLinkProps {
    targetId: string;
    label?: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({
                                               targetId,
                                               label = 'Skip to main content'
                                           }) => {
    // Handle click - focus the target element
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            // Set tabIndex if not focusable
            if (!targetElement.hasAttribute('tabindex')) {
                targetElement.setAttribute('tabindex', '-1');
            }

            // Focus the element
            targetElement.focus();

            // Scroll to element
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <a
            href={`#${targetId}`}
            onClick={handleClick}
            className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-indigo-600 focus:text-white"
        >
            {label}
        </a>
    );
};

export default SkipLink;
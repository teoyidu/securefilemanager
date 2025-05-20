// src/components/ResponsiveLayout.tsx
import React, { useState, useEffect } from 'react';

interface ResponsiveLayoutProps {
    children: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        // Function to check screen size
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768); // 768px is typical tablet breakpoint
        };

        // Initial check
        checkIfMobile();

        // Add event listener
        window.addEventListener('resize', checkIfMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    return (
        <div className={`min-h-screen bg-main-dark text-white ${
            isMobile
                ? 'px-4 py-4' // Mobile padding
                : 'px-4 md:px-12 lg:px-app-x py-4 md:py-app-y' // Desktop padding
        }`}>
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </div>
    );
};

export default ResponsiveLayout;
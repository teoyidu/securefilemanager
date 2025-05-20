// src/components/Header.tsx
import React from 'react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context';

interface HeaderProps {
    onLoadActionSets: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoadActionSets }) => {
    const { theme } = useTheme();

    return (
        <header className="mb-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <h1 className="text-2xl font-semibold mr-4">Secure File Manager</h1>
                    <ThemeToggle />
                </div>

                <div className="hidden md:flex space-x-4">
                    <button
                        onClick={onLoadActionSets}
                        className="px-4 py-2 rounded-md text-sm border border-indigo-500 text-indigo-400 hover:bg-indigo-900 hover:bg-opacity-20 transition-colors"
                    >
                        Load saved actions
                    </button>
                    <a
                        href="#"
                        className="px-4 py-2 rounded-md text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                        Documentation
                    </a>
                </div>
            </div>

            <p className="text-center text-sm mb-6">
                Our tool runs entirely on your device, keeping all actions local and your files private.
                <br className="hidden md:block" />
                With no uploads or external servers, <span className="font-semibold">your data stays fully secure.</span>
            </p>

            {/* Mobile buttons */}
            <div className="flex md:hidden space-x-2 justify-center mb-4">
                <button
                    onClick={onLoadActionSets}
                    className="px-3 py-1.5 rounded-md text-xs border border-indigo-500 text-indigo-400 hover:bg-indigo-900 hover:bg-opacity-20 transition-colors"
                >
                    Load saved actions
                </button>
                <a
                    href="#"
                    className="px-3 py-1.5 rounded-md text-xs text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                    Documentation
                </a>
            </div>
        </header>
    );
};

export default Header;
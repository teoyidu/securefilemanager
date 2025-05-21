// src/components/Header.tsx
import React from 'react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context';
import styles from './Header.module.css';

interface HeaderProps {
    onLoadActionSets: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoadActionSets }) => {
    const { theme } = useTheme();

    return (
        <header className={styles.header}>
            <div className={styles.headerTop}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h1 className={styles.title}>Secure File Manager</h1>
                    <ThemeToggle />
                </div>
                <div className={styles.buttonGroup}>
                    <button
                        onClick={onLoadActionSets}
                        className={styles.button}
                    >
                        Load saved actions
                    </button>
                    <a
                        href="#"
                        className={styles.primaryButton + ' ' + styles.button}
                    >
                        Documentation
                    </a>
                </div>
            </div>
            <p className={styles.subtitle}>
                Our tool runs entirely on your device, keeping all actions local and your files private.<br />
                With no uploads or external servers, <span className={styles.subtitleStrong}>your data stays fully secure.</span>
            </p>
        </header>
    );
};

export default Header;
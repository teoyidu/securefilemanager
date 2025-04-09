// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="mt-8 px-4 py-6 border-t border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-400 text-sm">
            © 2025 Secure File Manager - All rights reserved
          </p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Help Center
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;

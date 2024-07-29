import Link from 'next/link';
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 shadow-md p-4 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-semibold text-white tracking-tight hover:bg-blue-500 transition-colors duration-300 px-4 py-2 rounded-lg shadow-md" style={{ textTransform: 'none' }}>
          Risk Profile Questionnaire
        </Link>
      
          <Link href="/upload" className="text-2xl font-semibold text-white tracking-tight hover:bg-blue-500 transition-colors duration-300 px-4 py-2 rounded-lg shadow-md" style={{ textTransform: 'none' }}>
            Fais Letter
          </Link>
        
      </div>
    </nav>
  );
};

export default Navbar;

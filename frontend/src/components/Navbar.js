import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-[#DB7093]">
                XO GAME
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link
              to="/history"
              className="text-gray-800 hover:text-[#DB7093] px-3 py-2 rounded-md text-sm font-medium"
            >
              Game History
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 
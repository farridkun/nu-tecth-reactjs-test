import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white">
      <div>
        <Link to="/" className="text-xl font-bold">
          Nutech Test Farrid
        </Link>
      </div>
      <div>
        {user && (
          <div className="flex items-center">
            <span className="mr-2">Halo, {user}</span>
            <button
              onClick={onLogout}
              className="px-3 py-2 text-sm font-medium text-white bg-orange-400 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

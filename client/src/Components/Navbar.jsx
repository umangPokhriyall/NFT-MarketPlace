import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="bg-gray-800 p-4">
      <nav className="flex justify-center">
        <ul className="flex space-x-8">
          <li>
            <Link to="/" className="text-white hover:text-gray-400">Create</Link>
          </li>
          <li>
            <Link to="/list" className="text-white hover:text-gray-400">List</Link>
          </li>
          <li>
            <Link to="/buy" className="text-white hover:text-gray-400">Buy</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;

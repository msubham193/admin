import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>
      <ul className="mt-6">
        <li>
          <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-700">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/add-user" className="block px-4 py-2 hover:bg-gray-700">
            Add User
          </Link>
        </li>
        <li>
          <Link
            to="/user-management"
            className="block px-4 py-2 hover:bg-gray-700"
          >
            User Management
          </Link>
        </li>
        <li>
          <Link
            to="/document-creation"
            className="block px-4 py-2 hover:bg-gray-700"
          >
            Create Document
          </Link>
        </li>
        <li>
          <Link to="/user-portal" className="block px-4 py-2 hover:bg-gray-700">
            User Portal
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

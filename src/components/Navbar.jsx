import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Renders a professional and responsive navigation bar for the application.
 * Highlights the currently active page for enhanced user experience.
 */
export default function Navbar() {
  const location = useLocation();

  const navTabs = [
    { id: 'dashboard', name: 'Dashboard', path: '/' },
    { id: 'duplicates', name: 'Duplicate Scanner', path: '/duplicates' },
    { id: 'categorize', name: 'File Categorizer', path: '/categorize' },
    { id: 'rules', name: 'Rule Management', path: '/rules' },
    { id: 'config', name: 'Configuration', path: '/config' },
    { id: 'logs', name: 'Logs', path: '/logs' }
  ];

  return (
    <nav className="bg-indigo-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand/Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold tracking-tight">
              FileClean Pro
            </span>
          </div>
          
          {/* Navigation Links Section */}
          <div className="hidden md:flex space-x-2">
            {navTabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-800
                  ${
                    location.pathname === tab.path
                      ? 'bg-white text-indigo-800 shadow-md'
                      : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                  }
                `}
                aria-current={location.pathname === tab.path ? 'page' : undefined}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Navbar.propTypes = {
//   // You can add prop types validation if this component receives any props
// };
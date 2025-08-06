import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  FolderOpen,
  Settings,
  FileText,
  ClipboardList,
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navTabs = [
    { id: 'dashboard', name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
    {
      id: 'duplicates',
      name: 'Duplicate Scanner',
      path: '/duplicates',
      icon: <Search size={18} />,
    },
    {
      id: 'categorize',
      name: 'File Categorizer',
      path: '/categorize',
      icon: <FolderOpen size={18} />,
    },
    {
      id: 'logs',
      name: 'Logs',
      path: '/logs',
      icon: <FileText size={18} />,
    },
  ];
  
  const isActiveTab = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-indigo-900 text-white shadow-md">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / App Name */}
          {/* <div  className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-wide">🧹 FileClean Pro</span>
          </div> */}
            <Link to="/" className="text-2xl font-bold tracking-wide">
                🧹 FileClean Pro
            </Link>

          {/* Navigation */}
          <div className="hidden md:flex space-x-2">
            {navTabs.map((tab) => {
              const isActive = isActiveTab(tab.path);

              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                    transition duration-150
                    ${
                      isActive
                        ? 'bg-white text-indigo-900 shadow-md'
                        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                    }
                  `}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

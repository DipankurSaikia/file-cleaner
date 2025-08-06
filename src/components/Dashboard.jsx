import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Settings, ScanLine, Layers, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [directoryPath, setDirectoryPath] = useState('');
  const [recursive] = useState(true);

  const [operation, setOperation] = useState('NONE');

  const handleScan = () => {
    if (operation === 'NONE' || !directoryPath) return;

    if (operation === 'DELETE_DUPLICATES') {
      navigate('/duplicates', { state: { directoryPath, recursive } });
    } else if (operation === 'CATEGORIZE_FILES') {
      navigate('/categorize', { state: { directoryPath, recursive } });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto mt-8">
      <div className="flex items-center mb-6 space-x-3">
        <ScanLine className="text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-800">Quick Start</h2>
      </div>

      <div className="space-y-6">
        {/* Directory Input */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Folder className="w-4 h-4 mr-2" />
            Directory Path
          </label>
          <input
            type="text"
            value={directoryPath}
            onChange={(e) => setDirectoryPath(e.target.value)}
            placeholder="Enter full directory path"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Recursive Checkbox */}
        {/* <div className="flex items-center">
          <input
            type="checkbox"
            id="recursive"
            checked={recursive}
            onChange={(e) => setRecursive(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="recursive" className="ml-2 text-sm text-gray-700">
            Scan subdirectories
          </label>
        </div> */}

        {/* Operation Dropdown */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Settings className="w-4 h-4 mr-2" />
            Operation
          </label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="NONE">Select operation</option>
            <option value="DELETE_DUPLICATES">🗑️ Find Duplicates</option>
            <option value="CATEGORIZE_FILES">🗂️ Categorize Files</option>
          </select>
        </div>

        {/* Start Scan Button */}
        <button
          onClick={handleScan}
          disabled={!directoryPath || operation === 'NONE'}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-white text-sm font-medium transition 
            ${!directoryPath || operation === 'NONE'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {operation === 'DELETE_DUPLICATES' && <Trash2 className="w-4 h-4" />}
          {operation === 'CATEGORIZE_FILES' && <Layers className="w-4 h-4" />}
          <span>Start Scan</span>
        </button>
      </div>
    </div>
  );
}

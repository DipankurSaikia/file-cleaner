import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [directoryPath, setDirectoryPath] = useState('');
  const [recursive, setRecursive] = useState(false);
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Directory Path</label>
          <input
            type="text"
            value={directoryPath}
            onChange={(e) => setDirectoryPath(e.target.value)}
            placeholder="Enter directory path"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="recursive"
            checked={recursive}
            onChange={(e) => setRecursive(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="recursive" className="ml-2 block text-sm text-gray-700">
            Scan subdirectories
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="NONE">Select operation</option>
            <option value="DELETE_DUPLICATES">Find Duplicates</option>
            <option value="CATEGORIZE_FILES">Categorize Files</option>
          </select>
        </div>
        
        <button
          onClick={handleScan}
          disabled={!directoryPath || operation === 'NONE'}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          Start Scan
        </button>
      </div>
    </div>
  );
}
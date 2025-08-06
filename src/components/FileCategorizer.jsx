import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';

export default function FileCategorizer() {
  const location = useLocation();
  const [directoryPath, setDirectoryPath] = useState(location.state?.directoryPath || '');
  const [recursive, setRecursive] = useState(location.state?.recursive || false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categorizeFiles = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await api.scanDirectory({
        directoryPath,
        recursive,
        operation: 'CATEGORIZE_FILES'
      });
      const categorizedResponse = await api.getCategorizedFiles(directoryPath, recursive);
      setCategories(categorizedResponse.data);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error categorizing files: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">File Categorizer</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Directory Path</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={directoryPath}
              onChange={(e) => setDirectoryPath(e.target.value)}
              placeholder="Enter directory path"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={categorizeFiles}
              disabled={!directoryPath || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Categorize Files'}
            </button>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="recursive-categorize"
            checked={recursive}
            onChange={(e) => setRecursive(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="recursive-categorize" className="ml-2 block text-sm text-gray-700">
            Scan subdirectories
          </label>
        </div>
      </div>

      {message && (
        <div className={`p-3 mb-4 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message}
        </div>
      )}

      {categories.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Categorized Files</h3>
          
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.name} className="border border-gray-200 rounded-md p-4">
                <h4 className="font-medium mb-2">{category.name}</h4>
                <div className="space-y-2">
                  {category.files.map((file) => (
                    <div key={file.path} className="p-2 hover:bg-gray-50">
                      <p className="text-sm font-medium">{file.path}</p>
                      <p className="text-xs text-gray-500">
                        {file.size} bytes • {file.lastModified}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
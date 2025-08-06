import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';

export default function FileCategorizer() {
  const location = useLocation();
  const [directoryPath, setDirectoryPath] = useState(location.state?.directoryPath || '');
  const [recursive, setRecursive] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categorizeFiles = async () => {
    if (!directoryPath) return;
    setLoading(true);
    setMessage('');
    try {
      await api.scanDirectory({
        directoryPath,
        recursive,
        operation: 'CATEGORIZE_FILES',
      });
      const categorizedResponse = await api.getCategorizedFiles(directoryPath, recursive);
      setCategories(categorizedResponse.data);
      setMessage('Files categorized successfully.');
    } catch (error) {
      setMessage('Error categorizing files: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Automatically categorize files when redirected
  useEffect(() => {
    if (directoryPath) {
      categorizeFiles();
    }
  }, [directoryPath]);

  const formatSize = (bytes) => {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📁 File Categorizer</h2>

      <div className="space-y-5 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Directory Path</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={directoryPath}
              onChange={(e) => setDirectoryPath(e.target.value)}
              placeholder="Enter directory path"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={categorizeFiles}
              disabled={!directoryPath || loading}
              className={`px-5 py-2 text-white rounded-md font-medium transition ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Processing...' : 'Categorize Files'}
            </button>
          </div>
        </div>

       


      </div>

      {message && (
        <div
          className={`p-3 mb-6 rounded-md font-medium ${
            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && categories.length > 0 && (
        <div className="mt-6 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">📦 Categorized Files</h3>

          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <h4 className="font-semibold text-gray-700 mb-2">
                🗂️ {category.name} ({category.files.length})
              </h4>
              <div className="space-y-2">
                {category.files.map((file, fileIndex) => (
                  <motion.div
                    key={file.path}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: fileIndex * 0.02 }}
                    className="px-3 py-2 bg-white rounded shadow-sm hover:bg-gray-100"
                  >
                    <p className="text-sm font-medium text-gray-800">{file.path}</p>
                    <p className="text-xs text-gray-500">
                      {formatSize(file.size)} • {file.lastModified}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

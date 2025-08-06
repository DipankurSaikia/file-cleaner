import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import RuleManager from './RuleManager';

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

  useEffect(() => {
    if (directoryPath) {
      categorizeFiles();
    }
  }, [directoryPath]);

  const formatSize = (bytes) => {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-8 max-w-screen-xl mx-auto">
      {/* File Categorizer Panel */}
      <div className="flex-1 bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">📁 File Categorizer</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Directory Path</label>
          <input
            type="text"
            value={directoryPath}
            onChange={(e) => setDirectoryPath(e.target.value)}
            placeholder="Enter directory path"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* <div className="mb-4 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Recursive</label>
          <input
            type="checkbox"
            checked={recursive}
            onChange={(e) => setRecursive(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div> */}

        <button
          onClick={categorizeFiles}
          disabled={!directoryPath || loading}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Categorizing...' : 'Categorize Files'}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded font-medium ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        {loading && (
          <div className="mt-6 flex justify-center items-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full"></div>
          </div>
        )}

        {!loading && categories.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">📦 Categorized Files</h3>
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
                <div className="space-y-1">
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

      {/* Rule Manager Panel */}
      <div className=" w-[45%]  ">
        <RuleManager />
      </div>
    </div>
  );
}

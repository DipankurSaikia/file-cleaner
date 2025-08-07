import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import RuleManager from './RuleManager';

export default function FileCategorizer() {
  const location = useLocation();
  const [directoryPath, setDirectoryPath] = useState(location.state?.directoryPath || '');
  const [recursive, setRecursive] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showRuleManager, setShowRuleManager] = useState(false);

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
    <div className="p-8 px-32  max-w-screen-xl mx-auto">
      {/* Main Content - File Categorizer */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm shadow rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">📁 File Categorizer</h2>
          <button
            onClick={() => setShowRuleManager(true)}
            className="cursor-pointer px-4 py-2 bg-purple-600/90 hover:bg-purple-700/90 text-white rounded-md transition-all shadow-md hover:shadow-lg"
          >
            🛠️ Manage Rules
          </button>
        </div>

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

        <button
          onClick={categorizeFiles}
          disabled={!directoryPath || loading}
          className={` cursor-pointer w-full py-2 px-4 rounded-md text-white font-semibold ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Categorizing...' : 'Categorize Files'}
        </button>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3 rounded font-medium ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {message}
          </motion.div>
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
      </motion.div>

      {/* Rule Manager Modal */}
      <AnimatePresence>
        {showRuleManager && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setShowRuleManager(false)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20">
                <RuleManager onClose={() => setShowRuleManager(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';

export default function DuplicateScanner() {
  const location = useLocation();
  const [directoryPath, setDirectoryPath] = useState(location.state?.directoryPath || '');
  const [recursive, setRecursive] = useState(true);

  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (directoryPath) {
      findDuplicates();
    }
  }, [directoryPath]);

  const findDuplicates = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await api.findDuplicates(directoryPath, recursive);
      setDuplicateGroups(response.data);
      setMessage(`Found ${response.data.length} duplicate groups`);
    } catch (error) {
      setMessage('Error finding duplicates: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSelected = async () => {
    const request = {
      duplicateGroups: duplicateGroups.map(group => ({
        hash: group.hash,
        files: group.files
      }))
    };

    try {
      const response = await api.deleteDuplicates(request);
      setMessage(`Deleted ${response.data.deleted.length} files`);
      findDuplicates(); // Refresh
    } catch (error) {
      setMessage('Error deleting files: ' + error.message);
    }
  };

  const toggleFileSelection = (groupIndex, fileIndex) => {
    const updatedGroups = [...duplicateGroups];
    updatedGroups[groupIndex].files[fileIndex].selected =
      !updatedGroups[groupIndex].files[fileIndex].selected;
    setDuplicateGroups(updatedGroups);
  };

  const formatSize = (bytes) => {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🧠 Duplicate Scanner</h2>

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
              onClick={findDuplicates}
              disabled={!directoryPath || loading}
              className={`px-5 py-2 text-white rounded-md font-medium transition ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Scanning...' : 'Find Duplicates'}
            </button>
          </div>
        </div>

        {/* <div className="flex items-center">
          <input
            type="checkbox"
            id="recursive-scan"
            checked={recursive}
            onChange={(e) => setRecursive(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="recursive-scan" className="ml-2 text-sm text-gray-700">
            Scan subdirectories
          </label>
        </div> */}

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

      {duplicateGroups.length > 0 && (
        <div className="mt-6 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-gray-800">📂 Duplicate Files</h3>
            <button
              onClick={deleteSelected}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Selected
            </button>
          </div>

          {duplicateGroups.map((group, groupIndex) => (
            <motion.div
              key={group.hash}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <h4 className="font-semibold text-gray-700 mb-2">
                Group {groupIndex + 1}
              </h4>
              <div className="space-y-2">
                {group.files.map((file, fileIndex) => (
                  <motion.div
                    key={file.path}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: fileIndex * 0.05 }}
                    className="flex items-center justify-between px-3 py-2 bg-white rounded shadow-sm hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={file.selected || false}
                        onChange={() => toggleFileSelection(groupIndex, fileIndex)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{file.path}</p>
                        <p className="text-xs text-gray-500">
                          {formatSize(file.size)} • {file.lastModified}
                        </p>
                      </div>
                    </div>
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

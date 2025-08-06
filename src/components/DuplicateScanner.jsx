import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';

export default function DuplicateScanner() {
  const location = useLocation();
  const [directoryPath, setDirectoryPath] = useState(location.state?.directoryPath || '');
  const [recursive, setRecursive] = useState(location.state?.recursive || false);
  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
      findDuplicates(); // Refresh the list
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Duplicate Scanner</h2>
      
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
              onClick={findDuplicates}
              disabled={!directoryPath || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Scanning...' : 'Find Duplicates'}
            </button>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="recursive-scan"
            checked={recursive}
            onChange={(e) => setRecursive(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="recursive-scan" className="ml-2 block text-sm text-gray-700">
            Scan subdirectories
          </label>
        </div>
      </div>

      {message && (
        <div className={`p-3 mb-4 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message}
        </div>
      )}

      {duplicateGroups.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Duplicate Files</h3>
            <button
              onClick={deleteSelected}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Selected
            </button>
          </div>

          <div className="space-y-6">
            {duplicateGroups.map((group, groupIndex) => (
              <div key={group.hash} className="border border-gray-200 rounded-md p-4">
                <h4 className="font-medium mb-2">Duplicate Group {groupIndex + 1}</h4>
                <div className="space-y-2">
                  {group.files.map((file, fileIndex) => (
                    <div key={file.path} className="flex items-center justify-between p-2 hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={file.selected || false}
                          onChange={() => toggleFileSelection(groupIndex, fileIndex)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div>
                          <p className="text-sm font-medium">{file.path}</p>
                          <p className="text-xs text-gray-500">
                            {file.size} bytes • {file.lastModified}
                          </p>
                        </div>
                      </div>
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
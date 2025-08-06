import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function ConfigManager() {
  const [config, setConfig] = useState({ scanPaths: [], rules: [] });
  const [newScanPath, setNewScanPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await api.getConfig();
      setConfig(response.data);
    } catch (error) {
      setMessage('Error fetching configuration: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScanPath = () => {
    if (!newScanPath) return;
    setConfig({
      ...config,
      scanPaths: [...config.scanPaths, newScanPath]
    });
    setNewScanPath('');
  };

  const handleRemoveScanPath = (index) => {
    const updatedPaths = [...config.scanPaths];
    updatedPaths.splice(index, 1);
    setConfig({
      ...config,
      scanPaths: updatedPaths
    });
  };

  const handleSaveConfig = async () => {
    try {
      await api.updateConfig(config);
      setMessage('Configuration saved successfully');
    } catch (error) {
      setMessage('Error saving configuration: ' + error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Configuration</h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Scan Paths</h3>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newScanPath}
              onChange={(e) => setNewScanPath(e.target.value)}
              placeholder="Enter directory path"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleAddScanPath}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Path
            </button>
          </div>
          
          {config.scanPaths.length > 0 ? (
            <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
              {config.scanPaths.map((path, index) => (
                <li key={index} className="px-4 py-2 flex justify-between items-center">
                  <span className="text-sm">{path}</span>
                  <button
                    onClick={() => handleRemoveScanPath(index)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No scan paths configured</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Rules</h3>
          {config.rules.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Pattern</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {config.rules.map((rule, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rule.match}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rule.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No rules configured</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveConfig}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
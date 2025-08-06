import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function RuleManager() {
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({ match: '', category: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await api.getAllRules();
      setRules(response.data);
    } catch (error) {
      setMessage('Error fetching rules: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = async () => {
    if (!newRule.match || !newRule.category) {
      setMessage('Both match pattern and category are required');
      return;
    }

    try {
      await api.addOrUpdateRule(newRule);
      setNewRule({ match: '', category: '' });
      setMessage('Rule added successfully');
      fetchRules();
    } catch (error) {
      setMessage('Error adding rule: ' + error.message);
    }
  };

  const handleDeleteRule = async (match) => {
    try {
      await api.deleteRule(match);
      setMessage('Rule deleted successfully');
      fetchRules();
    } catch (error) {
      setMessage('Error deleting rule: ' + error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Categorization Rules</h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message}
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Match Pattern</label>
            <input
              type="text"
              value={newRule.match}
              onChange={(e) => setNewRule({ ...newRule, match: e.target.value })}
              placeholder="e.g. 'invoice'"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={newRule.category}
              onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
              placeholder="e.g. 'Finance'"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddRule}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Rule
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Current Rules</h3>
        
        {loading ? (
          <p>Loading rules...</p>
        ) : rules.length === 0 ? (
          <p className="text-gray-500">No rules defined yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Pattern</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rules.map((rule, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rule.match}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rule.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDeleteRule(rule.match)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
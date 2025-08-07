import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { motion } from 'framer-motion';

export default function RuleManager({ onClose }) {
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
      setMessage('❌ Error fetching rules: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = async () => {
    if (!newRule.match.trim() || !newRule.category.trim()) {
      setMessage('⚠️ Both match pattern and category are required.');
      return;
    }

    try {
      await api.addOrUpdateRule(newRule);
      setNewRule({ match: '', category: '' });
      setMessage('✅ Rule added successfully.');
      fetchRules();
    } catch (error) {
      setMessage('❌ Error adding rule: ' + error.message);
    }
  };

  const handleDeleteRule = async (match) => {
    try {
      await api.deleteRule(match);
      setMessage('✅ Rule deleted successfully.');
      fetchRules();
    } catch (error) {
      setMessage('❌ Error deleting rule: ' + error.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📜 Categorization Rules</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 mb-6 rounded-md text-sm font-medium ${
            message.includes('Error') || message.includes('⚠️')
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {message}
        </motion.div>
      )}

      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🔍 Match Pattern</label>
            <input
              type="text"
              value={newRule.match}
              onChange={(e) => setNewRule({ ...newRule, match: e.target.value })}
              placeholder="e.g., 'installer', 'setup'"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📁 Category</label>
            <input
              type="text"
              value={newRule.category}
              onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
              placeholder="e.g., 'Installers'"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddRule}
              className="cursor-pointer px-5 py-2.5 w-full bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              ➕ Add Rule
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📋 Current Rules</h3>

        {loading ? (
          <div className="text-gray-500 animate-pulse">Loading rules...</div>
        ) : rules.length === 0 ? (
          <p className="text-gray-500">No rules defined yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Match Pattern</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rules.map((rule, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 text-gray-800">{rule.match}</td>
                    <td className="px-6 py-4 text-gray-600">{rule.category}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteRule(rule.match)}
                        className="text-red-600 hover:text-red-800 transition font-medium"
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
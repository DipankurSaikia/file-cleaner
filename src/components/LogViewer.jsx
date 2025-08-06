import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function LogViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [filters, setFilters] = useState({ action: '', date: '' });
  const [message, setMessage] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.getLogs(filters.action, filters.date);
      setLogs(response.data);
      setMessage(`✅ Found ${response.data.length} logs`);
    } catch (error) {
      setMessage('❌ Error fetching logs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email.trim()) {
      setMessage('⚠️ Please enter an email.');
      return;
    }

    try {
      await api.sendEmail({ email, sendEmail: true });
      setMessage('✅ Logs sent to email successfully.');
    } catch (error) {
      setMessage('❌ Error sending email: ' + error.message);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">📊 System Logs</h2>

      {message && (
        <div
          className={`transition-all p-3 mb-6 rounded-md text-sm font-medium ${
            message.includes('❌') || message.includes('⚠️')
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🔧 Action Type</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="ALL">All Actions</option>
              <option value="DELETE">Deletions</option>
              <option value="MOVE">File Moves</option>
              <option value="INFO">Information</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📅 Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchLogs}
              className="w-full px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              🔄 Refresh Logs
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center space-x-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="📧 Enter email to send logs"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
          />
          <button
            onClick={handleSendEmail}
            disabled={!email}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:bg-gray-400"
          >
            📤 Send Logs
          </button>
        </div>
      </div>

      {loading ? (
        <p className="animate-pulse text-gray-500 text-sm">🔄 Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">No logs found for the selected filters.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.action === 'DELETE'
                          ? 'bg-red-100 text-red-800'
                          : log.action === 'MOVE'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

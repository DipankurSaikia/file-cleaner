import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const convertLogsToText = (logs) => {
  return logs.map(log => 
    `${new Date(log.timestamp).toISOString()} [${log.action}] ${log.details}`
  ).join('\n');
};

export default function LogViewer() {
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [filters, setFilters] = useState({ action: 'ALL', date: '' });
  const [message, setMessage] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const actionQuery = filters.action === 'ALL' ? '' : filters.action;
      const response = await api.getLogs(actionQuery, filters.date);
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
  
    setSending(true);
    setMessage('');
  
    try {
      await api.sendEmail({ email, sendEmail: true });
      setMessage('✅ Logs sent to email successfully.');
    } catch (error) {
      setMessage('❌ Error sending email: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  const handleDownloadLogs = () => {
    if (logs.length === 0) {
      setMessage('⚠️ No logs to download');
      return;
    }

    const logText = convertLogsToText(logs);
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${filters.date || new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setMessage('✅ Logs downloaded successfully');
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFilters((prev) => ({ ...prev, date: today }));
  }, []);

  useEffect(() => {
    if (filters.date) fetchLogs();
  }, [filters]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">📊 System Logs</h2>

      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`transition-all p-3 mb-6 rounded-md text-sm font-medium ${
              message.includes('❌') || message.includes('⚠️')
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

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
              className="cursor-pointer w-full px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
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
            disabled={!email || sending}
            className={`px-4 cursor-pointer py-2 bg-green-600 text-white rounded-md transition hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2`}
          >
            {sending ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                📤 Send Logs
              </>
            )}
          </button>

          <button
            onClick={handleDownloadLogs}
            disabled={logs.length === 0}
            className="p-2 text-gray-500 hover:text-indigo-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            title="Download logs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
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
              <AnimatePresence>
                {logs.map((log, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(log.timestamp).toString()}
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
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
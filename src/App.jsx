import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DuplicateScanner from './components/DuplicateScanner';
import FileCategorizer from './components/FileCategorizer';
import RuleManager from './components/RuleManager';
import ConfigManager from './components/ConfigManager';
import LogViewer from './components/LogViewer';
import LandingPage from './components/LandingPage';

function App() {
  // const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar  />
        
        <div className=" w-full   pb-40">
          <Routes>
          <Route path="/" element={<LandingPage />} />
<Route path="/dashboard" element={<Dashboard />} />

            {/* <Route path="/" element={<Dashboard />} /> */}
            <Route path="/duplicates" element={<DuplicateScanner />} />
            <Route path="/categorize" element={<FileCategorizer />} />
            <Route path="/rules" element={<RuleManager />} />
            <Route path="/config" element={<ConfigManager />} />
            <Route path="/logs" element={<LogViewer />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen  pb-4 bg-gradient-to-br from-indigo-800 via-indigo-900 to-black text-white overflow-hidden">
      {/* Hide scrollbar and prevent overflow */}
      <style>{`
        body {
          overflow: hidden;
        }
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Background Animation Circles */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 10 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror' }}
        className="absolute -top-64 -left-64 w-96 h-96 bg-indigo-400 opacity-10 rounded-full"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 8 }}
        transition={{ duration: 5, repeat: Infinity, repeatType: 'mirror' }}
        className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 opacity-10 rounded-full"
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Welcome to <span className="text-indigo-300">FileClean Pro</span>
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-xl mx-auto">
            Remove duplicate applications and categorize them intelligently using content-based detection and rule-based classification.
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="mt-10 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition text-white text-lg font-medium px-6 py-3 rounded-lg shadow-lg"
        >
          <Sparkles size={20} />
          Get Started
        </motion.button>
      </div>
    </div>
  );
}

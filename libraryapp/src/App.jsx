import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BooksManagement from './components/BooksManagement';
import MembersManagement from './components/MembersManagement';
import TransactionsManagement from './components/TransactionsManagement';
import { useMongoStore } from './store/mongoStore';

function App() {
  const initDatabase = useMongoStore(state => state.initDatabase);
  const isLoading = useMongoStore(state => state.isLoading);
  const error = useMongoStore(state => state.error);

  useEffect(() => {
    initDatabase();
  }, [initDatabase]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Connecting to MongoDB...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Connection Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="flex h-screen bg-gray-50 font-sans">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/books" element={<BooksManagement />} />
                <Route path="/members" element={<MembersManagement />} />
                <Route path="/transactions" element={<TransactionsManagement />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

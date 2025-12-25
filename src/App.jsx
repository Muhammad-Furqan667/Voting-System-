import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VotingProvider } from './context/VotingContext';
import LandingPage from './pages/LandingPage';
import VoterLogin from './pages/VoterLogin';
import VotingPage from './pages/VotingPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <VotingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/voter-login" element={<VoterLogin />} />
          <Route path="/vote" element={<VotingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </VotingProvider>
  );
}

export default App;

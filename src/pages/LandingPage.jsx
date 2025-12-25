import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, ShieldCheck, UserCheck } from 'lucide-react';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <div className="hero-card">
        
        {/* Logo / Icon Area */}
        <div className="logo-wrapper">
            <div className="logo-circle">
                <ShieldCheck size={48} color="white" />
            </div>
        </div>

        <h1 className="title">
          PAKISTAN VOTES
        </h1>
        <p className="subtitle">
          Secure • Transparent • National
        </p>

        <p className="description">
          Welcome to the official digital voting portal. Cast your vote securely using your CNIC. 
          Your voice matters in shaping the future of our nation.
        </p>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            onClick={() => navigate('/voter-login')}
            className="btn-voter"
          >
            <Fingerprint size={24} />
            <span>I am a Voter</span>
          </button>

          <button 
            onClick={() => navigate('/admin')}
            className="btn-admin"
          >
            <UserCheck size={24} />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>

      {/* Footer / Decorative */}
      <div className="footer">
        <p>© 2025 Election Commission of Pakistan. All rights reserved.</p>
        <div className="separator"></div>
      </div>
    </div>
  );
};

export default LandingPage;

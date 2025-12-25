import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoting } from '../context/VotingContext';
import { CreditCard, ArrowRight, AlertCircle } from 'lucide-react';
import '../styles/VoterLogin.css';

const VoterLogin = () => {
  const [cnic, setCnic] = useState('');
  const [error, setError] = useState('');
  const { loginVoter, candidates } = useVoting();
  const navigate = useNavigate();

  const formatCnic = (value) => {
    // Basic formatting XXX-XXXXXXX-X
    const digits = value.replace(/\D/g, '');
    let formatted = digits;
    if (digits.length > 5) {
      formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }
    if (digits.length > 12) {
      formatted = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
    }
    return formatted.slice(0, 15);
  };

  const handleCnicChange = (e) => {
    setCnic(formatCnic(e.target.value));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cnic.length !== 15) {
      setError('Please enter a valid 13-digit CNIC.');
      return;
    }
    
    // Simulate login
    if (loginVoter(cnic)) {
      navigate('/vote');
    } else {
      setError('System Error. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="icon-header">
           <CreditCard size={40} className="text-secondary" />
        </div>
        
        <h2>Voter Verification</h2>
        <p className="instruction">Enter your CNIC number to proceed to the polling booth.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="cnic">CNIC Number</label>
            <input
              id="cnic"
              type="text"
              placeholder="12345-1234567-1"
              value={cnic}
              onChange={handleCnicChange}
              className={`input-field ${error ? 'input-error' : ''}`}
              autoComplete="off"
            />
            {error && <div className="error-msg"><AlertCircle size={16}/> {error}</div>}
          </div>

          <button type="submit" className="btn-primary w-full btn-login">
            <span>Enter Polling Station</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="secure-badge">
            <span className="dot"></span> Secure Connection
        </div>
      </div>
    </div>
  );
};

export default VoterLogin;

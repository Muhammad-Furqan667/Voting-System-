import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoting } from '../context/VotingContext';
import { CheckCircle, LogOut } from 'lucide-react';
import '../styles/VotingPage.css';

const VotingPage = () => {
    const { currentUser, candidates, castVote, logout } = useVoting();
    const navigate = useNavigate();
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [voteSuccess, setVoteSuccess] = useState(false);
    const [fingerprint, setFingerprint] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!currentUser) {
            navigate('/voter-login');
        }
    }, [currentUser, navigate]);

    if (!currentUser) return null;

    const handleVoteClick = (candidate) => {
        setSelectedCandidate(candidate);
        setShowModal(true);
    };

    const confirmVote = async () => {
        if (!fingerprint.trim()) {
            setError('Fingerprint verification is required to vote.');
            return;
        }

        if (selectedCandidate) {
            const success = await castVote(selectedCandidate.id, fingerprint);
            if (success) {
                setVoteSuccess(true);
                setTimeout(() => {
                    setShowModal(false);
                    logout(); // Logout after voting
                    navigate('/');
                }, 3000);
            } else {
                setError('Vote failed. Invalid fingerprint or server error.');
            }
        }
    };

    return (
        <div className="voting-container">
            <header className="voting-header">
                <div className="voter-info">
                    <h2>Welcome, Citizen</h2>
                    <p>CNIC: {currentUser.cnic}</p>
                </div>
                <button className="btn-logout" onClick={() => { logout(); navigate('/'); }}>
                    <LogOut size={16} style={{display:'inline', marginRight:'5px'}}/> Logout
                </button>
            </header>

            <div className="candidates-grid">
                {candidates.map(candidate => (
                    <div key={candidate.id} className="candidate-card">
                        <div className="symbol-area">
                            {candidate.symbol}
                        </div>
                        <h3 className="candidate-name">{candidate.name}</h3>
                        <p className="party-name">{candidate.party}</p>
                        <button 
                            className="btn-vote"
                            onClick={() => handleVoteClick(candidate)}
                            disabled={currentUser.hasVoted}
                        >
                            Vote
                        </button>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {!voteSuccess ? (
                            <>
                                <h3 className="modal-title">Confirm Your Vote</h3>
                                <p>Are you sure you want to vote for:</p>
                                <div style={{margin: '1rem 0', fontWeight: 'bold', fontSize: '1.2rem'}}>
                                    {selectedCandidate.name} ({selectedCandidate.party})
                                </div>
                                
                                <div className="fingerprint-section" style={{margin: '1.5rem 0'}}>
                                    <label htmlFor="fingerprint" style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>
                                        Fingerprint Verification (Password)
                                    </label>
                                    <input
                                        type="password"
                                        id="fingerprint"
                                        className="fingerprint-input"
                                        placeholder="Enter your fingerprint password..."
                                        value={fingerprint}
                                        onChange={(e) => setFingerprint(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            fontSize: '1rem'
                                        }}
                                    />
                                    {error && <p style={{color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem'}}>{error}</p>}
                                </div>

                                <div className="modal-actions">
                                    <button 
                                        className="btn-cancel" 
                                        onClick={() => {
                                            setShowModal(false);
                                            setFingerprint('');
                                            setError('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button className="btn-confirm" onClick={confirmVote}>Confirm Vote</button>
                                </div>
                            </>
                        ) : (
                            <div className="success-message">
                                <CheckCircle size={48} />
                                <p>Vote Cast Successfully!</p>
                                <small style={{color: '#6b7280', fontSize: '0.875rem'}}>Redirecting to home...</small>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VotingPage;

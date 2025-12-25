import React, { useState } from 'react';
import { useVoting } from '../context/VotingContext';
import { LayoutDashboard, Users, PlusCircle, Edit2 } from 'lucide-react';
import '../styles/AdminDashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { candidates, addCandidate, updateCandidateSymbol, isAdmin } = useVoting();
    const [newItem, setNewItem] = useState({ name: '', party: '', symbol: '' });
    const [editingId, setEditingId] = useState(null);
    const [editSymbol, setEditSymbol] = useState('');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const { loginAdmin } = useVoting();

    // Simple protection
    if (!isAdmin) {
        const handleLogin = (e) => {
            e.preventDefault();
            if (loginAdmin(password)) {
                setLoginError('');
            } else {
                setLoginError('Invalid Password');
            }
        };

        return (
            <div className="login-container" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <div className="card" style={{maxWidth: '400px', width: '100%', textAlign: 'center'}}>
                    <h2 style={{color: 'var(--color-primary)', marginBottom: '1rem'}}>Admin Portal Access</h2>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <input 
                                type="password" 
                                className="input-field" 
                                placeholder="Enter Password (admin123)"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        {loginError && <p style={{color: 'red', marginBottom: '1rem'}}>{loginError}</p>}
                        <button type="submit" className="btn-primary w-full">Authenticate</button>
                    </form>
                    <button onClick={() => navigate('/')} style={{marginTop: '1rem', background:'none', border:'none', color:'#6b7280', textDecoration:'underline'}}>Back to Home</button>
                </div>
            </div>
        );
    }

    const handleAdd = (e) => {
        e.preventDefault();
        if (newItem.name && newItem.party && newItem.symbol) {
            addCandidate(newItem);
            setNewItem({ name: '', party: '', symbol: '' });
        }
    };

    const startEdit = (candidate) => {
        setEditingId(candidate.id);
        setEditSymbol(candidate.symbol);
    };

    const saveEdit = (id) => {
        updateCandidateSymbol(id, editSymbol);
        setEditingId(null);
    };

    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1><LayoutDashboard size={28}/> Election Commission Portal</h1>
                <button onClick={() => navigate('/')} className="btn-logout" style={{color: 'var(--color-primary)', borderColor: 'var(--color-primary)'}}>
                    Exit to Home
                </button>
            </header>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-value">{candidates.length}</div>
                    <div className="stat-label">Total Candidates</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{totalVotes}</div>
                    <div className="stat-label">Votes Cast</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value"><Users size={24} style={{display:'inline'}}/></div>
                    <div className="stat-label">Active Session</div>
                </div>
            </div>

            <div className="content-grid">
                {/* Add Candidate Form */}
                <div className="card">
                    <h3 className="card-title"><PlusCircle size={20} style={{display:'inline', marginRight:'8px'}}/> Add Candidate</h3>
                    <form onSubmit={handleAdd}>
                        <div className="form-group">
                            <label>Candidate Name</label>
                            <input 
                                type="text" className="input-field" 
                                value={newItem.name} 
                                onChange={e => setNewItem({...newItem, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Party Name</label>
                            <input 
                                type="text" className="input-field"
                                value={newItem.party} 
                                onChange={e => setNewItem({...newItem, party: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Symbol (Emoji/Text)</label>
                            <input 
                                type="text" className="input-field"
                                value={newItem.symbol} 
                                onChange={e => setNewItem({...newItem, symbol: e.target.value})}
                                placeholder="🏏"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-add">Register Candidate</button>
                    </form>
                </div>

                {/* Candidates List */}
                <div className="card">
                    <h3 className="card-title">Live Results & Management</h3>
                    <div className="candidate-list">
                        {candidates.map(candidate => (
                            <div key={candidate.id} className="candidate-item">
                                <div className="candidate-info">
                                    {editingId === candidate.id ? (
                                        <div style={{display: 'flex', gap: '5px'}}>
                                            <input 
                                                type="text" 
                                                value={editSymbol} 
                                                onChange={e => setEditSymbol(e.target.value)}
                                                style={{width: '50px', padding: '5px'}}
                                            />
                                            <button onClick={() => saveEdit(candidate.id)} className="btn-primary" style={{padding: '5px 10px'}}>Save</button>
                                        </div>
                                    ) : (
                                        <div className="candidate-symbol" onClick={() => startEdit(candidate)} title="Click to change symbol">
                                            {candidate.symbol}
                                        </div>
                                    )}
                                    
                                    <div className="candidate-details">
                                        <h4>{candidate.name}</h4>
                                        <p style={{color: '#6b7280', fontSize: '0.875rem'}}>{candidate.party}</p>
                                    </div>
                                </div>
                                
                                <div className="votes-count">
                                    {candidate.votes.toLocaleString()} Votes
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

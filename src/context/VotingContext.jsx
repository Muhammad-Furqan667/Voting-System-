import React, { createContext, useContext, useState, useEffect } from 'react';

const VotingContext = createContext();

export const useVoting = () => useContext(VotingContext);

export const VotingProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${API_URL}/candidates`);
      const data = await response.json();
      // Map backend 'voteCount' to frontend 'votes' to maintain compatibility
      const mappedData = data.map(c => ({
        ...c,
        votes: c.voteCount // Map voteCount to votes
      }));
      setCandidates(mappedData);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const loginVoter = async (cnic) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnic })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCurrentUser(data);
        setIsAdmin(false);
        return true;
      } else {
        alert(data.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginAdmin = (password) => {
    // For now keeping admin login local or we can add an endpoint
    if (password === 'admin123') {
      setIsAdmin(true);
      setCurrentUser({ name: 'Admin' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const castVote = async (candidateId, fingerprint) => {
    if (!currentUser) return false;

    try {
      const response = await fetch(`${API_URL}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            voterId: currentUser.id, 
            candidateId, 
            fingerprint 
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state to reflect vote
        setCurrentUser({ ...currentUser, hasVoted: true });
        
        // Refetch to update counts
        fetchCandidates();
        return true;
      } else {
        alert(data.message || 'Vote failed');
        return false;
      }
    } catch (error) {
      console.error('Voting error:', error);
      return false;
    }
  };

  const addCandidate = async (candidate) => {
    try {
        const response = await fetch(`${API_URL}/candidates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(candidate)
        });

        if (response.ok) {
            fetchCandidates();
        } else {
            console.error('Failed to add candidate');
        }
    } catch (error) {
        console.error('Error adding candidate:', error);
    }
  };

  const updateCandidateSymbol = (id, newSymbol) => {
     // TODO: Implement API if needed
     console.warn("Update symbol API not implemented yet");
  };

  return (
    <VotingContext.Provider value={{
      candidates,
      currentUser,
      isAdmin,
      loginVoter,
      loginAdmin,
      logout,
      castVote,
      addCandidate,
      updateCandidateSymbol,
      // Helper to check if someone can vote
      canVote: currentUser && !currentUser.hasVoted && !isAdmin
    }}>
      {children}
    </VotingContext.Provider>
  );
};

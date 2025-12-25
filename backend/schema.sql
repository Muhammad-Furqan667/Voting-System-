CREATE DATABASE IF NOT EXISTS pak_votes_db;
USE pak_votes_db;

-- Users Table (Voters & Admins)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cnic VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Acts as fingerprint data for now
    name VARCHAR(100),
    role ENUM('voter', 'admin') DEFAULT 'voter',
    hasVoted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Candidates Table
CREATE TABLE IF NOT EXISTS candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    party VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL, -- Emoji or text representation
    voteCount INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Votes Table (Audit Log)
CREATE TABLE IF NOT EXISTS votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voter_id INT NOT NULL,
    candidate_id INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voter_id) REFERENCES users(id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

-- Insert Dummy Data
INSERT INTO users (cnic, password, name, role) VALUES 
('12345-1234567-1', 'fingerprint1', 'Zain', 'voter'),
('admin-001', 'admin123', 'Admin User', 'admin');

-- Insert Initial Candidates
INSERT INTO candidates (name, party, symbol) VALUES 
('Imran Khan', 'PTI', '🏏'),
('Nawaz Sharif', 'PMLN', '🦁'),
('Bilawal Bhutto', 'PPP', '🏹');

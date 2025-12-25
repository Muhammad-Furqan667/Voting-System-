const db = require('../config/db');

exports.castVote = async (req, res) => {
    const { voterId, candidateId, fingerprint } = req.body;

    if (!voterId || !candidateId || !fingerprint) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // 1. Check if user exists and hasn't voted
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [voterId]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        if (user.hasVoted) {
            return res.status(400).json({ message: 'You have already voted!' });
        }

        // 2. Verify Fingerprint (Password)
        // In a real app, use bcrypt.compare associated with the user
        // Assuming plain text compare for this specific simplified request as per flow
        if (user.password !== fingerprint) {
            return res.status(401).json({ message: 'Invalid fingerprint/password verification' });
        }

        // 3. Cast Vote Transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Update Candidate Count
            await connection.query('UPDATE candidates SET voteCount = voteCount + 1 WHERE id = ?', [candidateId]);

            // Mark User as Voted
            await connection.query('UPDATE users SET hasVoted = TRUE WHERE id = ?', [voterId]);

            // Log Vote
            await connection.query('INSERT INTO votes (voter_id, candidate_id) VALUES (?, ?)', [voterId, candidateId]);

            await connection.commit();
            res.json({ message: 'Vote cast successfully!' });

        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

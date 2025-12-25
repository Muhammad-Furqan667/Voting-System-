const db = require('../config/db');

exports.login = async (req, res) => {
    const { cnic } = req.body;

    if (!cnic) {
        return res.status(400).json({ message: 'CNIC is required' });
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE cnic = ?', [cnic]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];
        
        // For simple MVP without JWT for now, just returning user info
        // In a real app, we would verify password here too, but for this specific flow,
        // we might login first (CNIC only check?) or if password is REQUIRED for login.
        // The prompt said "user can not poll a vote without password as password is a fingerprint"
        // This implies login might just be CNIC, and voting requires the password.
        // OR login requires CNIC + Password. 
        // Let's stick to the current flow: Login triggers session, Vote triggers password check.
        
        res.json({
            id: user.id,
            cnic: user.cnic,
            name: user.name,
            role: user.role,
            hasVoted: user.hasVoted
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

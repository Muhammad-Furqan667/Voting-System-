const db = require('../config/db');

exports.getAllCandidates = async (req, res) => {
    try {
        const [candidates] = await db.query('SELECT * FROM candidates');
        res.json(candidates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createCandidate = async (req, res) => {
    const { name, party, symbol } = req.body;

    if (!name || !party || !symbol) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [result] = await db.query('INSERT INTO candidates (name, party, symbol) VALUES (?, ?, ?)', [name, party, symbol]);
        res.status(201).json({ id: result.insertId, name, party, symbol, voteCount: 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

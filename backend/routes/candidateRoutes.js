const express = require('express');
const router = express.Router();
const { getAllCandidates, createCandidate } = require('../controllers/candidateController');

router.get('/', getAllCandidates);
router.post('/', createCandidate);

module.exports = router;

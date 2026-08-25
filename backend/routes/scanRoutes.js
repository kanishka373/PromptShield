const express = require('express');
const router = express.Router();
const { scanText, saveScan, getHistory, deleteScan, getSummary, getPublicActivity } = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware');

router.post('/scan', scanText);
router.post('/save', protect, saveScan);
router.get('/history', protect, getHistory);
router.delete('/:id', protect, deleteScan);
router.get('/summary', protect, getSummary);
router.get('/public-activity', getPublicActivity);

module.exports = router;
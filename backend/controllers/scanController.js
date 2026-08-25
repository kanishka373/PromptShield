const Scan = require('../models/Scan');
const { detectSecrets, countSecrets } = require('../utils/secretDetector');
const { maskText } = require('../utils/maskingEngine');
const { calculateRisk } = require('../utils/riskCalculator');

const scanText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });
    const detectedSecrets = detectSecrets(text);
    const maskedText = maskText(text, detectedSecrets);
    const { riskScore, riskLevel } = calculateRisk(detectedSecrets);
    const totalSecretsFound = countSecrets(detectedSecrets);
    const counts = {};
    for (const [k, v] of Object.entries(detectedSecrets)) counts[k] = v.length;
    res.json({ maskedText, detectedSecrets: counts, totalSecretsFound, riskScore, riskLevel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const saveScan = async (req, res) => {
  try {
    const { originalText, maskedText, secretsFound, totalSecretsFound, riskScore, riskLevel } = req.body;
    const scan = await Scan.create({ userId: req.user._id, originalText, maskedText, secretsFound, totalSecretsFound, riskScore, riskLevel });
    res.status(201).json(scan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const scans = await Scan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(scans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteScan = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) return res.status(404).json({ message: 'Scan not found' });
    if (scan.userId.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    await scan.deleteOne();
    res.json({ message: 'Scan deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSummary = async (req, res) => {
  try {
    const scans = await Scan.find({ userId: req.user._id });
    const total = scans.length;
    const high = scans.filter(s => s.riskLevel === 'High').length;
    const medium = scans.filter(s => s.riskLevel === 'Medium').length;
    const low = scans.filter(s => s.riskLevel === 'Low').length;
    const safe = scans.filter(s => s.totalSecretsFound === 0).length;
    const totalSecrets = scans.reduce((acc, s) => acc + s.totalSecretsFound, 0);
    const weekly = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      const count = scans.filter(s => new Date(s.createdAt).toDateString() === d.toDateString()).length;
      weekly.push({ day: dayStr, scans: count });
    }
    res.json({ total, high, medium, low, safe, totalSecrets, weekly });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Public, anonymized activity feed for the landing page ticker.
// Only secret TYPES and timestamps are returned — never actual values, never user info.
const getPublicActivity = async (req, res) => {
  try {
    const scans = await Scan.find({ totalSecretsFound: { $gt: 0 } })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('secretsFound createdAt riskLevel');

    const typeLabels = {
      apiKeys: 'API Key',
      privateKeys: 'Private Key',
      passwords: 'Password',
      emails: 'Email',
      jwtTokens: 'JWT Token',
      phoneNumbers: 'Phone Number',
      mongoURIs: 'DB URI',
      awsKeys: 'AWS Key',
    };

    const activity = [];
    scans.forEach((scan) => {
      Object.entries(scan.secretsFound || {}).forEach(([key, count]) => {
        if (count > 0 && typeLabels[key]) {
          activity.push({
            type: typeLabels[key],
            status: 'BLOCKED',
            time: scan.createdAt,
          });
        }
      });
    });

    // Most recent first, capped so the ticker doesn't get overloaded
    const trimmed = activity
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 15);

    res.json(trimmed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { scanText, saveScan, getHistory, deleteScan, getSummary, getPublicActivity };
 
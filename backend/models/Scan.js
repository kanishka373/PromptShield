const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalText: {
    type: String,
    required: true
  },
  maskedText: {
    type: String,
    required: true
  },
  secretsFound: {
    apiKeys: { type: Number, default: 0 },
    passwords: { type: Number, default: 0 },
    emails: { type: Number, default: 0 },
    jwtTokens: { type: Number, default: 0 },
    phoneNumbers: { type: Number, default: 0 },
    mongoURIs: { type: Number, default: 0 },
    awsKeys: { type: Number, default: 0 }
  },
  totalSecretsFound: { type: Number, default: 0 },
  riskScore: { type: Number, default: 0 },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  }
}, { timestamps: true });

module.exports = mongoose.model('Scan', scanSchema);

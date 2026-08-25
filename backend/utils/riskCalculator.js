const SCORES = {
  apiKeys:      40,
  passwords:    30,
  jwtTokens:    50,
  emails:       10,
  phoneNumbers: 10,
  mongoURIs:    50,
  awsKeys:      50
};

const calculateRisk = (detectedSecrets) => {
  let totalScore = 0;

  for (const [type, matches] of Object.entries(detectedSecrets)) {
    if (matches.length > 0 && SCORES[type]) {
      totalScore += SCORES[type] * matches.length;
    }
  }

  // Cap at 100
  totalScore = Math.min(totalScore, 100);

  let riskLevel;
  if (totalScore <= 30) riskLevel = 'Low';
  else if (totalScore <= 70) riskLevel = 'Medium';
  else riskLevel = 'High';

  return { riskScore: totalScore, riskLevel };
};

module.exports = { calculateRisk };

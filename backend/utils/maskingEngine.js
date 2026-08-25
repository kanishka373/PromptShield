const maskText = (text, detectedSecrets) => {
  let maskedText = text;

  // Flatten all matches with their type, then sort by LENGTH descending.
  // This ensures longer/more-specific matches (like a full mongo URI) get
  // masked before shorter/generic ones (like an email) can accidentally
  // grab a substring of them.
  const allMatches = [];
  for (const [type, matches] of Object.entries(detectedSecrets)) {
    for (const match of matches) {
      allMatches.push({ type, match });
    }
  }

  allMatches.sort((a, b) => b.match.length - a.match.length);

  for (const { type, match } of allMatches) {
    const label = getLabelForType(type);
    const escaped = match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    maskedText = maskedText.replace(new RegExp(escaped, 'g'), label);
  }

  return maskedText;
};

const getLabelForType = (type) => {
  const labels = {
    apiKeys:      '[API_KEY_MASKED]',
    privateKeys:  '[PRIVATE_KEY_MASKED]',
    passwords:    '[PASSWORD_MASKED]',
    emails:       '[EMAIL_MASKED]',
    jwtTokens:    '[JWT_TOKEN_MASKED]',
    phoneNumbers: '[PHONE_MASKED]',
    mongoURIs:    '[MONGO_URI_MASKED]',
    awsKeys:      '[AWS_KEY_MASKED]'
  };
  return labels[type] || '[MASKED]';
};

module.exports = { maskText };
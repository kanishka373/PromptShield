const patterns = {
  apiKeys: [
    /sk[_-](proj[_-])?[a-zA-Z0-9_-]{20,}/g,
    /AIza[0-9A-Za-z\-_]{35}/g,
    /\b(api[_-]?key|access[_-]?token|auth[_-]?token)\s*[:=]\s*["']?[a-zA-Z0-9_\-]{20,}["']?/gi,
    /ghp_[a-zA-Z0-9]{36}/g,
    /gho_[a-zA-Z0-9]{36}/g,
    /xoxb-[0-9]{11}-[0-9]{11}-[a-zA-Z0-9]{24}/g,
    /xoxp-[0-9]{11,}-[0-9]{11,}-[0-9]{11,}-[a-zA-Z0-9]{32}/g,
    /Bearer\s+[a-zA-Z0-9\-._~+/]{20,}=*/g,
    /sk_live_[0-9a-zA-Z]{24,}/g,
    /sk_test_[0-9a-zA-Z]{24,}/g,
    /pk_live_[0-9a-zA-Z]{24,}/g,
    /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g,
    /npm_[a-zA-Z0-9]{36}/g,
   /rzp_(live|test)_[a-zA-Z0-9]{14,}/g
  ],
  privateKeys: [
    /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g
  ],
passwords: [
  /\bpassword\s*[:=]\s*["']?[^\s"']{6,}["']?/gi,
  /\bpasswd\s*[:=]\s*["']?[^\s"']{6,}["']?/gi,
  /\bpwd\s*[:=]\s*["']?[^\s"']{6,}["']?/gi,
  /\bclient[_-]?secret\s*[:=]\s*["']?[^\s"']{8,}["']?/gi,
  /\b(api[_-]?key|app[_-]?key|access[_-]?key|auth[_-]?token|secret[_-]?key)\s*[:=]\s*["']?[^\s"']{8,}["']?/gi,
  /\b[A-Z][A-Z0-9_]*(KEY|TOKEN|SECRET|PASSWORD)\s*[:=]\s*["']?[^\s"']{6,}["']?/g,
],
  emails: [
    /(?<!:\/\/)(?<![a-zA-Z0-9])[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g
  ],
  jwtTokens: [
    /eyJ[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]*/g
  ],
  phoneNumbers: [
    /\b(phone|mobile|contact|whatsapp|cell|tel)\s*[:=]\s*["']?(\+?91[\s\-]?)?[6-9]\d{9}["']?/gi,
    /\b(phone|mobile|contact|whatsapp|cell|tel)\s*[:=]\s*["']?(\+1[\s\-]?)?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}["']?/gi,
  ],
  mongoURIs: [
    /mongodb(\+srv)?:\/\/[^\s"'`]+/g,
    /postgres(ql)?:\/\/[^\s"'`]+/g,
    /mysql:\/\/[^\s"'`]+/g,
    /redis:\/\/[^\s"'`]+/g
  ],
  awsKeys: [
    /AKIA[0-9A-Z]{16}/g,
    /[0-9a-zA-Z/+]{40}(aws|AWS)/g,
    /ASIA[0-9A-Z]{16}/g
  ]
};
const detectSecrets = (text) => {
  const results = {
    apiKeys: [],
    privateKeys: [],
    passwords: [],
    emails: [],
    jwtTokens: [],
    phoneNumbers: [],
    mongoURIs: [],
    awsKeys: []
  };

  // High-signal / structured patterns checked FIRST.
  // Once a range of text is claimed by one of these, lower-signal
  // patterns (email, phone, password) can't re-match inside it.
  const priorityOrder = ['privateKeys', 'mongoURIs', 'awsKeys', 'jwtTokens', 'apiKeys', 'passwords', 'emails', 'phoneNumbers'];
  const claimedRanges = [];

  const isOverlapping = (start, end) => {
    return claimedRanges.some(r => start < r.end && end > r.start);
  };

  for (const type of priorityOrder) {
    const regexList = patterns[type];
    const found = new Set();
    for (const regex of regexList) {
      const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
      let match;
      while ((match = re.exec(text)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        if (!isOverlapping(start, end)) {
          found.add(match[0]);
          claimedRanges.push({ start, end });
        }
      }
    }
    results[type] = [...found];
  }

  return results;
};

const countSecrets = (detectedSecrets) => {
  return Object.values(detectedSecrets).reduce((total, arr) => total + arr.length, 0);
};

module.exports = { detectSecrets, countSecrets };
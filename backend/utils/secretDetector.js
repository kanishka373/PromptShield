const patterns = {
  apiKeys: [
    /sk[_-](proj[_-])?[a-zA-Z0-9_-]{20,}/g,
    /AIza[0-9A-Za-z\-_]{35}/g,
    /[a-zA-Z0-9]{32,45}(key|KEY|api|API|token|TOKEN)/g,
    /ghp_[a-zA-Z0-9]{36}/g,
    /gho_[a-zA-Z0-9]{36}/g,
    /xoxb-[0-9]{11}-[0-9]{11}-[a-zA-Z0-9]{24}/g,
    /xoxp-[0-9]{11,}-[0-9]{11,}-[0-9]{11,}-[a-zA-Z0-9]{32}/g,
    /Bearer\s+[a-zA-Z0-9\-._~+/]+=*/g,
    /sk_live_[0-9a-zA-Z]{24,}/g,
    /sk_test_[0-9a-zA-Z]{24,}/g,
    /pk_live_[0-9a-zA-Z]{24,}/g,
    /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g,
    /npm_[a-zA-Z0-9]{36}/g
  ],
  privateKeys: [
    /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g
  ],
passwords: [
  /\bpassword\s*[:=]\s*["']?[^\s"']{4,}["']?/gi,
  /\bpasswd\s*[:=]\s*["']?[^\s"']{4,}["']?/gi,
  /\bpwd\s*[:=]\s*["']?[^\s"']{4,}["']?/gi,
  /secret\s*[:=]\s*["']?[^\s"']{4,}["']?/gi,
  /\bpass\s*[:=]\s*["']?[^\s"']{4,}["']?/gi,
  /\bclient[_-]?secret\s*[:=]\s*["']?[^\s"']{8,}["']?/gi,
  /\b(api[_-]?key|app[_-]?key|access[_-]?key|auth[_-]?token|secret[_-]?key)\s*[:=]\s*["']?[^\s"']{8,}["']?/gi,
  /\b[A-Z][A-Z0-9_]*(KEY|TOKEN|SECRET)\s*[:=]\s*["']?[^\s"']{6,}["']?/g,
],
  emails: [
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g
  ],
  jwtTokens: [
    /eyJ[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]*/g
  ],
  phoneNumbers: [
    /(\+?91[\s\-]?)?[6-9]\d{9}/g,
    /(\+1[\s\-]?)?(\(?\d{3}\)?[\s\-]?)?\d{3}[\s\-]?\d{4}/g
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

  for (const [type, regexList] of Object.entries(patterns)) {
    const found = new Set();
    for (const regex of regexList) {
      const matches = text.match(new RegExp(regex.source, regex.flags)) || [];
      matches.forEach(m => found.add(m));
    }
    results[type] = [...found];
  }

  return results;
};

const countSecrets = (detectedSecrets) => {
  return Object.values(detectedSecrets).reduce((total, arr) => total + arr.length, 0);
};

module.exports = { detectSecrets, countSecrets };
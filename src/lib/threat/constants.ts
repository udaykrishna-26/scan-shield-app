// Threat detection constants (Module 2 + 3 per spec)
export const SHORTENERS = [
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly",
  "is.gd", "buff.ly", "t.ly", "rebrand.ly", "cutt.ly",
];

export const SUSPICIOUS_KEYWORDS = [
  "login", "verify", "otp", "payment", "wallet",
  "bank", "secure", "reward", "account", "update", "confirm",
];

export const SUSPICIOUS_TLDS = [
  ".xyz", ".top", ".tk", ".ml", ".ga", ".cf", ".gq", ".click", ".country",
];

export const BRAND_TERMS = [
  "paypal", "google", "apple", "microsoft", "amazon", "facebook",
  "instagram", "netflix", "bank", "chase", "wellsfargo",
];

// Score weights — exactly per spec
export const WEIGHTS = {
  noHttps: 20,
  shortUrl: 25,
  keyword: 15,
  blacklist: 40,
  domainAnomaly: 20,
} as const;
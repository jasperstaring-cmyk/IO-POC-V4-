// ─── Email classification ─────────────────────────────────────────────────────
const PRIVATE_DOMAINS    = ["gmail.com","hotmail.com","yahoo.com","outlook.com","icloud.com","live.com","me.com","hotmail.nl","ziggo.nl","kpnmail.nl"]
const GENERIC_PREFIXES   = ["info","team","admin","service","subscriptions","contact","support","sales","hello","noreply","no-reply","office","mail","post","help","reception","secretariat","redactie","bestuur","algemeen"]
const ENTERPRISE_DOMAINS = ["abnamro.com"]
const WHITELIST_DOMAINS  = ["wealthpro.com"]
const EXISTING_ACCOUNTS  = ["demo@abnamro.com","demo@aegon.com"]

// Domain → company name for SSO display
const COMPANY_NAMES = { "abnamro.com":"ABN AMRO" }

const PRIVATE_DOMAINS_LOGIN = ["gmail.com","hotmail.com","yahoo.com","outlook.com","icloud.com","live.com","me.com"]
const SSO_DOMAINS           = ["abnamro.com"]
const KNOWN_ACCOUNTS_LOGIN  = ["demo@abnamro.com","demo@aegon.com"]

// SSO domain → company name
const SSO_COMPANY_NAMES = { "abnamro.com":"ABN AMRO" }

export function getCompanyNameFromEmail(email) {
  if (!email || !email.includes("@")) return null
  const domain = email.toLowerCase().split("@")[1]
  return SSO_COMPANY_NAMES[domain] || null
}

/**
 * Classifies an email for the registration flow.
 * Returns: "generic" | "private" | "existing" | "enterprise" | "whitelist" | "new" | "invalid"
 */
export function classifyEmailForReg(email) {
  if (!email || !email.includes("@")) return "invalid"
  const [prefix, domain] = email.toLowerCase().split("@")
  if (!domain) return "invalid"
  if (GENERIC_PREFIXES.some(p => prefix === p || prefix.startsWith(p + ".") || prefix.startsWith(p + "_"))) return "generic"
  if (PRIVATE_DOMAINS.includes(domain)) return "private"
  if (EXISTING_ACCOUNTS.includes(email.toLowerCase())) return "existing"
  if (ENTERPRISE_DOMAINS.includes(domain)) return "enterprise"
  if (WHITELIST_DOMAINS.includes(domain)) return "whitelist"
  return "new"
}

/**
 * Classifies an email for the login modal.
 * Returns: "private" | "sso" | "known" | "unknown" | "invalid"
 */
export function classifyEmailForLogin(email) {
  if (!email || !email.includes("@")) return "invalid"
  const parts  = email.toLowerCase().split("@")
  const domain = parts[1]
  if (!domain) return "invalid"
  if (PRIVATE_DOMAINS_LOGIN.includes(domain)) return "private"
  if (SSO_DOMAINS.includes(domain)) return "sso"
  if (KNOWN_ACCOUNTS_LOGIN.includes(email.toLowerCase())) return "known"
  return "unknown"
}
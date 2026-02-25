import { useState } from 'react'
import { C } from '../tokens.js'

export default function DemoBanner() {
  const [open, setOpen] = useState(false)

  /* ── Deep-link pills ── */
  const deepLinks = [
    { label: "Article",           hash: "#article" },
    { label: "Login",             hash: "#login" },
    { label: "Personal plans",    hash: "#plans" },
    { label: "Business plans",    hash: "#bizplans" },
    { label: "Personal reg.",     hash: "#personal" },
    { label: "Business reg.",     hash: "#business" },
    { label: "Business Intl.",    hash: "#bizintl" },
    { label: "Enterprise",        hash: "#enterprise" },
    { label: "Subscriptions",     hash: "#subscriptions" },
    { label: "Onboarding",        hash: "#onboarding" },
    { label: "Account",           hash: "#account" },
  ]

  /* ── Test accounts (compact — one entry per email) ── */
  const accounts = [
    { email: "demo@abnamro.com",    scenarios: "Login → SSO/Enterprise · Register → enterprise domain detected" },
    { email: "demo@aegon.com",      scenarios: "Login → password flow · Register → existing account warning" },
    { email: "new@aegon.com",       scenarios: "Register → normal flow (known domain)" },
    { email: "new@wealthpro.com",   scenarios: "Register → whitelisted domain (fast track)" },
    { email: "new@gmail.com",       scenarios: "Login → private email warning · Register → private email warning" },
    { email: "info@company.com",    scenarios: "Register → generic address rejected" },
    { email: "user@unknown.com",    scenarios: "Login → no account found" },
    { email: "trial@company.com",   scenarios: "Business reg. → 2-year block → paid plans" },
  ]

  /* ── Business rules ── */
  const rules = [
    { rule: "Wealth / Institutional segment", effect: "Business NL → free ongoing access · Business Intl. → 50% discount" },
    { rule: "Other segments",                 effect: "Business NL → 6 months free · Business Intl. → standard rate" },
  ]

  const pillStyle = {
    display:"inline-block", padding:"0.2rem 0.5rem", borderRadius:4,
    background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.85)",
    fontSize:"0.65rem", cursor:"pointer", textDecoration:"none",
    border:"1px solid rgba(255,255,255,0.12)", transition:"all 0.15s",
    whiteSpace:"nowrap",
  }

  return (
    <div style={{
      position:"relative", top:0, left:0, right:0, zIndex:9999,
      background:C.navy, color:"rgba(255,255,255,0.9)",
      fontFamily:"var(--font-sans)", fontSize:"0.75rem",
    }}>
      {/* Toggle bar */}
      <button onClick={() => setOpen(o => !o)} style={{
        width:"100%", display:"flex", alignItems:"center", justifyContent:"center",
        gap:"0.5rem", padding:"0.4rem 1rem", background:"none", border:"none",
        color:"rgba(255,255,255,0.7)", cursor:"pointer", fontFamily:"var(--font-sans)",
        fontSize:"0.7rem", letterSpacing:"0.06em", textTransform:"uppercase",
      }}>
        <span style={{ background:"rgba(255,255,255,0.15)", padding:"0.15rem 0.5rem", borderRadius:4, fontWeight:700, color:C.green }}>
          POC
        </span>
        {open ? "Hide test panel" : "Show test panel"}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition:"transform 0.2s" }}>
          <path d="M3 5l3 3 3-3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Collapsible content */}
      {open && (
        <div style={{
          maxHeight:"70vh", overflowY:"auto",
          padding:"0.5rem 2rem 1.25rem",
          borderTop:"1px solid rgba(255,255,255,0.1)",
        }}>

          {/* ── Deep-link pills ── */}
          <div style={{ marginBottom:"1rem" }}>
            <div style={{ fontWeight:700, fontSize:"0.65rem", letterSpacing:"0.06em", textTransform:"uppercase", color:C.green, marginBottom:"0.4rem" }}>
              Jump to screen
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem" }}>
              {deepLinks.map((dl) => (
                <a key={dl.hash} href={dl.hash} style={pillStyle}
                   onMouseEnter={e => { e.target.style.background="rgba(255,255,255,0.2)" }}
                   onMouseLeave={e => { e.target.style.background="rgba(255,255,255,0.1)" }}>
                  {dl.label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Two-column: accounts + rules ── */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem 2rem" }}>

            {/* Test accounts */}
            <div>
              <div style={{ fontWeight:700, fontSize:"0.65rem", letterSpacing:"0.06em", textTransform:"uppercase", color:C.green, marginBottom:"0.4rem" }}>
                Test e-mail accounts
              </div>
              {accounts.map((a, i) => (
                <div key={i} style={{ marginBottom:"0.35rem", lineHeight:1.5 }}>
                  <code style={{ background:"rgba(255,255,255,0.1)", padding:"0.1rem 0.375rem", borderRadius:3, fontSize:"0.7rem", whiteSpace:"nowrap" }}>
                    {a.email}
                  </code>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.65rem", marginLeft:"0.4rem" }}>
                    {a.scenarios}
                  </span>
                </div>
              ))}
            </div>

            {/* Business rules + language */}
            <div>
              <div style={{ fontWeight:700, fontSize:"0.65rem", letterSpacing:"0.06em", textTransform:"uppercase", color:C.green, marginBottom:"0.4rem" }}>
                Segment pricing rules
              </div>
              {rules.map((r, i) => (
                <div key={i} style={{ marginBottom:"0.35rem", lineHeight:1.5 }}>
                  <code style={{ background:"rgba(255,255,255,0.1)", padding:"0.1rem 0.375rem", borderRadius:3, fontSize:"0.7rem", whiteSpace:"nowrap" }}>
                    {r.rule}
                  </code>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.65rem", marginLeft:"0.4rem" }}>
                    {r.effect}
                  </span>
                </div>
              ))}

              <div style={{ marginTop:"0.75rem", fontWeight:700, fontSize:"0.65rem", letterSpacing:"0.06em", textTransform:"uppercase", color:C.green, marginBottom:"0.4rem" }}>
                Language
              </div>
              <div style={{ display:"flex", gap:"0.3rem" }}>
                {["en","nl","de","fr"].map(code => (
                  <a key={code} href={`#lang=${code}`} style={pillStyle}
                     onMouseEnter={e => { e.target.style.background="rgba(255,255,255,0.2)" }}
                     onMouseLeave={e => { e.target.style.background="rgba(255,255,255,0.1)" }}>
                    {code.toUpperCase()}
                  </a>
                ))}
              </div>
            </div>

          </div>

          <div style={{ marginTop:"0.75rem", paddingTop:"0.625rem", borderTop:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)", fontSize:"0.65rem" }}>
            Stripe payment screens are simulations. Passwords are not validated. All data is fictional.
          </div>
        </div>
      )}
    </div>
  )
}

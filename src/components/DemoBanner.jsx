import { useState } from 'react'
import { C } from '../tokens.js'
import { useLang } from '../LanguageContext.jsx'

export default function DemoBanner() {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const isNL = t("lang") === "nl"

  const sections = [
    {
      title: isNL ? "Inloggen" : "Login",
      items: [
        { code: "demo@abnamro.com", desc: isNL ? "→ SSO/Enterprise flow (ABN AMRO)" : "→ SSO/Enterprise flow (ABN AMRO)" },
        { code: "demo@aegon.com", desc: isNL ? "→ Wachtwoord login (bestaand account)" : "→ Password login (existing account)" },
        { code: "user@gmail.com", desc: isNL ? "→ Privé e-mail waarschuwing" : "→ Private email warning" },
        { code: "user@onbekend.com", desc: isNL ? "→ Geen account gevonden" : "→ No account found" },
      ]
    },
    {
      title: isNL ? "Registratie — Personal" : "Registration — Personal",
      items: [
        { code: "info@bedrijf.nl", desc: isNL ? "→ Generiek adres geweigerd" : "→ Generic address rejected" },
        { code: "nieuw@gmail.com", desc: isNL ? "→ Privé-adres waarschuwing" : "→ Private address warning" },
        { code: "demo@abnamro.com", desc: isNL ? "→ Enterprise domein detectie" : "→ Enterprise domain detection" },
        { code: "nieuw@wealthpro.com", desc: isNL ? "→ Whitelist domein (snelle registratie)" : "→ Whitelist domain (fast registration)" },
        { code: "demo@aegon.com", desc: isNL ? "→ Bestaand account detectie" : "→ Existing account detection" },
        { code: "nieuw@aegon.com", desc: isNL ? "→ Normale registratie flow" : "→ Normal registration flow" },
      ]
    },
    {
      title: isNL ? "Registratie — Business" : "Registration — Business",
      items: [
        { code: "trial@bedrijf.nl", desc: isNL ? "→ 2-jaar blokkade → betaalde pakketten S/M/L/XL" : "→ 2-year block → paid plans S/M/L/XL" },
        { code: isNL ? "Wealth / Institutional segment" : "Wealth / Institutional segment", desc: isNL ? "→ Gratis doorlopende toegang" : "→ Free ongoing access" },
        { code: isNL ? "Overige segmenten" : "Other segments", desc: isNL ? "→ 6 maanden gratis" : "→ 6 months free" },
      ]
    },
    {
      title: isNL ? "Registratie — Business International" : "Registration — Business International",
      items: [
        { code: isNL ? "Segment Wealth of Institutional" : "Wealth or Institutional segment", desc: isNL ? "→ 50% korting op alle pakketten" : "→ 50% discount on all plans" },
        { code: isNL ? "Overige segmenten" : "Other segments", desc: isNL ? "→ Normaal tarief" : "→ Standard rate" },
      ]
    },
  ]

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
        {open ? (isNL ? "Demo instructies verbergen" : "Hide demo instructions") : (isNL ? "Demo instructies tonen" : "Show demo instructions")}
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
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:"1rem 2rem" }}>
            {sections.map((sec, i) => (
              <div key={i}>
                <div style={{ fontWeight:700, fontSize:"0.7rem", letterSpacing:"0.06em", textTransform:"uppercase", color:C.green, marginBottom:"0.5rem" }}>
                  {sec.title}
                </div>
                {sec.items.map((item, j) => (
                  <div key={j} style={{ display:"flex", gap:"0.5rem", marginBottom:"0.3rem", lineHeight:1.5 }}>
                    <code style={{ background:"rgba(255,255,255,0.1)", padding:"0.1rem 0.375rem", borderRadius:3, fontSize:"0.7rem", whiteSpace:"nowrap", flexShrink:0 }}>
                      {item.code}
                    </code>
                    <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.7rem" }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop:"0.75rem", paddingTop:"0.625rem", borderTop:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.4)", fontSize:"0.65rem" }}>
            {isNL
              ? "Stripe betaalschermen zijn simulaties. Wachtwoorden worden niet gevalideerd. Alle data is fictief."
              : "Stripe payment screens are simulations. Passwords are not validated. All data is fictional."
            }
          </div>
        </div>
      )}
    </div>
  )
}

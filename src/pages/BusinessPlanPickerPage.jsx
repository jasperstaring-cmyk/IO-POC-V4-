import { C } from '../tokens.js'
import { TopProgressBar, CheckItem, LangSwitcher } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'
import IOLogo from '../components/IOLogo.jsx'

// ─── Toggle component (zelfde als in PlanPickerPage) ────────────────────────
function PlanTypeToggle({ active, onChange }) {
  const opts = [
    { id: "personal", label: "Persoonlijk" },
    { id: "business", label: "Zakelijk" },
  ]
  return (
    <div style={{ display:"inline-flex", background:C.gray100, borderRadius:99, padding:3, gap:2 }}>
      {opts.map(o => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          style={{
            padding:"0.5rem 1.5rem",
            borderRadius:99,
            border:"none",
            cursor:"pointer",
            fontFamily:"var(--font-sans)",
            fontSize:"0.875rem",
            fontWeight: active === o.id ? 700 : 500,
            color: active === o.id ? C.white : C.gray700,
            background: active === o.id ? C.green : "transparent",
            transition:"all 0.2s",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ─── Business plan data ─────────────────────────────────────────────────────
const BIZ_PLANS = [
  {
    id: "business",
    name: "Business",
    sub: "Toegang tot de editie van uw land voor uw collega's.",
    priceLines: [
      { text: "Gratis", style: "big" },
      { text: "voor Asset Owners", style: "suffix" },
    ],
    priceNote: "6 maanden gratis proefperiode voor andere organisaties.",
    cta: "Start Business regeling",
    ctaNote: "Geen verplichtingen tijdens de proefperiode.",
    badge: "Meest gekozen door Asset Owners",
    features: [
      "Toegang tot de lokale editie van uw land",
      "Toegang voor alle collega's binnen uw organisatie",
      "Admin-omgeving voor gebruikersbeheer, organisatiegegevens en facturen",
      "Standaard toegang tot alle relevante nieuwsbrieven",
    ],
  },
  {
    id: "business_intl",
    name: "Business International",
    sub: "Volledige toegang tot alle edities van Investment Officer.",
    priceLines: [
      { text: "Vanaf € 99,–", style: "big" },
      { text: "per maand", style: "suffix" },
    ],
    priceNote: "Jaarlijks gefactureerd.",
    cta: "Start Business International",
    ctaNote: "Direct toegang voor uw internationale teams.",
    badge: null,
    features: [
      "Toegang tot alle lokale edities",
      "Inclusief het internationale platform",
      "Toegang voor uw internationale teams",
      "Centrale admin-omgeving voor gebruikers, organisatiebeheer en financiële administratie",
      "Onbeperkte toegang tot alle premium redactionele content",
      "Eenvoudig op te schalen bij groei van uw organisatie",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    sub: "Maatwerkoplossing voor grote instellingen.",
    priceLines: [
      { text: "Op aanvraag", style: "big" },
    ],
    priceNote: null,
    cta: "Vraag een voorstel aan",
    ctaNote: "Persoonlijk contact en advies inbegrepen.",
    badge: null,
    features: [
      "Persoonlijk aanspreekpunt / accountmanager",
      "Jaarlijkse factuur op organisatieniveau",
      "Toegang via Single Sign-On (SSO) mogelijk",
      "Automatische toegang via e-maildomein",
      "Uitgebreide admin-omgeving met gebruikersbeheer, rapportages en financiële controle",
      "Contractvorm op maat",
    ],
  },
]

// ─── BusinessPlanPickerPage ─────────────────────────────────────────────────
export default function BusinessPlanPickerPage({ onSelectPlan, onSwitchToPersonal, onBack }) {
  const { t } = useLang()

  function handleToggle(type) {
    if (type === "personal") {
      onSwitchToPersonal()
    }
  }

  return (
    <div style={{ minHeight:"100vh", background:C.white }}>
      <TopProgressBar total={6} current={1} />
      {/* Nav */}
      <header style={{ position:"sticky", top:4, zIndex:50, background:C.white, borderBottom:`1px solid ${C.gray100}`, boxShadow:"0 1px 6px rgba(12,24,46,0.06)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 1.5rem", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <IOLogo />
          <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
            <LangSwitcher />
            <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, display:"flex", alignItems:"center", gap:"0.375rem" }}>
              ← {t("pf_back")}
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth:1060, margin:"0 auto", padding:"3rem 1.5rem 0" }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ display:"inline-block", background:C.gray100, borderRadius:99, padding:"0.3rem 1rem", fontFamily:"var(--font-sans)", fontSize:"0.8rem", fontWeight:600, color:C.gray500, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"1rem" }}>
            Zakelijke abonnementen
          </div>
          <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.75rem,4vw,2.5rem)", fontWeight:700, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", color:C.navy, marginBottom:"1rem" }}>
            Kies de zakelijke regeling die past bij uw organisatie
          </h1>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.5rem", maxWidth:680, margin:"0 auto 1.5rem" }}>
            Bied uw collega's gestructureerde toegang tot de premium journalistiek, analyses en marktinzichten van Investment Officer.
          </p>

          {/* Toggle */}
          <PlanTypeToggle active="business" onChange={handleToggle} />
        </div>

        {/* Plan kaarten */}
        <div className="sub-cards" style={{ marginTop:"2rem" }}>
          {BIZ_PLANS.map(p => (
            <div key={p.id} className="sub-card" style={{ position:"relative" }}>
              {/* Badge */}
              {p.badge && (
                <div style={{
                  position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)",
                  background:C.green, color:C.navy, fontFamily:"var(--font-sans)",
                  fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.04em",
                  padding:"0.3rem 0.875rem", borderRadius:99, whiteSpace:"nowrap",
                }}>
                  {p.badge}
                </div>
              )}

              <div className="sub-card-zone-name">
                <div className="sub-card-name">{p.name}</div>
                <div className="sub-card-sub">{p.sub}</div>
              </div>

              <div className="sub-card-zone-price">
                {p.priceLines.map((line, i) => (
                  line.style === "big"
                    ? <span key={i} className="sub-card-price">{line.text}</span>
                    : <span key={i} className="sub-card-price-suffix"> {line.text}</span>
                ))}
                {p.priceNote && (
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, marginTop:"0.375rem", lineHeight:"var(--lh-body)" }}>
                    {p.priceNote}
                  </div>
                )}
              </div>

              <div className="sub-card-zone-cta">
                <button className="btn-red" onClick={() => onSelectPlan(p.id)}>{p.cta}</button>
                <p className="sub-card-note">{p.ctaNote}</p>
              </div>

              <div className="sub-card-zone-features">
                <div className="sub-card-features-title">Wat u krijgt</div>
                {p.features.map((f, i) => <CheckItem key={i}>{f}</CheckItem>)}
              </div>

              <div className="sub-card-zone-bottom">
                <button className="btn-outline" onClick={() => alert(`POC: ${p.name}`)}>Toon alle features</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust footer */}
      <div style={{ background:C.gray50, marginTop:"3rem", padding:"3rem 1.5rem" }}>
        <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.25rem,3vw,1.75rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", marginBottom:"1rem" }}>
            Vertrouwd door toonaangevende vermogensbeheerders, banken en pensioenfondsen in Europa
          </h2>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.5rem" }}>
            Investment Officer ondersteunt professionals in asset management, wealth management en institutioneel beleggen met onafhankelijke journalistiek en diepgaande analyses.
          </p>
          <button className="btn-navy" style={{ padding:"0.875rem 2rem" }}>
            Neem contact met ons op
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { C } from '../tokens.js'
import { SEGMENTS, JOB_ROLES, BUSINESS_SIZES } from '../data.js'
import { TopProgressBar, RegSidebar, SelectionRow, EmailChip, BackButton, AuthNav } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'
import IOLogo from '../components/IOLogo.jsx'

/* ─── Segment → pricing logic ──────────────────────────────────────────── */
const FREE_SEGMENTS = ["wealth", "institutional"]
function isFreePermanent(segId) { return FREE_SEGMENTS.includes(segId) }

function getSidebarMeta(segId, isPaid, chosenSize, xlCount) {
  const baseFeatures = [
    "Onbeperkte toegang tot alle redactionele content",
    "Alle artikelen, analyses en expertbijdragen",
    "Eén gedeelde omgeving met gebruikersbeheer",
    "Eenvoudig collega's toevoegen of verwijderen",
  ]
  if (isPaid && chosenSize) {
    const price = chosenSize.id === "XL"
      ? `€ ${((xlCount || 16) * (chosenSize.perUser || 9)).toLocaleString("nl-NL")},–`
      : chosenSize.priceLabel
    return {
      name: `Business ${chosenSize.label}`,
      price: price,
      priceSuffix: "per maand, jaarlijks gefactureerd",
      cta: null,
      features: [...baseFeatures, `${chosenSize.users}`],
    }
  }
  if (isPaid) {
    return { name:"Business", price:"Betaald", priceSuffix:"kies een pakket", cta:null, features: baseFeatures }
  }
  if (isFreePermanent(segId)) {
    return { name:"Business", price:"Gratis", priceSuffix:"doorlopend", cta:"Gratis toegang — onder voorbehoud van validatie", features: baseFeatures }
  }
  return { name:"Business", price:"Gratis", priceSuffix:"6 maanden", cta:"6 maanden gratis proefperiode", features: baseFeatures }
}

/* ─── 2-year trial check (demo): e-mails starting with "trial@" ────── */
function hadRecentTrial(email) { return email.toLowerCase().startsWith("trial@") }

/* ─── Component ────────────────────────────────────────────────────────── */
export default function BusinessFlow({ onComplete, onBack, onGoLogin }) {
  const { t } = useLang()
  const [step, setStep]             = useState("email")
  const [email, setEmail]           = useState("")
  const [firstName, setFirstName]   = useState("")
  const [lastName, setLastName]     = useState("")
  const [jobRole, setJobRole]       = useState("")
  const [password, setPassword]     = useState("")
  const [segment, setSegment]       = useState(null)
  const [orgType, setOrgType]       = useState(null)
  const [company, setCompany]       = useState({ kvk:"", name:"", street:"", number:"", addition:"", zip:"", city:"", country:"NL", vat:"" })
  const [inviteEmails, setInviteEmails] = useState(["",""])
  const [agreed, setAgreed]         = useState(false)

  // Paid flow states
  const [isPaidFlow, setIsPaidFlow] = useState(false)
  const [chosenSize, setChosenSize] = useState(null)
  const [xlUserCount, setXlUserCount] = useState("")

  // Steps differ based on paid vs free flow
  // Free:  email → segment → type → company → overview → invite → done
  // Paid:  email → trial_blocked → size_picker → segment → type → company → overview → payment → invite → done
  const STEP_NUM_FREE = { email:1, segment:2, type:3, company:4, overview:5, invite:6, done:7 }
  const STEP_NUM_PAID = { email:1, trial_blocked:1, size_picker:2, segment:3, type:4, company:5, overview:6, payment:7, invite:8, done:9 }
  const stepMap = isPaidFlow ? STEP_NUM_PAID : STEP_NUM_FREE
  const TOTAL   = isPaidFlow ? 9 : 7
  const curr    = stepMap[step] || 1

  const selectedSegment = SEGMENTS.find(s => s.id === segment?.id)
  const sidebar = getSidebarMeta(segment?.id, isPaidFlow, chosenSize, parseInt(xlUserCount) || 16)

  function handleCompanyChange(f, v) { setCompany(prev => ({ ...prev, [f]: v })) }

  function handleEmailSubmit(e) {
    e.preventDefault()
    if (hadRecentTrial(email)) { setIsPaidFlow(true); setStep("trial_blocked"); return }
    setStep("segment")
  }

  function handleSegmentNext() {
    if (!segment) return
    if (selectedSegment?.types?.length > 0) { setOrgType(null); setStep("type") }
    else setStep("company")
  }

  function handleTypeNext() {
    if (!orgType) return
    setStep("company")
  }

  function handleSizeNext() {
    if (!chosenSize) return
    setStep("segment")
  }

  // XL price calculation
  const xlCount = parseInt(xlUserCount) || 16
  const xlPrice = xlCount * (BUSINESS_SIZES.find(s => s.id === "XL")?.perUser || 9)

  /* ── Done page (full-width, no sidebar) ────────────────────────────── */
  if (step === "done") {
    return (
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"100vh" }}>
        <div style={{ padding:"3rem 4rem", display:"flex", flexDirection:"column", justifyContent:"center", background:C.white, position:"relative" }}>
          <div style={{ position:"absolute", top:"2.5rem", left:"3rem" }}><IOLogo size={28} /></div>
          <div style={{ marginTop:"2rem" }}>
            <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", marginBottom:"0.75rem" }}>
              Welkom bij Investment Officer
            </h1>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, marginBottom:"1rem", lineHeight:"var(--lh-body)" }}>
              {isPaidFlow ? (
                <>Uw Business {chosenSize?.label || ""} regeling voor <strong>{company.name || "uw organisatie"}</strong> is geactiveerd. U heeft nu toegang voor {chosenSize?.users || "uw team"}.</>
              ) : isFreePermanent(segment?.id) ? (
                <>Uw Business regeling voor <strong>{company.name || "uw organisatie"}</strong> is geactiveerd. Als organisatie in het segment {segment?.name || ""} heeft u gratis doorlopende toegang, onder voorbehoud van validatie.</>
              ) : (
                <>Uw Business regeling voor <strong>{company.name || "uw organisatie"}</strong> is geactiveerd. Uw organisatie heeft 6 maanden gratis toegang. Daarna ontvangt u een aanbieding op maat.</>
              )}
            </p>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray500, marginBottom:"2rem", fontStyle:"italic" }}>
              U ontvangt een bevestiging per e-mail op <strong>{email}</strong>.
            </p>
            <div style={{ display:"flex", gap:"1rem" }}>
              <button className="btn-navy" style={{ padding:"0.875rem 2rem", fontSize:"1rem" }} onClick={onComplete}>Naar de website</button>
              <button className="btn-secondary" style={{ padding:"0.875rem 2rem", fontSize:"1rem" }} onClick={onComplete}>Naar mijn dashboard</button>
            </div>
          </div>
        </div>
        <div style={{ position:"relative", overflow:"hidden", background:`linear-gradient(135deg,${C.navy},#1B3A5C)` }}>
          <img src="/images/beeld_onboarding_welcome.png" alt="" style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0 }} onError={e => { e.target.style.display="none" }} />
        </div>
      </div>
    )
  }

  return (
    <div className="reg-layout">
      <TopProgressBar total={TOTAL} current={curr} />
      <AuthNav onBack={onBack} />
      <div className="reg-container">
        <div className="reg-main">

          {/* ── STAP 1: E-mail + Profiel ── */}
          {step === "email" && (
            <>
              <h2 className="reg-step-title">{t("bf_email_title")}</h2>
              <p className="reg-step-sub">{t("bf_email_sub")}</p>
              <div className="demo-hint">
                <strong>Demo:</strong> Gebruik <code>trial@bedrijf.nl</code> om de 2-jaar blokkade te testen (→ betaalde pakketten).
                Andere e-mails → gratis flow. Wealth / Institutional = doorlopend gratis · Overige = 6 maanden gratis.
              </div>
              <form onSubmit={handleEmailSubmit}>
                <div className="input-group">
                  <label className="input-label">{t("bf_email_label")}</label>
                  <input className="input-field" type="email" placeholder={t("bf_email_placeholder")} value={email} onChange={e => setEmail(e.target.value)} autoFocus required />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">{t("pf_firstname")}</label><input className="input-field" type="text" placeholder={t("pf_firstname")} value={firstName} onChange={e => setFirstName(e.target.value)} required /></div>
                  <div className="input-group"><label className="input-label">{t("pf_lastname")}</label><input className="input-field" type="text" placeholder={t("pf_lastname")} value={lastName} onChange={e => setLastName(e.target.value)} required /></div>
                </div>
                <div className="input-group">
                  <label className="input-label">{t("pf_jobrole")}</label>
                  <select className="input-field" value={jobRole} onChange={e => setJobRole(e.target.value)} required>
                    <option value="">{t("pf_jobrole_pick")}</option>
                    {JOB_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">{t("pf_password")}</label>
                  <input className="input-field" type="password" placeholder={t("pf_password_hint")} value={password} onChange={e => setPassword(e.target.value)} minLength={8} required />
                </div>
                <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.25rem" }}>
                  {t("bf_terms_intro")}{" "}
                  <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_terms_link")}</button>{" "}
                  {t("pf_privacy_and")}{" "}
                  <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_privacy_link")}.</button>
                </p>
                <button className="btn-green btn-full" type="submit">{t("bf_next")}</button>
              </form>
            </>
          )}

          {/* ── TRIAL BLOKKADE → door naar betaalde pakketten ── */}
          {step === "trial_blocked" && (
            <>
              <h2 className="reg-step-title">Geen gratis proefperiode beschikbaar</h2>
              <EmailChip email={email} onEdit={() => { setIsPaidFlow(false); setStep("email") }} />
              <div className="alert alert-warning" style={{ marginBottom:"1.25rem" }}>
                <strong>Uw organisatie heeft in de afgelopen 2 jaar al een gratis proefperiode gehad.</strong><br/>
                Een nieuwe gratis Business regeling is helaas niet mogelijk.
              </div>
              <div style={{ background:"rgba(78,213,150,0.08)", border:`1.5px solid ${C.green}`, borderRadius:10, padding:"1.25rem 1.5rem", marginBottom:"1.5rem" }}>
                <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1.05rem", color:C.navy, marginBottom:"0.5rem" }}>
                  Wel beschikbaar: betaalde Business regelingen
                </div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, lineHeight:"var(--lh-body)" }}>
                  Met een betaald Business abonnement krijgt uw team direct toegang tot Investment Officer. Kies het pakket dat past bij de omvang van uw team.
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-green btn-full" onClick={() => setStep("size_picker")}>Bekijk betaalde regelingen</button>
                <button className="btn-secondary btn-full" onClick={() => { setIsPaidFlow(false); setStep("email") }}>Probeer een ander e-mailadres</button>
              </div>
            </>
          )}

          {/* ── STAP 2 (paid): Pakketkeuze S/M/L/XL ── */}
          {step === "size_picker" && (
            <>
              <h2 className="reg-step-title">Kies een Business pakket</h2>
              <p className="reg-step-sub">Selecteer het pakket dat past bij de omvang van uw team. Alle pakketten geven volledige toegang tot Investment Officer.</p>
              {BUSINESS_SIZES.map(sz => (
                <div key={sz.id}>
                  <SelectionRow
                    selected={chosenSize?.id === sz.id}
                    onSelect={() => setChosenSize(sz)}
                    name={`${sz.label} — ${sz.users}`}
                    desc={sz.desc}
                    right={sz.id === "XL" ? (xlUserCount ? `€ ${(xlPrice).toLocaleString("nl-NL")},– /mnd` : sz.priceLabel) : `${sz.priceLabel} /mnd`}
                  />
                  {/* XL: extra invoerveld voor aantal gebruikers */}
                  {sz.id === "XL" && chosenSize?.id === "XL" && (
                    <div style={{ margin:"-0.25rem 0 0.75rem 2.75rem", padding:"1rem", background:C.gray50, borderRadius:6, border:`1px solid ${C.gray200}` }}>
                      <label className="input-label">Aantal gebruikers</label>
                      <input className="input-field" type="number" min="16" placeholder="16+" value={xlUserCount}
                        onChange={e => setXlUserCount(e.target.value)}
                        style={{ maxWidth:180, marginTop:"0.25rem" }} />
                      {xlUserCount && parseInt(xlUserCount) >= 16 && (
                        <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.navy, marginTop:"0.5rem" }}>
                          Totaal: <strong>€ {xlPrice.toLocaleString("nl-NL")},–</strong> per maand · <strong>€ {(xlPrice * 12).toLocaleString("nl-NL")},–</strong> per jaar
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Prijsoverzicht gekozen pakket */}
              {chosenSize && chosenSize.id !== "XL" && (
                <div style={{ background:C.gray50, borderRadius:6, border:`1px solid ${C.gray200}`, padding:"1rem 1.25rem", marginTop:"0.5rem", marginBottom:"0.5rem" }}>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.navy }}>
                    <strong>{chosenSize.label}</strong> · {chosenSize.users}<br/>
                    {chosenSize.priceLabel} per maand · <strong>€ {(chosenSize.monthlyPrice * 12).toLocaleString("nl-NL")},–</strong> per jaar (excl. btw)
                  </div>
                </div>
              )}

              <div className="reg-nav-bar" style={{ marginTop:"1rem" }}>
                <BackButton onClick={() => setStep("trial_blocked")} />
                <button className="btn-green btn-full" onClick={handleSizeNext} disabled={!chosenSize || (chosenSize.id === "XL" && (!xlUserCount || parseInt(xlUserCount) < 16))}>Verder</button>
              </div>
            </>
          )}

          {/* ── STAP: Segment ── */}
          {step === "segment" && (
            <>
              <h2 className="reg-step-title">{t("bf_segment_title")}</h2>
              <p className="reg-step-sub">{t("bf_segment_sub")}</p>
              {SEGMENTS.map(s => (
                <SelectionRow key={s.id} selected={segment?.id === s.id} onSelect={() => setSegment(s)} name={s.name} desc={s.desc} />
              ))}
              {segment && !isPaidFlow && (
                <div className="alert alert-info" style={{ marginTop:"1rem", fontSize:"0.85rem" }}>
                  {isFreePermanent(segment.id)
                    ? `Organisaties in ${segment.name} komen in aanmerking voor gratis doorlopende toegang (onder voorbehoud van validatie door onze redactie).`
                    : `Organisaties in ${segment.name} krijgen 6 maanden gratis toegang. Daarna volgt een aanbieding op maat.`
                  }
                </div>
              )}
              <div className="reg-nav-bar">
                <BackButton onClick={() => setStep(isPaidFlow ? "size_picker" : "email")} />
                <button className="btn-green btn-full" onClick={handleSegmentNext} disabled={!segment}>{t("bf_next")}</button>
              </div>
            </>
          )}

          {/* ── STAP: Organisatietype ── */}
          {step === "type" && selectedSegment && (
            <>
              <h2 className="reg-step-title">{t("bf_type_title")}</h2>
              <p className="reg-step-sub">{t("bf_type_sub")}</p>
              {selectedSegment.types.map(tp => (
                <SelectionRow key={tp.id} selected={orgType?.id === tp.id} onSelect={() => setOrgType(tp)} name={tp.name} desc={tp.desc} />
              ))}
              <div className="reg-nav-bar">
                <BackButton onClick={() => setStep("segment")} />
                <button className="btn-green btn-full" onClick={handleTypeNext} disabled={!orgType}>{t("bf_next")}</button>
              </div>
            </>
          )}

          {/* ── STAP: Bedrijfsgegevens ── */}
          {step === "company" && (
            <>
              <h2 className="reg-step-title">Bedrijfsgegevens</h2>
              <p className="reg-step-sub">Vul de gegevens van uw organisatie in.</p>
              <form onSubmit={e => { e.preventDefault(); setStep("overview") }}>
                <div className="input-group">
                  <label className="input-label">KvK-nummer</label>
                  <input className="input-field" type="text" placeholder="12345678" value={company.kvk} onChange={e => handleCompanyChange("kvk", e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Bedrijfsnaam</label>
                  <input className="input-field" type="text" placeholder="Bedrijfsnaam" value={company.name} onChange={e => handleCompanyChange("name", e.target.value)} required />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">Straatnaam</label><input className="input-field" type="text" placeholder="Straatnaam" value={company.street} onChange={e => handleCompanyChange("street", e.target.value)} required /></div>
                  <div className="input-group"><label className="input-label">Huisnr.</label><input className="input-field" type="text" placeholder="12" value={company.number} onChange={e => handleCompanyChange("number", e.target.value)} required /></div>
                  <div className="input-group"><label className="input-label">Toevoeging</label><input className="input-field" type="text" placeholder="A" value={company.addition} onChange={e => handleCompanyChange("addition", e.target.value)} /></div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">Postcode</label><input className="input-field" type="text" placeholder="0000 AA" value={company.zip} onChange={e => handleCompanyChange("zip", e.target.value)} required /></div>
                  <div className="input-group"><label className="input-label">Stad</label><input className="input-field" type="text" placeholder="Stad" value={company.city} onChange={e => handleCompanyChange("city", e.target.value)} required /></div>
                </div>
                <div className="input-group">
                  <label className="input-label">Land</label>
                  <select className="input-field" value={company.country} onChange={e => handleCompanyChange("country", e.target.value)}>
                    <option value="NL">Nederland</option>
                    <option value="BE">België</option>
                    <option value="DE">Duitsland</option>
                    <option value="FR">Frankrijk</option>
                    <option value="LU">Luxemburg</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">BTW-nummer</label>
                  <input className="input-field" type="text" placeholder="NL123456789B01" value={company.vat} onChange={e => handleCompanyChange("vat", e.target.value)} />
                </div>
                <div className="reg-nav-bar">
                  <BackButton onClick={() => setStep(selectedSegment?.types?.length > 0 ? "type" : "segment")} />
                  <button className="btn-green btn-full" type="submit">Verder</button>
                </div>
              </form>
            </>
          )}

          {/* ── STAP: Overzicht ── */}
          {step === "overview" && (
            <>
              <h2 className="reg-step-title">Overzicht</h2>
              <p className="reg-step-sub">Controleer uw gegevens en bevestig uw aanmelding.</p>

              {/* Persoonlijke gegevens */}
              <div style={{ border:`1px solid ${C.gray200}`, borderRadius:8, padding:"1.125rem 1.25rem", marginBottom:"0.75rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem" }}>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500 }}>1. Uw gegevens</span>
                  <button className="link-btn" style={{ fontSize:"0.8rem" }} onClick={() => setStep("email")}>Aanpassen</button>
                </div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy, lineHeight:1.6 }}>
                  {firstName} {lastName}<br/>{email}<br/>{jobRole}
                </div>
              </div>

              {/* Organisatie */}
              <div style={{ border:`1px solid ${C.gray200}`, borderRadius:8, padding:"1.125rem 1.25rem", marginBottom:"0.75rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem" }}>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500 }}>2. Uw organisatie</span>
                  <button className="link-btn" style={{ fontSize:"0.8rem" }} onClick={() => setStep("company")}>Aanpassen</button>
                </div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy, lineHeight:1.6 }}>
                  {company.name}<br/>
                  {company.street} {company.number}{company.addition ? ` ${company.addition}` : ""}, {company.zip} {company.city}<br/>
                  KvK: {company.kvk}{company.vat ? ` · BTW: ${company.vat}` : ""}
                </div>
              </div>

              {/* Segment & type */}
              <div style={{ border:`1px solid ${C.gray200}`, borderRadius:8, padding:"1.125rem 1.25rem", marginBottom:"0.75rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem" }}>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500 }}>3. Segment & type</span>
                  <button className="link-btn" style={{ fontSize:"0.8rem" }} onClick={() => setStep("segment")}>Aanpassen</button>
                </div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy, lineHeight:1.6 }}>
                  {segment?.name || "–"}{orgType ? ` — ${orgType.name}` : ""}
                </div>
              </div>

              {/* Regeling */}
              <div style={{ background:"rgba(78,213,150,0.08)", border:`1.5px solid ${C.green}`, borderRadius:8, padding:"1.125rem 1.25rem", marginBottom:"1.5rem" }}>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.green, marginBottom:"0.5rem" }}>
                  {isPaidFlow ? "4. Uw pakket" : "Uw regeling"}
                </div>
                {isPaidFlow ? (
                  <>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.25rem" }}>
                      <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1.125rem", color:C.navy }}>
                        Business {chosenSize?.label}
                      </div>
                      <button className="link-btn" style={{ fontSize:"0.8rem" }} onClick={() => setStep("size_picker")}>Aanpassen</button>
                    </div>
                    <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy, marginBottom:"0.25rem" }}>
                      {chosenSize?.users}
                    </div>
                    <div style={{ fontFamily:"var(--font-sans)", fontSize:"1rem", fontWeight:700, color:C.navy }}>
                      {chosenSize?.id === "XL"
                        ? `€ ${xlPrice.toLocaleString("nl-NL")},– per maand · € ${(xlPrice * 12).toLocaleString("nl-NL")},– per jaar`
                        : `${chosenSize?.priceLabel} per maand · € ${((chosenSize?.monthlyPrice || 0) * 12).toLocaleString("nl-NL")},– per jaar`
                      }
                    </div>
                    <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500, marginTop:"0.25rem" }}>Excl. btw · Jaarlijks gefactureerd via Stripe</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1.125rem", color:C.navy, marginBottom:"0.25rem" }}>
                      {isFreePermanent(segment?.id) ? "Gratis doorlopende toegang" : "6 maanden gratis toegang"}
                    </div>
                    <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500, lineHeight:"var(--lh-body)" }}>
                      {isFreePermanent(segment?.id)
                        ? "Als organisatie in " + (segment?.name || "") + " komt u in aanmerking voor gratis doorlopende toegang tot Investment Officer. Wij behouden het recht om te valideren of uw organisatie aan onze criteria voldoet."
                        : "Uw organisatie krijgt 6 maanden gratis toegang tot Investment Officer. Na afloop van de proefperiode ontvangt u een aanbieding op maat."
                      }
                    </div>
                  </>
                )}
              </div>

              {/* Voorwaarden checkbox */}
              <label style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start", marginBottom:"1.5rem", cursor:"pointer" }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop:3, accentColor:C.green }} />
                <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray700, lineHeight:"var(--lh-body)" }}>
                  Ik ga akkoord met de <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">algemene voorwaarden</button> en het <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">privacy statement</button>.
                </span>
              </label>

              <div className="reg-nav-bar">
                <BackButton onClick={() => setStep("company")} />
                <button className="btn-red btn-full" onClick={() => setStep(isPaidFlow ? "payment" : "invite")} disabled={!agreed}>
                  {isPaidFlow ? "Ga naar betaling" : "Account aanmaken"}
                </button>
              </div>
            </>
          )}

          {/* ── STAP (paid): Betaling (Stripe simulatie) ── */}
          {step === "payment" && (
            <>
              <h2 className="reg-step-title">Betaling</h2>
              <p className="reg-step-sub">Rond uw betaling af om uw Business {chosenSize?.label} regeling te activeren.</p>

              {/* Stripe-achtig kader */}
              <div style={{ border:`2px solid ${C.gray200}`, borderRadius:10, padding:"2rem", marginBottom:"1.5rem", background:C.white }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem", paddingBottom:"1rem", borderBottom:`1px solid ${C.gray200}` }}>
                  <div>
                    <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1rem", color:C.navy }}>Business {chosenSize?.label}</div>
                    <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500 }}>{chosenSize?.users} · {company.name}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"1.25rem", color:C.navy }}>
                      {chosenSize?.id === "XL"
                        ? `€ ${(xlPrice * 12).toLocaleString("nl-NL")},–`
                        : `€ ${((chosenSize?.monthlyPrice || 0) * 12).toLocaleString("nl-NL")},–`
                      }
                    </div>
                    <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.8rem", color:C.gray500 }}>per jaar excl. btw</div>
                  </div>
                </div>

                {/* Simulatie velden */}
                <div className="input-group">
                  <label className="input-label">Kaartnummer</label>
                  <input className="input-field" type="text" placeholder="4242 4242 4242 4242" disabled style={{ background:C.gray50 }} />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">Vervaldatum</label><input className="input-field" type="text" placeholder="12 / 28" disabled style={{ background:C.gray50 }} /></div>
                  <div className="input-group"><label className="input-label">CVC</label><input className="input-field" type="text" placeholder="123" disabled style={{ background:C.gray50 }} /></div>
                </div>

                <div className="demo-hint" style={{ marginTop:"0.5rem" }}>
                  <strong>Demo:</strong> Dit is een simulatie van het Stripe betaalscherm. In productie wordt hier een embedded Stripe Checkout getoond.
                </div>
              </div>

              <div className="reg-nav-bar">
                <BackButton onClick={() => setStep("overview")} />
                <button className="btn-red btn-full" onClick={() => setStep("invite")}>
                  Betaal € {chosenSize?.id === "XL"
                    ? (xlPrice * 12).toLocaleString("nl-NL")
                    : ((chosenSize?.monthlyPrice || 0) * 12).toLocaleString("nl-NL")
                  },– en activeer
                </button>
              </div>
            </>
          )}

          {/* ── STAP: Collega's uitnodigen ── */}
          {step === "invite" && (
            <>
              <h2 className="reg-step-title">Nodig collega's uit</h2>
              <p className="reg-step-sub">Uw Business account is aangemaakt. Nodig direct uw collega's uit zodat zij ook toegang krijgen.</p>
              <div className="alert alert-success">
                <strong>Uw Business regeling is geactiveerd</strong> voor {company.name || "uw organisatie"}.
                {isPaidFlow && chosenSize && (
                  <> U heeft het {chosenSize.label} pakket ({chosenSize.users}).</>
                )}
              </div>
              {inviteEmails.map((em,i) => (
                <div key={i} className="input-group">
                  <label className="input-label">Collega {i+1}</label>
                  <input className="input-field" type="email" placeholder="naam@bedrijf.nl" value={em}
                    onChange={e => { const arr = [...inviteEmails]; arr[i] = e.target.value; setInviteEmails(arr) }} />
                </div>
              ))}
              <button className="link-btn" style={{ marginBottom:"1.5rem", display:"block" }}
                onClick={() => setInviteEmails(prev => [...prev, ""])}>
                + Nog een collega toevoegen
              </button>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-green btn-full" onClick={() => setStep("done")}>Uitnodigingen versturen</button>
                <button className="btn-secondary btn-full" onClick={() => setStep("done")}>Overslaan, ik doe dit later</button>
              </div>
            </>
          )}

        </div>
        <div className="reg-sidebar">
          <RegSidebar
            planName={sidebar.name}
            planPrice={sidebar.price}
            planPriceSuffix={sidebar.priceSuffix}
            planFeatures={sidebar.features}
            planCta={sidebar.cta}
          />
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { C } from '../tokens.js'
import { JOB_ROLES } from '../data.js'
import { classifyEmailForReg } from '../utils.js'
import { TopProgressBar, RegSidebar, EmailChip, AuthNav, CheckItem, LangSwitcher } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'
import IOLogo from '../components/IOLogo.jsx'

// ─── Plan metadata (voor sidebar) ───────────────────────────────────────────
function planMeta(planId, t) {
  if (!planId) return {}
  const map = {
    freemium: { name: "Freemium",   price: null,                          cta: null,                                                        features: t("plan_freemium_features") || [] },
    trial:    { name: "Pro Trial",   price: t("plan_trial_price") + " " + (t("plan_trial_suffix") || ""), cta: t("sidebar_trial_cta"), features: t("plan_trial_features") || [] },
    pro:      { name: "Pro",         price: t("plan_pro_price") + " " + (t("plan_pro_suffix") || ""),     cta: null,                                                        features: t("plan_pro_features") || [] },
  }
  return map[planId] || {}
}

// ─── Volledige plan-keuze pagina (met groene CTA buttons) ───────────────────
function PlanPickerPage({ onSelect, onBack, t }) {
  const PLANS = [
    { id:"freemium", name:"Freemium", sub:t("plan_freemium_sub"), priceLabel:t("plan_freemium_price"), priceSuffix:"",                  cta:t("plan_freemium_cta"), ctaNote:t("plan_freemium_note"), features:t("plan_freemium_features")||[] },
    { id:"trial",    name:"Pro Trial", sub:t("plan_trial_sub"),   priceLabel:t("plan_trial_price"),    priceSuffix:t("plan_trial_suffix"), cta:t("plan_trial_cta"),   ctaNote:t("plan_trial_note"),   features:t("plan_trial_features")||[]   },
    { id:"pro",      name:"Pro",       sub:t("plan_pro_sub"),     priceLabel:t("plan_pro_price"),      priceSuffix:t("plan_pro_suffix"),   cta:t("plan_pro_cta"),     ctaNote:t("plan_pro_note"),     features:t("plan_pro_features")||[]     },
  ]
  return (
    <div style={{ minHeight:"100vh", background:C.white }}>
      <TopProgressBar total={4} current={2.5} />
      {/* Nav */}
      <header style={{ position:"sticky", top:4, zIndex:50, background:C.white, borderBottom:`1px solid ${C.gray100}`, boxShadow:"0 1px 6px rgba(12,24,46,0.06)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 1.5rem", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <IOLogo />
          <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
            <LangSwitcher />
            <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.gray500, display:"flex", alignItems:"center", gap:"0.375rem" }}>
              ← {t("pf_back") || "Terug"}
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
          <div style={{ display:"inline-block", background:C.gray100, borderRadius:99, padding:"0.3rem 1rem", fontFamily:"var(--font-sans)", fontSize:"0.8rem", fontWeight:600, color:C.gray500, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"1rem" }}>{t("sp_badge")}</div>
          <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(1.75rem,4vw,2.5rem)", fontWeight:700, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", color:C.navy, marginBottom:"1rem" }}>{t("sp_header")}</h1>
          <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, lineHeight:"var(--lh-body)" }}>{t("sp_header_sub")}</p>
        </div>

        <p style={{ textAlign:"center", fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray500, marginBottom:"2rem", lineHeight:"var(--lh-body)" }}>{t("sp_personal_intro")}</p>

        {/* Plan kaarten met groene CTA buttons */}
        <div className="sub-cards">
          {PLANS.map(p => (
            <div key={p.id} className="sub-card">
              <div className="sub-card-name">{p.name}</div>
              <div className="sub-card-sub">{p.sub}</div>
              <div>
                <span className="sub-card-price">{p.priceLabel}</span>
                {p.priceSuffix && <span className="sub-card-price-suffix"> {p.priceSuffix}</span>}
              </div>
              <button className="btn-green" style={{ marginTop:"1rem" }} onClick={() => onSelect(p.id)}>{p.cta}</button>
              <p className="sub-card-note">{p.ctaNote}</p>
              <div className="sub-card-features">
                <div className="sub-card-features-title">{t("sp_features_title")}</div>
                {p.features.map((f,i) => <CheckItem key={i}>{f}</CheckItem>)}
              </div>
              <button className="btn-outline" onClick={() => alert(`POC: ${p.name}`)}>{t("sp_all_features")}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PersonalFlow({ selectedPlan, onComplete, onBack, onGoLogin }) {
  const { t } = useLang()
  const [step, setStep]             = useState("email")
  const [email, setEmail]           = useState("")
  const [firstName, setFirstName]   = useState("")
  const [lastName, setLastName]     = useState("")
  const [jobRole, setJobRole]       = useState("")
  const [password, setPassword]     = useState("")
  const [chosenPlan, setChosenPlan] = useState(selectedPlan || null)
  const [privateOverride, setPrivateOverride] = useState(false)

  const totalSteps  = chosenPlan === "pro" ? 4 : 3
  const STEP_NUM    = { email:1, private_warning:1, generic_block:1, existing:1, enterprise:1, whitelist:1, profile:2, plan:3, payment:3, confirm:4, done:4 }
  const currentStep = STEP_NUM[step] || 1

  // Sidebar plan info
  const meta = planMeta(chosenPlan, t)

  function handleEmailSubmit(e) {
    e.preventDefault()
    const type = classifyEmailForReg(email)
    if (type === "generic")                     { setStep("generic_block"); return }
    if (type === "private" && !privateOverride)  { setStep("private_warning"); return }
    if (type === "existing")                    { setStep("existing"); return }
    if (type === "enterprise")                  { setStep("enterprise"); return }
    if (type === "whitelist")                   { setStep("whitelist"); return }
    setStep("profile")
  }

  function handleProfileSubmit(e) {
    e.preventDefault()
    if (chosenPlan) setStep(chosenPlan === "pro" ? "payment" : "confirm")
    else setStep("plan")
  }

  function handlePlanSelect(planId) {
    setChosenPlan(planId)
    setStep(planId === "pro" ? "payment" : "confirm")
  }

  // ── Done: designer bevestigingspagina ────────────────────────────────────────
  if (step === "done") {
    const items = t("ob_confirm_items")
    const titleNl = chosenPlan === "pro" ? t("pf_done_pro") : chosenPlan === "trial" ? t("pf_done_trial") : t("pf_done_free")
    return (
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"100vh" }}>
        {/* Links */}
        <div style={{ padding:"3rem 4rem", display:"flex", flexDirection:"column", justifyContent:"center", background:C.white, position:"relative" }}>
          <div style={{ position:"absolute", top:"2.5rem", left:"3rem" }}>
            <IOLogo size={28} />
          </div>
          <div style={{ marginTop:"2rem" }}>
            <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:700, color:C.navy, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", marginBottom:"0.75rem" }}>
              {titleNl}
            </h1>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9375rem", color:C.gray500, marginBottom:"2rem", lineHeight:"var(--lh-body)" }}>
              {chosenPlan === "pro" ? t("pf_done_body_pro") : chosenPlan === "trial" ? t("pf_done_body_trial") : t("pf_done_body_free")}
            </p>
            <div style={{ marginBottom:"2rem" }}>
              <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.875rem" }}>{t("ob_what_now")}</div>
              {(Array.isArray(items) ? items : []).map(item => (
                <div key={item} style={{ display:"flex", alignItems:"center", gap:"0.625rem", marginBottom:"0.625rem" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.8125rem", color:C.gray500, marginBottom:"2rem", fontStyle:"italic" }}>
              {t("pf_done_confirm")} <strong>{email}</strong>.
            </p>
            <div style={{ display:"flex", gap:"1rem" }}>
              <button className="btn-navy" style={{ padding:"0.875rem 2rem", fontSize:"1rem" }} onClick={onComplete}>{t("ob_to_website")}</button>
              <button className="btn-secondary" style={{ padding:"0.875rem 2rem", fontSize:"1rem" }} onClick={() => { onComplete(); }}>{t("ob_to_dashboard")}</button>
            </div>
          </div>
        </div>
        {/* Rechts — grote foto */}
        <div style={{ position:"relative", overflow:"hidden", background:`linear-gradient(135deg,${C.navy},#1B3A5C)` }}>
          <img src="/images/beeld_onboarding_welcome.png" alt="" style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0 }} />
        </div>
      </div>
    )
  }
  if (step === "plan") {
    return <PlanPickerPage onSelect={handlePlanSelect} onBack={() => setStep("profile")} t={t} />
  }

  return (
    <div className="reg-layout">
      <TopProgressBar total={totalSteps} current={currentStep} />
      <AuthNav onBack={onBack} />
      <div className="reg-container">
        <div className="reg-main">

          {/* ── E-mail ── */}
          {step === "email" && (
            <>
              <h2 className="reg-step-title">{t("pf_email_title")}</h2>
              <p className="reg-step-sub">{t("pf_email_sub")}</p>
              <div className="demo-hint">
                <strong>Demo:</strong> info@aegon.com · nieuw@gmail.com · demo@abnamro.com · nieuw@abnamro.com · nieuw@wealthpro.com · nieuw@aegon.com
              </div>
              <form onSubmit={handleEmailSubmit}>
                <div className="input-group">
                  <label className="input-label">{t("pf_email_label")}</label>
                  <input className="input-field" type="email" placeholder={t("pf_email_placeholder")} value={email} onChange={e => setEmail(e.target.value)} autoFocus required />
                </div>
                <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.85rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.25rem" }}>
                  {t("pf_email_terms")}{" "}
                  <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_terms_link")}</button>{" "}
                  {t("pf_privacy_and")}{" "}
                  <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button">{t("pf_privacy_link")}.</button>
                </p>
                <button className="btn-green btn-full" type="submit">{t("pf_check_email")}</button>
              </form>
            </>
          )}

          {/* ── Generiek geblokkeerd ── */}
          {step === "generic_block" && (
            <>
              <h2 className="reg-step-title">{t("pf_generic_title")}</h2>
              <EmailChip email={email} onEdit={() => { setStep("email"); setPrivateOverride(false) }} />
              <div className="alert alert-error">
                <strong>{t("pf_generic_alert")}</strong><br/>{t("pf_generic_body")}
              </div>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray700, marginBottom:"1.5rem", lineHeight:"var(--lh-body)" }}>{t("pf_generic_sub")}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-primary btn-full" onClick={() => setStep("email")}>{t("pf_generic_other")}</button>
                <button className="btn-secondary btn-full" onClick={onBack}>{t("pf_generic_biz")}</button>
              </div>
            </>
          )}

          {/* ── Privé waarschuwing ── */}
          {step === "private_warning" && (
            <>
              <h2 className="reg-step-title">{t("pf_private_title")}</h2>
              <EmailChip email={email} onEdit={() => { setStep("email"); setPrivateOverride(false) }} />
              <div className="alert alert-warning">
                <strong>{t("pf_private_alert")}</strong><br/>{t("pf_private_body1")}
              </div>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray700, marginBottom:"1.25rem", lineHeight:"var(--lh-body)" }}>{t("pf_private_body2")}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-primary btn-full" onClick={() => { setPrivateOverride(true); setStep("profile") }}>{t("pf_private_continue")}</button>
                <button className="btn-secondary btn-full" onClick={() => setStep("email")}>{t("pf_private_other")}</button>
              </div>
            </>
          )}

          {/* ── Bestaand account ── */}
          {step === "existing" && (
            <>
              <h2 className="reg-step-title">{t("pf_existing_title")}</h2>
              <EmailChip email={email} onEdit={() => setStep("email")} />
              <div className="alert alert-warning">{t("pf_existing_body")}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem", marginTop:"1rem" }}>
                <button className="btn-primary btn-full" onClick={onGoLogin}>{t("pf_existing_login")}</button>
                <button className="btn-secondary btn-full" onClick={() => setStep("email")}>{t("pf_existing_other")}</button>
              </div>
            </>
          )}

          {/* ── Enterprise ── */}
          {step === "enterprise" && (
            <>
              <h2 className="reg-step-title">{t("pf_enterprise_title")}</h2>
              <EmailChip email={email} onEdit={() => setStep("email")} />
              <div className="alert alert-success">{t("pf_enterprise_body")}</div>
              <button className="btn-primary btn-full" style={{ marginTop:"1rem" }} onClick={onComplete}>{t("pf_enterprise_access")}</button>
            </>
          )}

          {/* ── Whitelist ── */}
          {step === "whitelist" && (
            <>
              <h2 className="reg-step-title">{t("pf_whitelist_title")}</h2>
              <EmailChip email={email} onEdit={() => setStep("email")} />
              <div className="alert alert-success">{t("pf_whitelist_body")}</div>
              <button className="btn-primary btn-full" style={{ marginTop:"1rem" }} onClick={() => setStep("profile")}>{t("pf_whitelist_cta")}</button>
            </>
          )}

          {/* ── Profiel ── */}
          {step === "profile" && (
            <>
              <h2 className="reg-step-title">{t("pf_profile_title")}</h2>
              <p className="reg-step-sub">{t("pf_profile_sub")}</p>
              <EmailChip email={email} onEdit={() => setStep("email")} />
              <form onSubmit={handleProfileSubmit}>
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
                <div className="input-group"><label className="input-label">{t("pf_password")}</label><input className="input-field" type="password" placeholder={t("pf_password_hint")} value={password} onChange={e => setPassword(e.target.value)} minLength={8} required /></div>
                <button className="btn-green btn-full" type="submit">{chosenPlan ? t("pf_profile_next") : t("pf_profile_create")}</button>
              </form>
            </>
          )}

          {/* ── Betaling ── */}
          {step === "payment" && (
            <>
              <h2 className="reg-step-title">{t("pf_payment_title")}</h2>
              <p className="reg-step-sub">{t("pf_payment_sub")}</p>
              <div className="alert alert-info" style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                <span style={{ fontSize:"1.25rem" }}>🔒</span>
                <span>{t("pf_payment_secure")} <strong>Stripe</strong>.</span>
              </div>
              <form onSubmit={e => { e.preventDefault(); setStep("confirm") }}>
                <div className="input-group"><label className="input-label">{t("pf_card_number")}</label><input className="input-field" type="text" defaultValue="4242 4242 4242 4242" required /></div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">{t("pf_card_expiry")}</label><input className="input-field" type="text" defaultValue="12/28" required /></div>
                  <div className="input-group"><label className="input-label">{t("pf_card_cvv")}</label><input className="input-field" type="text" defaultValue="123" required /></div>
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem" }}>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"1rem", fontWeight:700, color:C.navy }}>{t("pf_payment_total")}</span>
                  <span style={{ fontFamily:"var(--font-sans)", fontSize:"1.25rem", fontWeight:700, color:C.navy }}>€ 649,–</span>
                </div>
                <button className="btn-red btn-full" type="submit">{t("pf_payment_cta")}</button>
              </form>
              <button className="btn-secondary btn-full" style={{ marginTop:"0.75rem" }} onClick={() => setStep("plan")}>{t("pf_payment_back")}</button>
            </>
          )}

          {/* ── Bevestiging ── */}
          {step === "confirm" && (
            <>
              <h2 className="reg-step-title">{t("pf_confirm_title")}</h2>
              <p className="reg-step-sub">{t("pf_confirm_sub")}</p>
              {[
                { label: t("pf_confirm_data"), items:[email, `${firstName} ${lastName}`, jobRole], back:"profile" },
                { label: t("pf_confirm_plan"), items:[chosenPlan === "freemium" ? t("pf_plan_freemium") : chosenPlan === "trial" ? t("pf_plan_trial") : t("pf_plan_pro")], back:"plan" },
                ...(chosenPlan === "pro" ? [{ label: t("pf_confirm_pay"), items:[t("pf_confirm_stripe")], back:"payment" }] : []),
              ].map((section, i) => (
                <div key={i} style={{ border:`1px solid ${C.gray200}`, borderRadius:6, padding:"1rem 1.25rem", marginBottom:"0.75rem" }}>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.5rem", display:"flex", justifyContent:"space-between" }}>
                    {section.label}
                    <button className="link-btn" style={{ fontSize:"0.8rem", textTransform:"none", letterSpacing:0 }} onClick={() => setStep(section.back)}>{t("pf_confirm_edit")}</button>
                  </div>
                  {section.items.map((item,j) => <div key={j} style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.navy }}>{item}</div>)}
                </div>
              ))}
              {chosenPlan === "trial" && <div className="alert alert-warning" style={{ marginTop:"1rem" }}>{t("pf_confirm_trial_warn")}</div>}
              <button className="btn-red btn-full" style={{ marginTop:"1rem" }} onClick={() => setStep("done")}>
                {chosenPlan === "pro" ? t("pf_confirm_pro") : t("pf_confirm_free")}
              </button>
            </>
          )}

        </div>
        <div className="reg-sidebar">
          <RegSidebar
            planName={meta.name}
            planPrice={meta.price}
            planFeatures={meta.features}
            planCta={meta.cta}
          />
        </div>
      </div>
    </div>
  )
}

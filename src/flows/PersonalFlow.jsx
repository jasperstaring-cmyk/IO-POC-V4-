import { useState } from 'react'
import { C } from '../tokens.js'
import { JOB_ROLES } from '../data.js'
import { classifyEmailForReg } from '../utils.js'
import { TopProgressBar, RegSidebar, EmailChip, AuthNav, CheckItem } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'
import IOLogo from '../components/IOLogo.jsx'

// ─── Plan metadata (voor sidebar) ───────────────────────────────────────────
function planMeta(planId, t) {
  if (!planId) return {}
  const map = {
    freemium: { name: t("plan_freemium_name"),  price: null,                          cta: null,                                                        features: t("plan_freemium_features") || [] },
    trial:    { name: t("plan_trial_name"),     price: t("plan_trial_price") + " " + (t("plan_trial_suffix") || ""), cta: t("sidebar_trial_cta"), features: t("plan_trial_features") || [] },
    pro:      { name: t("plan_pro_name"),       price: t("plan_pro_price") + " " + (t("plan_pro_suffix") || ""),     cta: null,                                                        features: t("plan_pro_features") || [] },
  }
  return map[planId] || {}
}

export default function PersonalFlow({ selectedPlan, onComplete, onBack, onGoLogin }) {
  const { t } = useLang()
  const [step, setStep]             = useState("email")
  const [email, setEmail]           = useState("")
  const [firstName, setFirstName]   = useState("")
  const [lastName, setLastName]     = useState("")
  const [jobRole, setJobRole]       = useState("")
  const [password, setPassword]     = useState("")
  const [chosenPlan, setChosenPlan] = useState(selectedPlan || "freemium")
  const [privateOverride, setPrivateOverride] = useState(false)

  const totalSteps  = chosenPlan === "pro" ? 4 : 3
  const STEP_NUM    = { email:1, private_warning:1, generic_block:1, existing:1, enterprise:1, whitelist:1, profile:2, payment:3, confirm:3, done:4 }
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
    setStep(chosenPlan === "pro" ? "payment" : "confirm")
  }

  // Plan is al gekozen op de PlanPickerPage

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
              <button className="btn-secondary btn-full" style={{ marginTop:"0.75rem" }} onClick={onBack}>{t("pf_payment_back")}</button>
            </>
          )}

          {/* ── Bevestiging ── */}
          {step === "confirm" && (
            <>
              <h2 className="reg-step-title">{t("pf_confirm_title")}</h2>
              <p className="reg-step-sub">{t("pf_confirm_sub")}</p>
              {[
                { label: t("pf_confirm_data"), items:[email, `${firstName} ${lastName}`, jobRole], back:"profile" },
                { label: t("pf_confirm_plan"), items:[chosenPlan === "freemium" ? t("pf_plan_freemium") : chosenPlan === "trial" ? t("pf_plan_trial") : t("pf_plan_pro")], back:"_planpicker" },
                ...(chosenPlan === "pro" ? [{ label: t("pf_confirm_pay"), items:[t("pf_confirm_stripe")], back:"payment" }] : []),
              ].map((section, i) => (
                <div key={i} style={{ border:`1px solid ${C.gray200}`, borderRadius:6, padding:"1rem 1.25rem", marginBottom:"0.75rem" }}>
                  <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.5rem", display:"flex", justifyContent:"space-between" }}>
                    {section.label}
                    <button className="link-btn" style={{ fontSize:"0.8rem", textTransform:"none", letterSpacing:0 }} onClick={() => section.back === "_planpicker" ? onBack() : setStep(section.back)}>{t("pf_confirm_edit")}</button>
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

import { useState } from 'react'
import { C } from '../tokens.js'
import { SEGMENTS, PRODUCT_C_VARIANTS, JOB_ROLES } from '../data.js'
import { ProgressBar, RegSidebar, SelectionRow, EmailChip, BackButton, AuthNav } from '../components/shared.jsx'
import { useLang } from '../LanguageContext.jsx'

export default function BusinessFlow({ onComplete, onBack, onGoLogin }) {
  const { t } = useLang()
  const [step, setStep]           = useState("email")
  const [email, setEmail]         = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName]   = useState("")
  const [jobRole, setJobRole]     = useState("")
  const [password, setPassword]   = useState("")
  const [segment, setSegment]     = useState(null)
  const [orgType, setOrgType]     = useState(null)
  const [variant, setVariant]     = useState(null)
  const [userCount, setUserCount] = useState("")
  const [company, setCompany]     = useState({ name:"", street:"", number:"", zip:"", city:"", country:"NL", kvk:"", vat:"" })
  const [inviteEmails, setInviteEmails] = useState(["",""])

  const STEP_NUM = { email:1, segment:2, type:3, product_a_info:4, product_c_variant:4, company:5, kvk_check:5, kvk_degraded:5, invite:6, done:6 }
  const TOTAL    = 6
  const curr     = STEP_NUM[step] || 1

  const selectedSegment = SEGMENTS.find(s => s.id === segment?.id)
  const isPlaceholder   = selectedSegment?.product === "placeholder"

  function handleSegmentNext() {
    if (!segment) return
    if (isPlaceholder) { alert(`POC: De flow voor "${segment.name}" wordt in een volgende iteratie uitgewerkt.`); return }
    setOrgType(null); setStep("type")
  }

  function handleTypeNext() {
    if (!orgType) return
    if (segment.id === "wealth") setStep("product_a_info")
    else setStep("product_c_variant")
  }

  function handleCompanyChange(field, val) {
    setCompany(prev => ({ ...prev, [field]: val }))
  }

  function handleKvkValidation(pass) {
    if (pass) setStep("invite")
    else setStep("kvk_degraded")
  }

  const xlPrice = userCount ? Math.max(16, parseInt(userCount) || 16) * 108 : null

  return (
    <div className="reg-layout">
      <AuthNav onBack={onBack} />
      <div className="reg-container">
        <div className="reg-main">
          <ProgressBar total={TOTAL} current={curr} />

          {/* ── Stap 1: Gegevens ── */}
          {step === "email" && (
            <>
              <h2 className="reg-step-title">{t("bf_email_title")}</h2>
              <p className="reg-step-sub">{t("bf_email_sub")}</p>
              <div className="demo-hint">
                <strong>Demo:</strong> Segment Wealth Management → Product A · KvK <strong>99…</strong> → Product B · Asset Management → Product C
              </div>
              <form onSubmit={e => { e.preventDefault(); setStep("segment") }}>
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
                <button className="btn-primary btn-full" type="submit">{t("bf_next")}</button>
              </form>
            </>
          )}

          {/* ── Stap 2: Segment ── */}
          {step === "segment" && (
            <>
              <h2 className="reg-step-title">{t("bf_segment_title")}</h2>
              <p className="reg-step-sub">{t("bf_segment_sub")}</p>
              {SEGMENTS.map(s => (
                <SelectionRow key={s.id} selected={segment?.id === s.id} onSelect={() => setSegment(s)} name={s.name} desc={s.desc} />
              ))}
              <div className="reg-nav-bar">
                <BackButton onClick={() => setStep("email")} />
                <button className="btn-primary btn-full" onClick={handleSegmentNext} disabled={!segment}>{t("bf_next")}</button>
              </div>
            </>
          )}

          {/* ── Stap 3: Type ── */}
          {step === "type" && selectedSegment && (
            <>
              <h2 className="reg-step-title">{t("bf_type_title")}</h2>
              <p className="reg-step-sub">{t("bf_type_sub")}</p>
              {selectedSegment.types.map(tp => (
                <SelectionRow key={tp.id} selected={orgType?.id === tp.id} onSelect={() => setOrgType(tp)} name={tp.name} desc={tp.desc} />
              ))}
              <div className="reg-nav-bar">
                <BackButton onClick={() => setStep("segment")} />
                <button className="btn-primary btn-full" onClick={handleTypeNext} disabled={!orgType}>{t("bf_next")}</button>
              </div>
            </>
          )}

          {/* ── Stap 4a: Product A ── */}
          {step === "product_a_info" && (
            <>
              <h2 className="reg-step-title">{t("bf_product_a_title")}</h2>
              <p className="reg-step-sub">{t("bf_product_a_sub")}</p>
              <div className="alert alert-success">
                <strong>{t("bf_product_a_alert")}</strong><br/>{t("bf_product_a_body")}
              </div>
              <div style={{ border:`1px solid ${C.gray200}`, borderRadius:8, padding:"1.25rem 1.5rem", marginBottom:"1.5rem" }}>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.75rem" }}>{t("bf_what_you_get")}</div>
                {(t("bf_product_a_features") || []).map((f,i) => (
                  <div key={i} style={{ display:"flex", gap:"0.5rem", marginBottom:"0.4rem" }}>
                    <span style={{ color:C.green }}>✓</span>
                    <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.navy }}>{f}</span>
                  </div>
                ))}
              </div>
              <div className="alert alert-warning" style={{ fontSize:"0.85rem" }}>
                <strong>{t("lang") === "en" ? "Please note:" : "Let op:"}</strong> {t("bf_product_a_warn")}
              </div>
              <div className="reg-nav-bar">
                <BackButton onClick={() => setStep("type")} />
                <button className="btn-primary btn-full" onClick={() => setStep("company")}>{t("bf_product_a_next")}</button>
              </div>
            </>
          )}

          {/* ── Stap 4b: Product C ── */}
          {step === "product_c_variant" && (
            <>
              <h2 className="reg-step-title">{t("bf_product_c_title")}</h2>
              <p className="reg-step-sub">{t("bf_product_c_sub")}</p>
              {PRODUCT_C_VARIANTS.map(v => (
                <div key={v.id}>
                  <SelectionRow selected={variant?.id === v.id} onSelect={() => setVariant(v)} name={`${v.label} — ${v.users}`} right={v.priceLabel + " /" + t("bf_per_year")} />
                  {v.id === "XL" && variant?.id === "XL" && (
                    <div style={{ margin:"-0.25rem 0 0.625rem 2.75rem", padding:"0.875rem 1rem", background:C.gray50, borderRadius:6, border:`1px solid ${C.gray200}` }}>
                      <label className="input-label">{t("bf_product_c_users")}</label>
                      <input className="input-field" type="number" min="16" placeholder="16+" value={userCount} onChange={e => setUserCount(e.target.value)} style={{ maxWidth:180, marginTop:"0.25rem" }} />
                      {xlPrice && (
                        <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.navy, marginTop:"0.5rem" }}>
                          {t("bf_product_c_price")}: <strong>€ {xlPrice.toLocaleString("nl-NL")},–</strong> / {t("bf_per_year")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="reg-nav-bar">
                <BackButton onClick={() => setStep("type")} />
                <button className="btn-primary btn-full" onClick={() => setStep("company")} disabled={!variant}>{t("bf_next_company")}</button>
              </div>
            </>
          )}

          {/* ── Stap 5: Bedrijfsgegevens ── */}
          {step === "company" && (
            <>
              <h2 className="reg-step-title">{t("bf_company_title")}</h2>
              <p className="reg-step-sub">{t("bf_company_sub")}</p>
              <form onSubmit={e => { e.preventDefault(); setStep("kvk_check") }}>
                <div className="input-group">
                  <label className="input-label">{t("bf_company_name")}</label>
                  <input className="input-field" type="text" placeholder={t("bf_company_name_ph")} value={company.name} onChange={e => handleCompanyChange("name", e.target.value)} required />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">{t("bf_street")}</label><input className="input-field" type="text" placeholder={t("bf_street")} value={company.street} onChange={e => handleCompanyChange("street", e.target.value)} required /></div>
                  <div className="input-group"><label className="input-label">{t("bf_number")}</label><input className="input-field" type="text" placeholder="Nr." value={company.number} onChange={e => handleCompanyChange("number", e.target.value)} required /></div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">{t("bf_zip")}</label><input className="input-field" type="text" placeholder="1234 AB" value={company.zip} onChange={e => handleCompanyChange("zip", e.target.value)} required /></div>
                  <div className="input-group"><label className="input-label">{t("bf_city")}</label><input className="input-field" type="text" placeholder={t("bf_city")} value={company.city} onChange={e => handleCompanyChange("city", e.target.value)} required /></div>
                </div>
                <div className="input-group">
                  <label className="input-label">{t("bf_country")}</label>
                  <select className="input-field" value={company.country} onChange={e => handleCompanyChange("country", e.target.value)}>
                    {["NL","BE","DE","FR","LU"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 1rem" }}>
                  <div className="input-group"><label className="input-label">{t("bf_kvk")}</label><input className="input-field" type="text" placeholder="12345678" value={company.kvk} onChange={e => handleCompanyChange("kvk", e.target.value)} required /></div>
                  <div className="input-group"><label className="input-label">{t("bf_vat")}</label><input className="input-field" type="text" placeholder="NL123456789B01" value={company.vat} onChange={e => handleCompanyChange("vat", e.target.value)} required /></div>
                </div>
                <div className="reg-nav-bar">
                  <BackButton onClick={() => setStep(segment?.id === "wealth" ? "product_a_info" : "product_c_variant")} />
                  <button className="btn-primary btn-full" type="submit">{t("bf_validate")}</button>
                </div>
              </form>
            </>
          )}

          {/* ── KvK validatie ── */}
          {step === "kvk_check" && (
            <>
              <h2 className="reg-step-title">{t("bf_kvk_title")}</h2>
              <p className="reg-step-sub">{t("bf_kvk_sub")}</p>
              <div className="alert alert-info" style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                <span style={{ fontSize:"1.25rem" }}>🔍</span>
                <span>KvK: <strong>{company.kvk}</strong> — VAT: <strong>{company.vat}</strong></span>
              </div>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray700, marginBottom:"1.5rem", lineHeight:"var(--lh-body)" }}>{t("bf_kvk_simulate")}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-primary btn-full" onClick={() => handleKvkValidation(true)}>
                  {t("bf_kvk_pass")} {segment?.id === "wealth" ? "Product A (24 mnd)" : `Product C ${variant?.label || ""}`}
                </button>
                {segment?.id === "wealth" && (
                  <button className="btn-secondary btn-full" onClick={() => handleKvkValidation(false)}>{t("bf_kvk_fail")}</button>
                )}
              </div>
            </>
          )}

          {/* ── Degradatie ── */}
          {step === "kvk_degraded" && (
            <>
              <h2 className="reg-step-title">{t("bf_degraded_title")}</h2>
              <EmailChip email={email} onEdit={() => {}} />
              <div className="alert alert-warning">
                <strong>{t("bf_degraded_alert")}</strong><br/>{t("bf_degraded_body")}
              </div>
              <div style={{ border:`1px solid ${C.gray200}`, borderRadius:8, padding:"1.25rem 1.5rem", marginBottom:"1.5rem" }}>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.gray500, marginBottom:"0.5rem" }}>{t("bf_degraded_plan")}</div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"1.25rem", fontWeight:800, color:C.navy, marginBottom:"0.25rem" }}>{t("bf_degraded_name")}</div>
                <div style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray500, marginBottom:"0.75rem" }}>{t("bf_degraded_desc")}</div>
                {(t("bf_degraded_features") || []).map((f,i) => (
                  <div key={i} style={{ display:"flex", gap:"0.5rem", marginBottom:"0.375rem" }}>
                    <span style={{ color:C.green }}>✓</span>
                    <span style={{ fontFamily:"var(--font-sans)", fontSize:"0.875rem", color:C.navy }}>{f}</span>
                  </div>
                ))}
              </div>
              <button className="btn-primary btn-full" onClick={() => setStep("invite")}>{t("bf_degraded_cta")}</button>
            </>
          )}

          {/* ── Uitnodigen ── */}
          {step === "invite" && (
            <>
              <h2 className="reg-step-title">{t("bf_invite_title")}</h2>
              <p className="reg-step-sub">{t("bf_invite_sub")}</p>
              <div className="alert alert-success">
                <strong>{t("bf_invite_success")}</strong> {company.name || ""}
              </div>
              {inviteEmails.map((em,i) => (
                <div key={i} className="input-group">
                  <label className="input-label">{t("bf_invite_colleague")} {i+1}</label>
                  <input className="input-field" type="email" placeholder={t("bf_invite_ph")} value={em}
                    onChange={e => { const arr = [...inviteEmails]; arr[i] = e.target.value; setInviteEmails(arr) }} />
                </div>
              ))}
              <button className="link-btn" style={{ marginBottom:"1.5rem", display:"block" }}
                onClick={() => setInviteEmails(prev => [...prev, ""])}>
                {t("bf_invite_add")}
              </button>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-primary btn-full" onClick={() => setStep("done")}>{t("bf_invite_send")}</button>
                <button className="btn-secondary btn-full" onClick={() => setStep("done")}>{t("bf_invite_skip")}</button>
              </div>
            </>
          )}

          {/* ── Done ── */}
          {step === "done" && (
            <div style={{ textAlign:"center", padding:"1.5rem 0" }}>
              <div style={{ width:64, height:64, background:C.green, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.5rem" }}>
                <svg width="28" height="24" viewBox="0 0 28 24" fill="none"><path d="M2 11L10 19L26 3" stroke={C.navy} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h2 style={{ fontFamily:"var(--font-sans)", fontSize:"1.75rem", fontWeight:800, lineHeight:"var(--lh-heading)", letterSpacing:"var(--tracking-heading)", color:C.navy, marginBottom:"0.5rem" }}>
                {t("bf_done_title")}
              </h2>
              <p style={{ fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray500, lineHeight:"var(--lh-body)", marginBottom:"1.5rem" }}>
                {company.name || "–"} {t("bf_done_body")}
              </p>
              <div className="alert alert-success" style={{ textAlign:"left" }}>
                {t("bf_done_confirm")} <strong>{email}</strong>.
              </div>
              <button className="btn-primary btn-full" style={{ marginTop:"1rem" }} onClick={onComplete}>{t("bf_done_cta")}</button>
            </div>
          )}

        </div>
        <div className="reg-sidebar"><RegSidebar /></div>
      </div>
    </div>
  )
}

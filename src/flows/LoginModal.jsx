import { useState } from 'react'
import { C } from '../tokens.js'
import { classifyEmailForLogin } from '../utils.js'
import IOLogo from '../components/IOLogo.jsx'
import { EmailChip } from '../components/shared.jsx'
import { GoogleIcon, MicrosoftIcon } from '../components/SsoIcons.jsx'
import { useLang } from '../LanguageContext.jsx'

export default function LoginModal({ onClose, onGoRegister, onLoginSuccess }) {
  const { t } = useLang()
  const [step, setStep]         = useState("email")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")

  function handleEmailSubmit(e) {
    e.preventDefault()
    const type = classifyEmailForLogin(email)
    if (type === "private") { setStep("private_warning"); return }
    if (type === "sso")     { setStep("sso"); return }
    if (type === "unknown") { setStep("unknown"); return }
    setStep("password")
  }

  function handleLogin(e) {
    e.preventDefault()
    onLoginSuccess(email)
    onClose()
  }

  function resetToEmail() { setStep("email") }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <IOLogo size={22} />
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">

          {/* ── Email ── */}
          {step === "email" && (
            <>
              <div className="step-indicator" style={{ marginTop:"1.25rem" }}>
                <div className="step-dot active"/><div className="step-dot"/>
              </div>
              <h2 className="modal-title">{t("lm_title")}</h2>
              <p className="modal-subtitle">{t("lm_demo_hint")}</p>
              <form onSubmit={handleEmailSubmit}>
                <div className="input-group">
                  <label className="input-label">{t("lm_email_label")}</label>
                  <input className="input-field" type="email" placeholder={t("lm_email_ph")} value={email} onChange={e => setEmail(e.target.value)} autoFocus required />
                </div>
                <button className="btn-primary btn-full" type="submit">{t("lm_next")}</button>
              </form>
              <div className="divider">{t("lm_or")}</div>
              <button className="sso-btn"><GoogleIcon />{t("lm_google")}</button>
              <button className="sso-btn"><MicrosoftIcon />{t("lm_microsoft")}</button>
              <p style={{ textAlign:"center", marginTop:"1.25rem", fontFamily:"var(--font-sans)", fontSize:"0.9rem", color:C.gray500 }}>
                {t("lm_no_account")}{" "}<button className="link-btn" onClick={onGoRegister}>{t("lm_register")}</button>
              </p>
            </>
          )}

          {/* ── Privé waarschuwing ── */}
          {step === "private_warning" && (
            <>
              <div style={{ marginTop:"1.25rem" }}/>
              <h2 className="modal-title">{t("lm_private_title")}</h2>
              <EmailChip email={email} onEdit={resetToEmail} />
              <div className="alert alert-warning">
                <strong>{t("pf_private_alert")}</strong><br/>{t("lm_private_body")}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-primary btn-full" onClick={() => setStep("password")}>{t("pf_private_continue")}</button>
                <button className="btn-secondary btn-full" onClick={resetToEmail}>{t("lm_private_other")}</button>
              </div>
            </>
          )}

          {/* ── Geen account ── */}
          {step === "unknown" && (
            <>
              <div style={{ marginTop:"1.25rem" }}/>
              <h2 className="modal-title">{t("lm_unknown_title")}</h2>
              <EmailChip email={email} onEdit={resetToEmail} />
              <div className="alert alert-error">{t("lm_unknown_body")}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                <button className="btn-primary btn-full" onClick={() => { onClose(); onGoRegister() }}>{t("lm_unknown_register")}</button>
                <button className="btn-secondary btn-full" onClick={resetToEmail}>{t("lm_unknown_other")}</button>
              </div>
            </>
          )}

          {/* ── SSO ── */}
          {step === "sso" && (
            <>
              <div className="step-indicator" style={{ marginTop:"1.25rem" }}>
                <div className="step-dot active"/><div className="step-dot active"/>
              </div>
              <h2 className="modal-title">{t("lm_sso_title")}</h2>
              <EmailChip email={email} onEdit={resetToEmail} />
              <div className="alert alert-info">
                <strong>{t("lm_sso_body")}</strong>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem", marginBottom:"1.25rem" }}>
                <button className="sso-btn" onClick={handleLogin}><GoogleIcon />{t("lm_sso_cta")} (Google)</button>
                <button className="sso-btn" onClick={handleLogin}><MicrosoftIcon />{t("lm_sso_cta")} (Microsoft)</button>
              </div>
              <div className="divider">{t("lm_or")}</div>
              <button className="btn-secondary btn-full" onClick={() => setStep("password")}>{t("lm_login")}</button>
            </>
          )}

          {/* ── Wachtwoord ── */}
          {step === "password" && (
            <>
              <div className="step-indicator" style={{ marginTop:"1.25rem" }}>
                <div className="step-dot active"/><div className="step-dot active"/>
              </div>
              <h2 className="modal-title">{t("lm_sub")}</h2>
              <EmailChip email={email} onEdit={resetToEmail} />
              <form onSubmit={handleLogin}>
                <div className="input-group">
                  <label className="input-label">{t("lm_password_label")}</label>
                  <input className="input-field" type="password" placeholder={t("lm_password_ph")} value={password} onChange={e => setPassword(e.target.value)} autoFocus required />
                </div>
                <div style={{ textAlign:"right", marginBottom:"1.125rem" }}>
                  <button className="link-btn" style={{ fontSize:"0.85rem" }} type="button" onClick={() => setStep("forgot")}>{t("lm_forgot")}</button>
                </div>
                <button className="btn-primary btn-full" type="submit">{t("lm_login")}</button>
              </form>
            </>
          )}

          {/* ── Wachtwoord vergeten ── */}
          {step === "forgot" && (
            <>
              <div style={{ marginTop:"1.25rem" }}/>
              <h2 className="modal-title">{t("lm_forgot")}</h2>
              <form onSubmit={e => { e.preventDefault(); setStep("forgot_sent") }}>
                <div className="input-group">
                  <label className="input-label">{t("lm_email_label")}</label>
                  <input className="input-field" type="email" defaultValue={email} autoFocus required />
                </div>
                <button className="btn-primary btn-full" type="submit">{t("lm_next")}</button>
              </form>
              <button className="link-btn" style={{ marginTop:"1rem", display:"block", textAlign:"center", width:"100%" }} onClick={() => setStep("password")}>
                {t("lm_back")}
              </button>
            </>
          )}

          {/* ── Herstelmail verstuurd ── */}
          {step === "forgot_sent" && (
            <>
              <div style={{ textAlign:"center", marginTop:"1.75rem", marginBottom:"1.5rem" }}>
                <div style={{ width:56, height:56, background:C.green, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem" }}>
                  <svg width="24" height="20" viewBox="0 0 24 20" fill="none"><path d="M2 9L9 16L22 2" stroke={C.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h2 className="modal-title" style={{ textAlign:"center" }}>✓</h2>
              </div>
              <div className="alert alert-success">{t("pf_done_confirm")} <strong>{email}</strong>.</div>
              <button className="btn-secondary btn-full" style={{ marginTop:"1rem" }} onClick={onClose}>{t("acc_cancel")}</button>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

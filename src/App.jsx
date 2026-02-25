import { useState, useEffect, useCallback } from 'react'
import './styles/global.css'

import ArticlePage        from './pages/ArticlePage.jsx'
import SubscriptionPage   from './pages/SubscriptionPage.jsx'
import PlanPickerPage         from './pages/PlanPickerPage.jsx'
import BusinessPlanPickerPage from './pages/BusinessPlanPickerPage.jsx'
import AccountPage        from './pages/AccountPage.jsx'
import OnboardingPage     from './pages/OnboardingPage.jsx'
import AccountTypeChoice  from './flows/AccountTypeChoice.jsx'
import PersonalFlow       from './flows/PersonalFlow.jsx'
import BusinessFlow       from './flows/BusinessFlow.jsx'
import BusinessInternationalFlow from './flows/BusinessInternationalFlow.jsx'
import EnterpriseFlow     from './flows/EnterpriseFlow.jsx'
import LoginModal         from './flows/LoginModal.jsx'
import { useLang }        from './LanguageContext.jsx'

/* Valid view names that can be targeted via hash */
const VALID_VIEWS = new Set([
  "article","login","choice","plans","bizplans","subscriptions",
  "personal","business","bizintl","enterprise","onboarding","account",
])

export default function App() {
  const [view, setView]           = useState("article")
  const [modal, setModal]         = useState(null)
  const [loggedIn, setLoggedIn]   = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [activePlanType, setActivePlanType] = useState("freemium")
  const [userData, setUserData]   = useState({ firstName:"Jasper", lastName:"", email:"", jobRole:"Portfolio Manager", initials:"J" })

  const { setLang } = useLang()

  /* ── Hash routing ── */
  const handleHash = useCallback(() => {
    const hash = window.location.hash.replace("#", "")
    if (!hash) return

    // Language switch: #lang=de
    if (hash.startsWith("lang=")) {
      const code = hash.split("=")[1]
      if (["en","nl","de","fr"].includes(code)) {
        setLang(code)
      }
      // Clear hash so the pill can be clicked again
      history.replaceState(null, "", window.location.pathname)
      return
    }

    // View navigation: #login, #business, etc.
    if (VALID_VIEWS.has(hash)) {
      setView(hash)
      // Clear hash after navigating
      history.replaceState(null, "", window.location.pathname)
    }
  }, [setLang])

  useEffect(() => {
    // Handle initial hash on load
    handleHash()
    // Listen for hash changes (deep-link pills)
    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  }, [handleHash])


  /* ── Handlers ── */
  function handleLoginSuccess(email) {
    setLoggedIn(true)
    setUserEmail(email)
    const name = email.split("@")[0]
    const cap  = name.charAt(0).toUpperCase() + name.slice(1)
    setUserData({ firstName:cap, lastName:"", email, jobRole:"Portfolio Manager", initials:cap[0] })
  }

  function handleLogout() {
    setLoggedIn(false)
    setUserEmail("")
    setView("article")
  }

  function handleSelectPlan(planId) {
    setSelectedPlan(planId)
    setView("personal")
  }

  function handleRegComplete(isBusiness) {
    setLoggedIn(true)
    setUserEmail("new@example.com")
    setActivePlanType(isBusiness ? "business" : selectedPlan || "freemium")
    setUserData({ firstName:"New", lastName:"User", email:"new@example.com", jobRole:"Portfolio Manager", initials:"N" })
    setView("onboarding")
  }

  function handleGoLogin() { setModal(null); setView("login") }

  return (
    <>
      {view === "article" && (
        <ArticlePage
          loggedIn={loggedIn} userEmail={userEmail}
          onLogin={() => setView("login")}
          onSubscribe={() => setView("choice")}
          onLogout={handleLogout}
          onAccount={() => setView("account")}
        />
      )}
      {view === "subscriptions" && (
        <SubscriptionPage onStartReg={(trigger) => {
          if (trigger === "business") setView("business")
          else if (trigger && trigger.startsWith("personal_")) { setSelectedPlan(trigger.replace("personal_","")); setView("personal") }
          else setView("choice")
        }} onLogin={() => setView("login")} />
      )}
      {view === "choice" && (
        <AccountTypeChoice onChoose={t => setView(t==="business"?"bizplans":"plans")} onBack={() => setView("article")} />
      )}
      {view === "plans" && (
        <PlanPickerPage onSelectPlan={handleSelectPlan} onSwitchToBusiness={() => setView("bizplans")} onBack={() => setView("choice")} />
      )}
      {view === "bizplans" && (
        <BusinessPlanPickerPage onSelectPlan={(id) => {
          setSelectedPlan(id)
          if (id === "enterprise") setView("enterprise")
          else if (id === "business_intl") setView("bizintl")
          else setView("business")
        }} onSwitchToPersonal={() => setView("plans")} onBack={() => setView("choice")} />
      )}
      {view === "personal" && (
        <PersonalFlow selectedPlan={selectedPlan} onComplete={handleRegComplete} onBack={() => setView("plans")} onGoLogin={handleGoLogin} />
      )}
      {view === "business" && (
        <BusinessFlow onComplete={() => handleRegComplete(true)} onBack={() => setView("bizplans")} onGoLogin={handleGoLogin} />
      )}
      {view === "bizintl" && (
        <BusinessInternationalFlow onComplete={() => handleRegComplete(true)} onBack={() => setView("bizplans")} />
      )}
      {view === "enterprise" && (
        <EnterpriseFlow onComplete={() => setView("article")} onBack={() => setView("bizplans")} />
      )}
      {view === "onboarding" && (
        <OnboardingPage
          onFinish={() => setView("article")}
          onDashboard={() => setView("account")}
        />
      )}
      {view === "account" && (
        <AccountPage user={userData} planType={activePlanType} onBack={() => setView("article")} />
      )}
      {view === "login" && (
        <LoginModal onClose={() => setView("article")} onGoRegister={() => setView("choice")} onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  )
}

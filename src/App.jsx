import { useState } from 'react'
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

export default function App() {
  const [view, setView]           = useState("article")
  const [modal, setModal]         = useState(null)
  const [loggedIn, setLoggedIn]   = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [activePlanType, setActivePlanType] = useState("freemium")
  const [userData, setUserData]   = useState({ firstName:"Jasper", lastName:"", email:"", jobRole:"Portfolio Manager", initials:"J" })

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
    setUserEmail("nieuw@example.com")
    setActivePlanType(isBusiness ? "business" : selectedPlan || "freemium")
    setUserData({ firstName:"Nieuw", lastName:"Gebruiker", email:"nieuw@example.com", jobRole:"Portfolio Manager", initials:"N" })
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

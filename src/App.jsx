import { useState } from 'react'
import './styles/global.css'

import ArticlePage        from './pages/ArticlePage.jsx'
import SubscriptionPage   from './pages/SubscriptionPage.jsx'
import AccountPage        from './pages/AccountPage.jsx'
import OnboardingPage     from './pages/OnboardingPage.jsx'
import AccountTypeChoice  from './flows/AccountTypeChoice.jsx'
import PersonalFlow       from './flows/PersonalFlow.jsx'
import BusinessFlow       from './flows/BusinessFlow.jsx'
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

  function handleStartReg(trigger) {
    if (trigger === "business") {
      setSelectedPlan(null); setView("business")
    } else if (trigger && trigger.startsWith("personal_")) {
      const planId = trigger.replace("personal_", "")
      setSelectedPlan(planId === "check" ? null : planId); setView("personal")
    } else {
      setSelectedPlan(null); setView("choice")
    }
  }

  function handleRegComplete(isBusiness) {
    setLoggedIn(true)
    setUserEmail("nieuw@example.com")
    setActivePlanType(isBusiness ? "business" : selectedPlan || "freemium")
    setUserData({ firstName:"Nieuw", lastName:"Gebruiker", email:"nieuw@example.com", jobRole:"Portfolio Manager", initials:"N" })
    setView("onboarding")
  }

  function handleGoLogin() { setView("article"); setModal("login") }

  return (
    <>
      {view === "article" && (
        <ArticlePage
          loggedIn={loggedIn} userEmail={userEmail}
          onLogin={() => setModal("login")}
          onSubscribe={() => setView("subscriptions")}
          onLogout={handleLogout}
          onAccount={() => setView("account")}
        />
      )}
      {view === "subscriptions" && (
        <SubscriptionPage onStartReg={handleStartReg} onLogin={() => setModal("login")} />
      )}
      {view === "choice" && (
        <AccountTypeChoice onChoose={t => setView(t==="business"?"business":"personal")} onBack={() => setView("subscriptions")} />
      )}
      {view === "personal" && (
        <PersonalFlow selectedPlan={selectedPlan} onComplete={handleRegComplete} onBack={() => setView("subscriptions")} onGoLogin={handleGoLogin} />
      )}
      {view === "business" && (
        <BusinessFlow onComplete={() => handleRegComplete(true)} onBack={() => setView("subscriptions")} onGoLogin={handleGoLogin} />
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
      {modal === "login" && (
        <LoginModal onClose={() => setModal(null)} onGoRegister={() => { setModal(null); setView("choice") }} onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  )
}

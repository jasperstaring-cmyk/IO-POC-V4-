import { createContext, useContext, useState } from 'react'
import { translations } from './i18n.js'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("nl")
  const t = (key) => translations[lang]?.[key] ?? translations["nl"]?.[key] ?? key
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}

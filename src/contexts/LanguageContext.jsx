import { useState, useEffect } from 'react'
import { translations } from './translations'
import { LanguageContext } from './context'

// 言語プロバイダーコンポーネント
export const LanguageProvider = ({ children }) => {
  // ローカルストレージから言語設定を読み込み、デフォルトは英語
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('pokemonCardLanguage')
    return savedLanguage || 'en'
  })

  // 言語が変更されたときにローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('pokemonCardLanguage', language)
  }, [language])

  // 翻訳テキストを取得する関数
  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  // 言語を切り替える関数
  const switchLanguage = (newLanguage) => {
    setLanguage(newLanguage)
  }

  const value = {
    language,
    t,
    switchLanguage,
    translations: translations[language]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
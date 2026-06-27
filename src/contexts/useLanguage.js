import { useContext } from 'react'
import { LanguageContext } from './context'

// カスタムフック：言語機能を使用するため
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
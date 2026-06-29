import { useEffect } from 'react'
import PokemonCardGenerator from './components/PokemonCardGenerator'
import LanguageSwitcher from './components/LanguageSwitcher'
import { LanguageProvider } from './contexts/LanguageContext'
import { useLanguage } from './contexts/useLanguage'
import './App.css'
import './styles/pokemon-cards.css'

const isStaging = import.meta.env.VITE_APP_ENV === 'staging'

// メインアプリケーションコンポーネント（言語対応版）
function AppContent() {
  const { language, t } = useLanguage() // 翻訳機能を使用

  useEffect(() => {
    document.title = isStaging
      ? `【${t('stagingEnvironment')}】Original Card Studio`
      : 'Original Card Studio'
  }, [language, t])

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-bar">
          <div className="wordmark">
            <img
              className="wordmark-mark"
              src={`${import.meta.env.BASE_URL}favicon.png`}
              alt=""
              aria-hidden="true"
            />
            Original Card Studio
          </div>
          <LanguageSwitcher />
        </div>
        <div className="hero-copy">
          <div className="hero-meta">
            {isStaging && (
              <span className="environment-badge">{t('stagingEnvironment')}</span>
            )}
            <p className="hero-kicker">Design your own collectible</p>
          </div>
          <h1>{t('appTitle')}</h1>
          <p className="hero-subtitle">{t('appSubtitle')}</p>
        </div>
      </header>
      
      {/* メインコンテンツエリア */}
      <main>
        <PokemonCardGenerator />
      </main>
      
      <footer className="App-footer">
        <span>{t('fanDisclaimer')}</span>
        <a href="https://github.com/simeydotme/pokemon-cards-css" target="_blank" rel="noopener noreferrer">
          {t('builtWith')} @simeydotme/pokemon-cards-css {t('gplLicense')}
        </a>
      </footer>
    </div>
  )
}

// ルートコンポーネント - LanguageProviderでラップ
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App

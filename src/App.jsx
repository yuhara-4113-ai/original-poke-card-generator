import PokemonCardGenerator from './components/PokemonCardGenerator'
import LanguageSwitcher from './components/LanguageSwitcher'
import { LanguageProvider } from './contexts/LanguageContext'
import { useLanguage } from './contexts/useLanguage'
import './App.css'
import './styles/pokemon-cards.css'

// メインアプリケーションコンポーネント（言語対応版）
function AppContent() {
  const { t } = useLanguage() // 翻訳機能を使用

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-bar">
          <div className="wordmark">
            <span className="wordmark-mark" aria-hidden="true">◆</span>
            Original Card Studio
          </div>
          <LanguageSwitcher />
        </div>
        <div className="hero-copy">
          <p className="hero-kicker">Design your own collectible</p>
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

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
        {/* 言語切り替えボタンをヘッダーに配置 */}
        <LanguageSwitcher />
        
        {/* アプリタイトル - 翻訳対応 */}
        <h1>{t('appTitle')}</h1>
        <p>{t('appSubtitle')}</p>
        
        {/* ライセンス情報 - 翻訳対応 */}
        <p className="license-info">
          <small>
            {t('builtWith')} <a href="https://github.com/simeydotme/pokemon-cards-css" target="_blank" rel="noopener noreferrer">
              @simeydotme/pokemon-cards-css
            </a> {t('gplLicense')}
          </small>
        </p>
      </header>
      
      {/* メインコンテンツエリア */}
      <main>
        <PokemonCardGenerator />
      </main>
      
      {/* フッターのライセンス表示 */}
      <a 
        href="https://github.com/simeydotme/pokemon-cards-css" 
        className="license-notice"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('licenseNotice')}
      </a>
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

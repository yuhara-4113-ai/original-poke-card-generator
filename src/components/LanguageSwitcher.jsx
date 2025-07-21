import { useLanguage } from '../contexts/useLanguage'
import './LanguageSwitcher.css'

// 言語切り替えコンポーネント - ヘッダーに表示される
const LanguageSwitcher = () => {
  const { language, switchLanguage, t } = useLanguage()

  return (
    <div className="language-switcher">
      <label htmlFor="language-select" className="language-label">
        {t('language')}:
      </label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => switchLanguage(e.target.value)}
        className="language-select"
      >
        <option value="en">{t('english')}</option>
        <option value="ja">{t('japanese')}</option>
      </select>
    </div>
  )
}

export default LanguageSwitcher
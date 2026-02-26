import { useTranslation } from 'react-i18next';
import '../styles/LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  const handleChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="language-switcher">
      <button
        type="button"
        className={current === 'en' ? 'active' : ''}
        onClick={() => handleChange('en')}
      >
        EN
      </button>
      <button
        type="button"
        className={current === 'ar' ? 'active' : ''}
        onClick={() => handleChange('ar')}
      >
        AR
      </button>
    </div>
  );
};

export default LanguageSwitcher;

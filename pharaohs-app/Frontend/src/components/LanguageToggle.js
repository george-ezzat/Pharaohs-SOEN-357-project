// src/components/LanguageToggle.js
import React from 'react';

const LanguageToggle = ({ language, setLanguage }) => {
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <button onClick={toggleLanguage} className="btn btn-secondary">
      {language === 'en' ? 'Français' : 'English'}
    </button>
  );
};

export default LanguageToggle;

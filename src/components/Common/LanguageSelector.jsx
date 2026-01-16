import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap';

import flagTr from '@assets/images/flags/tr.svg';
import flagEn from '@assets/images/flags/en.svg';
import flagFr from '@assets/images/flags/fr.svg';
import flagAr from '@assets/images/flags/ar.svg';

const LanguageSelector = () => {
const { t, i18n } = useTranslation();
const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'tr', name: t('common.turkish'), flag: flagTr },
    { code: 'en', name: t('common.english'), flag: flagEn },
    { code: 'fr', name: t('common.french'), flag: flagFr },
    { code: 'ar', name: t('common.arabic'), flag: flagAr },
  ];

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === i18n.language) || languages[0];
  };

  const handleSelect = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <>
      {/* <Dropdown className="language-selector" show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}>
        <Dropdown.Toggle>
          <img 
            src={getCurrentLanguage().flag}
          />
          <span>{getCurrentLanguage().name}</span>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {languages.map((language) => (
            <Dropdown.Item 
              key={language.code}
              onClick={() => handleSelect(language.code)}
              active={i18n.language === language.code}
            >
              <img 
                src={language.flag}
              />
              <span>{language.name}</span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown> */}
    </>
  );
};

export default LanguageSelector;

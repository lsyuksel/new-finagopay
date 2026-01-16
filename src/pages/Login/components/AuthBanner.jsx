import React from 'react'
import { useTranslation } from 'react-i18next';
import logo from '@assets/images/MorPosLogo.png'
import { Link } from 'react-router-dom';

export default function AuthBanner({title,subtitle,authText,buttonTitle,buttonLink}) {
  const { t } = useTranslation();

  return (
    <div className='auth-banner-container'>
        <div className="logos">
            <img src={logo} />
            <span>{t('login.logosText')}</span>
        </div>
        <div className="content">
            <div className='title' dangerouslySetInnerHTML={{ __html: title }} />
            <div className='subtitle' dangerouslySetInnerHTML={{ __html: subtitle }} />
            <ul>
                { authText.map((item, index)=> (
                    <li key={index}>
                        <div dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                ))}
            </ul>
        </div>
        { buttonTitle && (
            <div className="button">
                <Link to={buttonLink}>{buttonTitle}</Link>
            </div>
        ) }

    </div>
  )
}

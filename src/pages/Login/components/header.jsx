import React from 'react'
import { Link } from 'react-router-dom'

import logo from '@assets/images/MorPosLogo.png'
import LanguageSelector from '../../../components/Common/LanguageSelector'
import { t } from 'i18next'

export default function LoginHeader({pageTitle}) {
  return (
    <div className='login-header'>
        <div className="container">
            <div className="row align-items-center justify-content-between">
                <div className="col-auto">
                    <div className="logo">
                        <Link to={'/'}>
                            <img src={logo} alt="" />
                            <span>{pageTitle}</span>
                        </Link>
                    </div>
                </div>
                
                <div className="col-auto d-flex align-items-center" style={{ gap: 'var(--spacer-5)' }}>
                    <div className='header-info-text d-none d-sm-flex'>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.9558 3.23851L10.2996 0.0597217C10.1078 -0.0198877 9.89219 -0.0199268 9.70043 0.0597217L2.04418 3.23851C1.75258 3.3596 1.5625 3.64429 1.5625 3.96003V7.82429C1.5625 13.1451 4.77848 17.9313 9.70477 19.9421C9.89398 20.0193 10.106 20.0193 10.2952 19.9421C15.2214 17.9314 18.4375 13.1452 18.4375 7.82429V3.96003C18.4375 3.64429 18.2475 3.3596 17.9558 3.23851ZM16.875 7.82429C16.875 12.3475 14.2188 16.5115 10 18.3702C5.89398 16.5611 3.125 12.4701 3.125 7.82429V4.4816L10 1.62714L16.875 4.4816V7.82429ZM9.13648 10.4577L12.4945 7.09972C12.7995 6.79464 13.2942 6.79461 13.5993 7.09972C13.9044 7.40484 13.9044 7.89949 13.5993 8.20457L9.68891 12.1149C9.38375 12.4201 8.8891 12.42 8.58406 12.1149L6.4007 9.93156C6.09559 9.62644 6.09559 9.13179 6.4007 8.82672C6.70582 8.52164 7.20047 8.5216 7.50555 8.82672L9.13648 10.4577Z" fill="#00B69B"/>
                        </svg>
                        <span>{t('common.safeShopping')}</span>
                    </div>
                    <LanguageSelector />
                </div>
            </div>
        </div>
    </div>
  )
}
import { useTranslation } from 'react-i18next';
import LoginHeader from './components/header';
import LoginFooter from './components/footer';
import AuthBanner from './components/AuthBanner';

import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';

export default function AuthLayout({page}) {
    const { t } = useTranslation();
    const authText = [t('login.bannerListItem1'),t('login.bannerListItem2'),t('login.bannerListItem3')]
    
    const AUTH_COMPONENTS = {
        'login': <Login />,
        'register': <Register />,
        'forgot-password': <ForgotPassword />,
      };

    return (
        <div className='auth-container'>
            <LoginHeader pageTitle='Giriş Yapın' />
            <div className="auth-content">
                <div className="container">
                <div className="row align-items-strech">
                    <div className="col-md-6">
                    <AuthBanner
                        title={t('login.bannerTitle')}
                        subtitle={t('login.bannerSubTitle')}
                        authText={authText}
                        buttonTitle={t('login.bannerButton')}
                        buttonLink='/register'
                    />
                    </div>
                    <div className="col-md-6">
                        <div className="auth-form-area">
                            {AUTH_COMPONENTS[page] || <Login />}
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <LoginFooter className="login-footer-container" text={t('login.footerText')} />
        </div>
    )
}

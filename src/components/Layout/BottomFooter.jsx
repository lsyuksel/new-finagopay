import { t } from 'i18next'
import React from 'react'

import footerBankIcon from '@/assets/images/footer-bank.png'
import { useSelector } from 'react-redux';

export default function BottomFooter() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return null;
  }
  return (
    <footer>
      <div className="footer-container">
        <div className='footer-text' dangerouslySetInnerHTML={{ __html: t("common.footerCopyright") }} />
        <div><img src={footerBankIcon} /></div>
      </div>
    </footer>
  )
}

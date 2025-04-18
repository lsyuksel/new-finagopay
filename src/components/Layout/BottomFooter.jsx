import { t } from 'i18next'
import React from 'react'

import footerBankIcon from '@/assets/images/footer-bank.png'

export default function BottomFooter() {
  return (
    <footer>
      <div className="footer-container">
        <div className='footer-text' dangerouslySetInnerHTML={{ __html: t("common.footerCopyright") }} />
        <div><img src={footerBankIcon} /></div>
      </div>
    </footer>
  )
}

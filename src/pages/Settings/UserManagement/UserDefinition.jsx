import { t } from 'i18next'
import React from 'react'
import { Container } from 'react-bootstrap'

export default function UserDefinition() {
  return (
    <Container className="py-3">
      <h4 className="mb-4">
        {t('menu.userdefinition')}
      </h4>
      <p>
        Kullanıcı Tanımlama sayfası içeriği burada yer alacak.
      </p>
    </Container>
  )
}

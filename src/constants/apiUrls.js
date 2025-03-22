export const AUTH_URL = {
  Login: '/Authentication/Login',
  VerifyTwoFactorSecret: '/Authentication/VerifyTwoFactorSecret',
  SendVerificationCode: '/Authentication/SendVerificationCode'
};

export const TRANSACTION_URL = {
  GetTransactionProvisionSearch: '/TransactionProvision/GetTransactionProvisionSearch',
  GetTransactionProvisionSettleSearch: '/TransactionProvisionSettle/GetTransactionProvisionSettleSearchByUserName'
};

export const CARD_URL = {
  GetAllCardBrandDef: '/CardBrandDef/GetAllCardBrandDef',
  GetAllCardType: '/CardType/GetAllCardType'
};

export const BANK_URL = {
  GetUsersPayFacIntegrationEnabledBankList: '/DomesticBankDef/GetUsersPayFacIntegrationEnabledBankList'
};

export const CURRENCY_URL = {
  GetCurrencyDef: '/Currency/GetCurrencyDef'
};

export const TRANSACTION_TYPE_URL = {
  GetAllRavenTransactionTypeDef: '/RavenTransactionTypeDef/GetAllRavenTransactionTypeDef'
};

export const PAYMENT_URL = {
  GetAllPayOutStatusDef: '/PayOutStatusDef/GetAllPayOutStatusDef'
}; 
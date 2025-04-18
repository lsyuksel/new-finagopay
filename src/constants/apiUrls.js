export const MERCHANT_LINK_PAYMENT = {
  GetAllMerchantLinkPaymentByUserName: '/MerchantLinkPayment/GetAllMerchantLinkPaymentByUserName',
  GetLink: '/MerchantLinkPayment/GetLink',
};

export const AUTH_URL = {
  Login: '/Authentication/Login',
  Register: '/UserAcount/CreateUserAcount',
  VerifyTwoFactorSecret: '/Authentication/VerifyTwoFactorSecret',
  SendVerificationCode: '/Authentication/SendVerificationCode',
  ForgotPassword: '/User/UserChangePasswordSendEmail',
  UpdateUserNewPassword: '/User/UpdateUserNewPassword',
  GetUser: '/User/GetUser',
  GetUserAgreementByCreateAcount: '/UserAgreement/GetUserAgreementByCreateAcount',
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
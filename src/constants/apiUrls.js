export const MERCHANT_LINK_PAYMENT = {
  GetAllMerchantLinkPaymentByUserName: '/MerchantLinkPayment/GetAllMerchantLinkPaymentByUserName',
  UpdateMerchantLinkPaymentByStatus: '/MerchantLinkPayment/UpdateMerchantLinkPaymentByStatus',
  GetLink: '/MerchantLinkPayment/GetLink',
  InsertMerchantLinkPayment: '/MerchantLinkPayment/InsertMerchantLinkPayment',
  UpdateMerchantLinkPayment: '/MerchantLinkPayment/UpdateMerchantLinkPayment',
  GetMerchantLinkPayment: '/MerchantLinkPayment/GetMerchantLinkPayment',
};

export const AUTH_URL = {
  Login: '/Authentication/Login',
  Register: '/UserAcount/CreateUserAcount',
  VerifyTwoFactorSecret: '/Authentication/VerifyTwoFactorSecret',
  SendVerificationCode: '/Authentication/SendVerificationCode',
  GetSubMerchantIdByUserName: '/MerchantPermission/GetSubMerchantIdByUserName',
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

export const SELECT_OPTIONS_URL = {
  GetCurrencyDef: '/Currency/GetCurrencyDef',
  GetAllProductType: '/ProductType/GetAllProductType',
};

export const TRANSACTION_TYPE_URL = {
  GetAllRavenTransactionTypeDef: '/RavenTransactionTypeDef/GetAllRavenTransactionTypeDef'
};

export const PAYMENT_URL = {
  GetAllPayOutStatusDef: '/PayOutStatusDef/GetAllPayOutStatusDef'
}; 
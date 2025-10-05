export const MERCHANT_LINK_PAYMENT = {
  GetAllMerchantLinkPaymentByUserName: '/MerchantLinkPayment/GetAllMerchantLinkPaymentByUserName',
  UpdateMerchantLinkPaymentByStatus: '/MerchantLinkPayment/UpdateMerchantLinkPaymentByStatus',
  GetLink: '/MerchantLinkPayment/GetLink',
  InsertMerchantLinkPayment: '/MerchantLinkPayment/InsertMerchantLinkPayment',
  UpdateMerchantLinkPayment: '/MerchantLinkPayment/UpdateMerchantLinkPayment',
  GetMerchantLinkPayment: '/MerchantLinkPayment/GetMerchantLinkPayment',
  GetInstallments: '/Installment/GetInstallments',
  PayLink: '/MerchantLinkPayment/PayLink',
};

export const AUTH_URL = {
  Login: '/Authentication/Login',
  Register: '/UserAcount/CreateUserAcount',
  VerifyTwoFactorSecret: '/Authentication/VerifyTwoFactorSecret',
  SendVerificationCode: '/Authentication/SendVerificationCode',
  GetSubMerchantIdByUserName: '/MerchantPermission/GetSubMerchantIdByUserName',
  GetMerchantPermissionByUserName: '/MerchantPermission/GetMerchantPermissionByUserName',
  ForgotPassword: '/User/UserChangePasswordSendEmail',
  UpdateUserNewPassword: '/User/UpdateUserNewPassword',
  GetUser: '/User/GetUser',
  GetUserAgreementByCreateAcount: '/UserAgreement/GetUserAgreementByCreateAcount',
};

export const TRANSACTION_URL = {
  GetTransactionList: '/UnifiedTransaction/GetTransactionList',
  GetTransactionSearchList: '/UnifiedTransaction/GetTransactionSearchList',
  GetTransactionDetail: '/UnifiedTransaction/GetTransactionDetail',
  
  CancelTransaction: '/UnifiedTransaction/CancelTransaction',
  RefundTransaction: '/UnifiedTransaction/RefundTransaction',

  


  GetTransactionProvisionSearch: '/TransactionProvision/GetTransactionProvisionSearch',
  GetTransactionProvisionSettleSearch: '/TransactionProvisionSettle/GetTransactionProvisionSettleSearchByUserName'
};

export const SELECT_OPTIONS_URL = {
  GetCurrencyDef: '/Currency/GetCurrencyDef',
  GetAllProductType: '/ProductType/GetAllProductType',
  GetAllRavenAuthorizationResponseCodeDef: '/RavenAuthorizationResponseCodeDef/GetAllRavenAuthorizationResponseCodeDef',
  GetAllRavenTransactionTypeDef: '/RavenTransactionTypeDef/GetAllRavenTransactionTypeDef',
  GetAllTransactionNetworkDef: '/TransactionNetworkDef/GetAllTransactionNetworkDef',
  GetAllCardType: '/CardType/GetAllCardType',
  GetAllProvisionStatusDef: '/ProvisionStatusDef/GetAllProvisionStatusDef',
  GetAllTransactionInstallmentTypeDef: '/TransactionInstallmentTypeDef/GetAllTransactionInstallmentTypeDef',
  GetAllPosEntryModeDef: '/PosEntryModeDef/GetAllPosEntryModeDef',
  GetUsersPayFacIntegrationEnabledBankList: '/DomesticBankDef/GetUsersPayFacIntegrationEnabledBankList',
  GetAllCountry: '/Country/GetAllCountry',
};

export const PAYMENT_URL = {
  GetAllPayOutStatusDef: '/PayOutStatusDef/GetAllPayOutStatusDef'
}; 
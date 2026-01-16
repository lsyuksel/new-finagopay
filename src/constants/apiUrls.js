export const MERCHANT_LINK_PAYMENT = {
  GetAllMerchantLinkPaymentByUserName: '/MerchantLinkPayment/GetAllMerchantLinkPaymentByUserName',
  UpdateMerchantLinkPaymentByStatus: '/MerchantLinkPayment/UpdateMerchantLinkPaymentByStatus',
  GetLink: '/MerchantLinkPayment/GetLink',
  InsertMerchantLinkPayment: '/MerchantLinkPayment/InsertMerchantLinkPayment',
  UpdateMerchantLinkPayment: '/MerchantLinkPayment/UpdateMerchantLinkPayment',
  GetMerchantLinkPayment: '/MerchantLinkPayment/GetMerchantLinkPayment',
  GetInstallments: '/MerchantLinkPayment/ProcessCheckBin',
  GetMerchantPermissionByMerchantId: 'MerchantPermission/GetMerchantPermissionByMerchantId',
  PayLink: '/MerchantLinkPayment/PayLink',
};

export const AUTH_URL = {
  Login: '/Authentication/Login',
  Register: '/UserAcount/CreateUserAcount',
  VerifyTwoFactorSecret: '/Authentication/VerifyTwoFactorSecret',
  SendVerificationCode: '/Authentication/SendVerificationCode',
  Logout: '/Authentication/Logout',
  GetSubMerchantIdByUserName: '/MerchantPermission/GetSubMerchantIdByUserName',
  GetMerchantPermissionByUserName: '/MerchantPermission/GetMerchantPermissionByUserName',
  ForgotPassword: '/User/UserChangePasswordSendEmail',
  UpdateUserNewPassword: '/User/UpdateUserNewPassword',
  GetUser: '/User/GetUser',
  GetUserAgreementByCreateAcount: '/UserAgreement/GetUserAgreementByCreateAcount',
};

export const TRANSACTION_URL = {
  
  GetTransactionList: '/MerchantTransaction/GetTransactionList',
  GetTransactionSearchList: '/MerchantTransaction/GetTransactionSearchList',
  GetTransactionDetail: '/MerchantTransaction/GetTransactionDetail',
  CancelTransaction: '/MerchantTransaction/CancelTransaction',
  RefundTransaction: '/MerchantTransaction/RefundTransaction',
  GetTransactionReceipt: '/MerchantTransaction/GetTransactionReceipt',
  


  GetTransactionProvisionSearch: '/TransactionProvision/GetTransactionProvisionSearch',
  GetTransactionProvisionSettleSearch: '/TransactionProvisionSettle/GetTransactionProvisionSettleSearchByUserName'
};


export const REPORTS_URL = {
  GetMerchantPaymentFileSearchByUserName: '/MerchantPaymentFile/GetMerchantPaymentFileSearchByUserName',
};

export const  DASHBOARD_URL = {
  GetDashboard: '/MerchantDashboard/GetDashboard',
};

export const SETTINGS_URL = {
  GetProfile: '/MerchantUserProfile/GetProfile',
  ChangePasswordProfile: '/MerchantUserProfile/ChangePasswordProfile',

  ChangePasswordProfileVerify: '/MerchantUserProfile/ChangePasswordProfileVerify',

  GetMerchantProfileActivityLog: '/MerchantUserProfile/GetMerchantProfileActivityLog',

  MerchantGetKeys: '/MerchantProfile/GetKeys',
  MerchantUpdateKeys: '/MerchantProfile/UpdateKeys',
  
  MerchantGetProfile: '/MerchantProfile/GetProfile',
  MerchantInsertLogo: '/MerchantProfile/InsertLogo',

  GetMerchantCommissionList: '/PayFacCommission/GetPayFacAndMerchantCommissionDefByUserName',
  GetPayFacCommissionBankListByUserName: '/DomesticBankDef/GetPayFacCommissionBankListByUserName',
  UpdateMerchantCommissionDefListCommission: '/MerchantCommission/UpdateMerchantCommissionDefListCommission',
  InsertMerchantCommissionDefListCommission: '/MerchantCommission/InsertMerchantCommissionDefListCommission',

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
  GetAllCompanyTypeDef: '/CompanyTypeDef/GetAllCompanyTypeDef',
  GetAllMccDef: '/MccDef/GetAllMccDef',
  GetAllCityDef: '/CityDef/GetAllCityDef',
  GetDistrictDefinitions: '/DistrictDef/GetDistrictDefinitions',
  GetAllPayOutStatusDef: '/PayOutStatusDef/GetAllPayOutStatusDef',
  GetDocumentTypes: '/DocumentTypeDef/GetDocumentTypes',
  GetAllPaymentMethodDef: '/PaymentMethodDef/GetAllPaymentMethodDef',
};

export const PAYMENT_URL = {
  GetAllPayOutStatusDef: '/PayOutStatusDef/GetAllPayOutStatusDef'
};

export const MERCHANT_APPLICATION = {
  InsertMerchantApplication: '/MerchantApplication/InsertMerchantApplication',
  GetUserCanApproveAgreement: '/MerchantApplication/GetUserCanApproveAgreement',
};

export const MERCHANT_AGREEMENT = {
  //GetMerchantAgreementForApproval: '/MerchantAgreement/GetMerchantAgreements',
  GetMerchantAgreementForApproval: '/MerchantAgreement/GetMerchantAgreementForApproval',
  ApproveMerchantAgreement: '/MerchantApplication/ApproveMerchantAgreement',
}; 
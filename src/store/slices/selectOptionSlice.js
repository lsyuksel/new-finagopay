import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { SELECT_OPTIONS_URL } from '../../constants/apiUrls';

export const getCurrencyDef = createAsyncThunk(
  'Currency/GetCurrencyDef',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.selectOptions.currencyDef.length === 0) {
      try {
        const response = await api.get(SELECT_OPTIONS_URL.GetCurrencyDef);
        return response || [];
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Kullanıcı verileri alınamadı');
      }
    }
  }
);


export const getAllProductType = createAsyncThunk(
  'ProductType/GetAllProductType',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await api.get(SELECT_OPTIONS_URL.GetAllProductType);
      return response || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Kullanıcı verileri alınamadı');
    }
  }
);

export const getAllAuthorizationResponseCode = createAsyncThunk(
  'RavenAuthorizationResponseCodeDef/GetAllRavenAuthorizationResponseCodeDef',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.selectOptions.allAuthorizationResponseCode.length === 0) {
      try {
        const response = await api.get(SELECT_OPTIONS_URL.GetAllRavenAuthorizationResponseCodeDef);
        return response || [];
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Kullanıcı verileri alınamadı');
      }
    }
  }
);

export const getAllTransactionType = createAsyncThunk(
  'RavenTransactionTypeDef/GetAllRavenTransactionTypeDef',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.selectOptions.allTransactionType.length === 0) {
      try {
        const response = await api.get(SELECT_OPTIONS_URL.GetAllRavenTransactionTypeDef);
        return response || [];
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Kullanıcı verileri alınamadı');
      }
    }
  }
);

export const getAllTransactionNetworkDef = createAsyncThunk(
  'TransactionNetworkDef/GetAllTransactionNetworkDef',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.selectOptions.allTransactionNetwork.length === 0) {
      try {
        const response = await api.get(SELECT_OPTIONS_URL.GetAllTransactionNetworkDef);
        return response || [];
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Kullanıcı verileri alınamadı');
      }
    }
  }
);

export const getAllCardType = createAsyncThunk(
  '/CardType/GetAllCardType',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.selectOptions.allCardTypeName.length === 0) {
      try {
        const response = await api.get(SELECT_OPTIONS_URL.GetAllCardType);
        return response || [];
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Kullanıcı verileri alınamadı');
      }
    }
  }
);

export const getAllProvisionStatusDef = createAsyncThunk(
  'ProvisionStatusDef/GetAllProvisionStatusDef',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.selectOptions.allProvisionStatus.length === 0) {
      try {
        const response = await api.get(SELECT_OPTIONS_URL.GetAllProvisionStatusDef);
        return response || [];
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Kullanıcı verileri alınamadı');
      }
    }
  }
);

export const getAllTransactionInstallmentTypeDef = createAsyncThunk(
  'TransactionInstallmentTypeDef/GetAllTransactionInstallmentTypeDef',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.selectOptions.allInstallmentType.length === 0) {
      try {
        const response = await api.get(SELECT_OPTIONS_URL.GetAllTransactionInstallmentTypeDef);
        return response || [];
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Kullanıcı verileri alınamadı');
      }
    }
  }
);

export const getAllPosEntryModeDef = createAsyncThunk(
  'PosEntryModeDef/GetAllPosEntryModeDef',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.selectOptions.allPosEntryMode.length === 0) {
      try {
        const response = await api.get(SELECT_OPTIONS_URL.GetAllPosEntryModeDef);
        return response || [];
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Kullanıcı verileri alınamadı');
      }
    }
  }
);

export const getUsersPayFacIntegrationEnabledBankList = createAsyncThunk(
  'DomesticBankDef/GetUsersPayFacIntegrationEnabledBankList',
  async (userData, { getState, rejectWithValue }) => {
    console.log("getUsersPayFacIntegrationEnabledBankList",userData);
    const state = getState();
    if (state.selectOptions.allBankName.length === 0) {
      try {
        const response = await api.post(SELECT_OPTIONS_URL.GetUsersPayFacIntegrationEnabledBankList, {userName: userData});
        console.log("response",response)
        return response || [];
      } catch (error) {
        return rejectWithValue(
          parseErrorResponse(error.response.data).message || t("messages.error")
        );
      }
    }
  }
);

export const getAllCountry = createAsyncThunk(
  'Country/GetAllCountry',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.selectOptions.allCardAcceptorCountry.length === 0) {
      try {
        const response = await api.get(SELECT_OPTIONS_URL.GetAllCountry);
        return response || [];
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Kullanıcı verileri alınamadı');
      }
    }
  }
);

/*export const getAllSecurityLevelIndicator = createAsyncThunk(
  'getAllSecurityLevelIndicator',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.selectOptions.allSecurityLevelIndicator.length === 0) {
      try {
        const response = await api.get(SELECT_OPTIONS_URL.getAllSecurityLevelIndicator);
        return response || [];
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Kullanıcı verileri alınamadı');
      }
    }
  }
);*/


const initialState = {
  testOptions: [
    {
      "guid": 1,
      "label": "Test #1",
    },
    {
      "guid": 2,
      "label": "Test #2",
    },
    {
      "guid": 3,
      "label": "Test #3",
    },
    {
      "guid": 4,
      "label": "Test #4",
    },
    {
      "guid": 5,
      "label": "Test #5",
    }
  ],

  currencyDef: [],

  allProductType: [],
  allAuthorizationResponseCode: [],
  allTransactionType: [],
  allTransactionNetwork : [],
  allCardTypeName : [],
  allProvisionStatus : [],
  allInstallmentType : [],
  allPosEntryMode : [],
  allBankName : [],
  allCardAcceptorCountry : [],
  allSecurityLevelIndicator : [
    {
      guid: 0,
      description: "None Secure"
    },
    {
      guid: 1,
      description: "Half Secure"
    },
    {
      guid: 2,
      description: "Full Secure"
    }
  ],

  loading: false,
  error: null,
  initialized: false,
};

const selectOptionsSlice = createSlice({
  name: 'selectOptions',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // CurrencyDef cases
      .addCase(getCurrencyDef.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrencyDef.fulfilled, (state, action) => {
        state.loading = false;
        state.currencyDef = action.payload;
        state.initialized = true;
        state.error = null;
      })
      .addCase(getCurrencyDef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.initialized = true;
      })

      // ProductType cases
      .addCase(getAllProductType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProductType.fulfilled, (state, action) => {
        state.loading = false;
        state.allProductType = action.payload;
        state.error = null;
      })
      .addCase(getAllProductType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // AuthorizationResponseCode cases
      .addCase(getAllAuthorizationResponseCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAuthorizationResponseCode.fulfilled, (state, action) => {
        state.loading = false;
        state.allAuthorizationResponseCode = action.payload;
        state.error = null;
      })
      .addCase(getAllAuthorizationResponseCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // TransactionType cases
      .addCase(getAllTransactionType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTransactionType.fulfilled, (state, action) => {
        state.loading = false;
        state.allTransactionType = action.payload;
        state.error = null;
      })
      .addCase(getAllTransactionType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // TransactionNetwork cases
      .addCase(getAllTransactionNetworkDef.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTransactionNetworkDef.fulfilled, (state, action) => {
        state.loading = false;
        state.allTransactionNetwork = action.payload;
        state.error = null;
      })
      .addCase(getAllTransactionNetworkDef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CardType cases
      .addCase(getAllCardType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCardType.fulfilled, (state, action) => {
        state.loading = false;
        state.allCardTypeName = action.payload;
        state.error = null;
      })
      .addCase(getAllCardType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ProvisionStatus cases
      .addCase(getAllProvisionStatusDef.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProvisionStatusDef.fulfilled, (state, action) => {
        state.loading = false;
        state.allProvisionStatus = action.payload;
        state.error = null;
      })
      .addCase(getAllProvisionStatusDef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // InstallmentType cases
      .addCase(getAllTransactionInstallmentTypeDef.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTransactionInstallmentTypeDef.fulfilled, (state, action) => {
        state.loading = false;
        state.allInstallmentType = action.payload;
        state.error = null;
      })
      .addCase(getAllTransactionInstallmentTypeDef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PosEntryMode cases
      .addCase(getAllPosEntryModeDef.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosEntryModeDef.fulfilled, (state, action) => {
        state.loading = false;
        state.allPosEntryMode = action.payload;
        state.error = null;
      })
      .addCase(getAllPosEntryModeDef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // BankList cases
      .addCase(getUsersPayFacIntegrationEnabledBankList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersPayFacIntegrationEnabledBankList.fulfilled, (state, action) => {
        state.loading = false;
        state.allBankName = action.payload;
        state.error = null;
      })
      .addCase(getUsersPayFacIntegrationEnabledBankList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Country cases
      .addCase(getAllCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.allCardAcceptorCountry = action.payload;
        state.error = null;
      })
      .addCase(getAllCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { } = selectOptionsSlice.actions;

export default selectOptionsSlice.reducer; 
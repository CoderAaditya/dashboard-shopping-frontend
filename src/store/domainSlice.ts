import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://dashboard-shopping-backend.vercel.app/api/domains";

interface Domain {
  name: string;
}

interface FetchDomainsResponse {
  status: number;
  data: Domain[];
}

interface AddDomainResponse {
  status: number;
  data: string;
}

interface DeleteDomainResponse {
  status: number;
}

interface UpdateDomainResponse {
  status: number;
  data: string;
}

interface CheckDomainResponse {
  status: number;
  available: boolean;
}

interface DomainState {
  domains: Domain[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  domainAvailability: boolean | null;
}

export const fetchDomains = createAsyncThunk<FetchDomainsResponse, void>(
  "domains/fetchDomains",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getAllDomains`);
      return { status: response.status, data: response.data.domains };
    } catch (error: any) {
      return rejectWithValue(error.response ? error.response.status : 500);
    }
  }
);

export const addDomain = createAsyncThunk<AddDomainResponse, string>(
  "domains/addDomain",
  async (domain, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/addDomain`, { domain });
      return { status: response.status, data: response.data.domain };
    } catch (error: any) {
      return rejectWithValue(error.response ? error.response.status : 500);
    }
  }
);

export const deleteDomain = createAsyncThunk<DeleteDomainResponse, string>(
  "domains/deleteDomain",
  async (domain, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/deleteDomain`, { domain });
      return { status: response.status };
    } catch (error: any) {
      return rejectWithValue(error.response ? error.response.status : 500);
    }
  }
);

export const updateDomain = createAsyncThunk<UpdateDomainResponse, { oldDomain: string; newDomain: string }>(
  "domains/updateDomain",
  async ({ oldDomain, newDomain }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/updateDomain`, { oldDomain, newDomain });
      return { status: response.status, data: response.data.message };
    } catch (error: any) {
      return rejectWithValue(error.response ? error.response.status : 500);
    }
  }
);

export const isDomainAvailable = createAsyncThunk<CheckDomainResponse, string>(
  "domains/isDomainAvailable",
  async (domain, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/check`, { domain });
      return { status: response.status, available: response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response ? error.response.status : 500);
    }
  }
);

export const deleteAllDomains = createAsyncThunk<DeleteDomainResponse>(
    "domains/deleteAllDomains",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_URL}/deleteAllDomains`);
        return { status: response.status };
      } catch (error: any) {
        return rejectWithValue(error.response ? error.response.status : 500);
      }
    }
  );

const domainSlice = createSlice({
  name: "domains",
  initialState: {
    domains: [],
    status: "idle",
    error: null,
    domainAvailability: null,
  } as DomainState,
  reducers: {
    clearDomains: (state) => {
      state.domains = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDomains.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDomains.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.domains = action.payload.data;
      })
      .addCase(fetchDomains.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch domains";
      })
      .addCase(isDomainAvailable.fulfilled, (state, action) => {
        state.domainAvailability = action.payload.available;
      });
  },
});

export const { clearDomains } = domainSlice.actions;
export default domainSlice.reducer;

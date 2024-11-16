import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Adjust based on your backend setup

// Async Thunks

// Candidate Registration
export const registerCandidate = createAsyncThunk(
  "auth/registerCandidate",
  async (candidateData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/register/candidate`,
        candidateData
      );
      console.log(response.data)
      return response.data; // Expected { token, message }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Candidate registration failed"
      );
    }
  }
);

// Company Registration
export const registerCompany = createAsyncThunk(
  "auth/registerCompany",
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/register/company`,
        companyData
      );
      return response.data; // Expected { token, message }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Company registration failed"
      );
    }
  }
);

// Candidate Login
export const loginCandidate = createAsyncThunk(
  "auth/loginCandidate",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/login/candidate`,
        credentials
      );
      return response.data; // Expected { token, message }
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response?.data?.message || "Candidate login failed"
      );
    }
  }
);

// Company Login
export const loginCompany = createAsyncThunk(
  "auth/loginCompany",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/login/company`,
        credentials
      );
      return response.data; // Expected { token, message }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Company login failed"
      );
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Optionally, call an API to handle server-side logout logic
      return {}; // Clear state
    } catch (error) {
      console.log(error);
      return rejectWithValue("Logout failed");
    }
  }
);

// Protected Route Access (Example)
export const fetchProtectedData = createAsyncThunk(
  "auth/fetchProtectedData",
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const response = await axios.get(`${API_URL}/protected`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Expected { data: ... }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to access protected route"
      );
    }
  }
);

// Slice Definition
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    role: null, // candidate | company
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Candidate Registration
      .addCase(registerCandidate.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerCandidate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.role = "candidate";
      })
      .addCase(registerCandidate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Company Registration
      .addCase(registerCompany.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.role = "company";
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Candidate Login
      .addCase(loginCandidate.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginCandidate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.role = "candidate";
      })
      .addCase(loginCandidate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Company Login
      .addCase(loginCompany.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginCompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.role = "company";
      })
      .addCase(loginCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
        state.status = "idle";
      })
      // Protected Route
      .addCase(fetchProtectedData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProtectedData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(fetchProtectedData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError, resetAuth } = authSlice.actions;

export default authSlice.reducer;

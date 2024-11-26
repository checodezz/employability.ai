import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface ResumeState {
  uploading: boolean;
  error: string | null;
  parsedData: any | null;
}

const initialState: ResumeState = {
  uploading: false,
  error: null,
  parsedData: null,
};

// Async thunk for uploading and parsing the resume
export const uploadResume = createAsyncThunk(
  "resume/uploadResume",
  async (
    { file, userId }: { file: File; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("userId", userId);

      const response = await fetch("http://localhost:3000/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload resume");
      }

      // Return the parsed data from the backend
      return data.parsedData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    // Define any synchronous reducers if needed
    resetResumeState: (state) => {
      state.uploading = false;
      state.error = null;
      state.parsedData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResume.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action: PayloadAction<any>) => {
        state.uploading = false;
        state.parsedData = action.payload;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetResumeState } = resumeSlice.actions;

export default resumeSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from '../../services/dashboardService';

export const fetchDashboardSummary = createAsyncThunk('dashboard/fetchSummary', async (_, { rejectWithValue }) => {
  try {
    const response = await dashboardService.getSummary();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to load dashboard');
  }
});

export const fetchTrends = createAsyncThunk('dashboard/fetchTrends', async (weeks = 12, { rejectWithValue }) => {
  try {
    const response = await dashboardService.getTrends(weeks);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to load trends');
  }
});

export const fetchCalendar = createAsyncThunk('dashboard/fetchCalendar', async (month, { rejectWithValue }) => {
  try {
    const response = await dashboardService.getCalendar(month);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to load calendar');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    summary: null,
    trends: [],
    calendar: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchTrends.fulfilled, (state, action) => { state.trends = action.payload; })
      .addCase(fetchCalendar.fulfilled, (state, action) => { state.calendar = action.payload; });
  },
});

export default dashboardSlice.reducer;

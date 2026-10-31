import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import okrService from '../../services/okrService';

export const fetchObjectives = createAsyncThunk('objectives/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await okrService.getObjectives(params);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch objectives');
  }
});

export const fetchObjective = createAsyncThunk('objectives/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const response = await okrService.getObjective(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch objective');
  }
});

export const createObjective = createAsyncThunk('objectives/create', async (data, { rejectWithValue }) => {
  try {
    const response = await okrService.createObjective(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to create objective');
  }
});

export const updateObjective = createAsyncThunk('objectives/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await okrService.updateObjective(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to update objective');
  }
});

export const deleteObjective = createAsyncThunk('objectives/delete', async (id, { rejectWithValue }) => {
  try {
    await okrService.deleteObjective(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete objective');
  }
});

export const createKeyResult = createAsyncThunk('objectives/createKR', async ({ objectiveId, data }, { rejectWithValue }) => {
  try {
    const response = await okrService.createKeyResult(objectiveId, data);
    return { objectiveId, keyResult: response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to create key result');
  }
});

export const updateKeyResult = createAsyncThunk('objectives/updateKR', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await okrService.updateKeyResult(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to update key result');
  }
});

export const deleteKeyResult = createAsyncThunk('objectives/deleteKR', async (id, { rejectWithValue }) => {
  try {
    await okrService.deleteKeyResult(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete key result');
  }
});

const objectivesSlice = createSlice({
  name: 'objectives',
  initialState: {
    items: [],
    currentObjective: null,
    isLoading: false,
    error: null,
    meta: { page: 1, limit: 20, total: 0 },
  },
  reducers: {
    clearObjectiveError: (state) => { state.error = null; },
    clearCurrentObjective: (state) => { state.currentObjective = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchObjectives.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchObjectives.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        if (action.payload.meta) state.meta = action.payload.meta;
      })
      .addCase(fetchObjectives.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchObjective.pending, (state) => { state.isLoading = true; })
      .addCase(fetchObjective.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentObjective = action.payload;
      })
      .addCase(fetchObjective.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createObjective.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      .addCase(updateObjective.fulfilled, (state, action) => {
        const idx = state.items.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.currentObjective?.id === action.payload.id) {
          state.currentObjective = { ...state.currentObjective, ...action.payload };
        }
      })

      .addCase(deleteObjective.fulfilled, (state, action) => {
        state.items = state.items.filter((o) => o.id !== action.payload);
      })

      .addCase(createKeyResult.fulfilled, (state, action) => {
        if (state.currentObjective?.id === action.payload.objectiveId) {
          if (!state.currentObjective.keyResults) state.currentObjective.keyResults = [];
          state.currentObjective.keyResults.push(action.payload.keyResult);
        }
      })

      .addCase(deleteKeyResult.fulfilled, (state, action) => {
        if (state.currentObjective?.keyResults) {
          state.currentObjective.keyResults = state.currentObjective.keyResults.filter(
            (kr) => kr.id !== action.payload
          );
        }
      });
  },
});

export const { clearObjectiveError, clearCurrentObjective } = objectivesSlice.actions;
export default objectivesSlice.reducer;

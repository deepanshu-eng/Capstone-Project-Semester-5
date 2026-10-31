import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import habitService from '../../services/habitService';

export const fetchHabits = createAsyncThunk('habits/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await habitService.getHabits(params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch habits');
  }
});

export const createHabit = createAsyncThunk('habits/create', async (data, { rejectWithValue }) => {
  try {
    const response = await habitService.createHabit(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to create habit');
  }
});

export const updateHabit = createAsyncThunk('habits/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await habitService.updateHabit(id, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to update habit');
  }
});

export const deleteHabit = createAsyncThunk('habits/delete', async ({ id, hard }, { rejectWithValue }) => {
  try {
    await habitService.deleteHabit(id, hard);
    return { id, hard };
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete habit');
  }
});

export const checkInHabit = createAsyncThunk('habits/checkIn', async ({ habitId, data }, { rejectWithValue }) => {
  try {
    const response = await habitService.createCheckIn(habitId, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to check in');
  }
});

export const undoCheckIn = createAsyncThunk('habits/undoCheckIn', async ({ habitId, date }, { rejectWithValue }) => {
  try {
    const response = await habitService.deleteCheckIn(habitId, date);
    return { habitId, date, habit: response.data.habit };
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || 'Failed to undo check-in');
  }
});

const habitsSlice = createSlice({
  name: 'habits',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearHabitError: (state) => { state.error = null; },
    // Optimistic update for check-in (FE-ST-04)
    optimisticCheckIn: (state, action) => {
      const { habitId } = action.payload;
      const idx = state.items.findIndex((h) => h.id === habitId);
      if (idx !== -1) {
        state.items[idx].checkedInToday = true;
        state.items[idx].currentStreak += 1;
      }
    },
    rollbackCheckIn: (state, action) => {
      const { habitId } = action.payload;
      const idx = state.items.findIndex((h) => h.id === habitId);
      if (idx !== -1) {
        state.items[idx].checkedInToday = false;
        state.items[idx].currentStreak = Math.max(0, state.items[idx].currentStreak - 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createHabit.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(updateHabit.fulfilled, (state, action) => {
        const idx = state.items.findIndex((h) => h.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })

      .addCase(deleteHabit.fulfilled, (state, action) => {
        if (action.payload.hard) {
          state.items = state.items.filter((h) => h.id !== action.payload.id);
        } else {
          const idx = state.items.findIndex((h) => h.id === action.payload.id);
          if (idx !== -1) state.items[idx].status = 'archived';
        }
      })

      .addCase(checkInHabit.fulfilled, (state, action) => {
        const habit = action.payload.habit;
        if (habit) {
          const idx = state.items.findIndex((h) => h.id === habit.id);
          if (idx !== -1) {
            state.items[idx] = { ...state.items[idx], ...habit, checkedInToday: true };
          }
        }
      })

      .addCase(undoCheckIn.fulfilled, (state, action) => {
        const { habitId, habit } = action.payload;
        const idx = state.items.findIndex((h) => h.id === habitId);
        if (idx !== -1 && habit) {
          state.items[idx] = { ...state.items[idx], ...habit, checkedInToday: false };
        }
      });
  },
});

export const { clearHabitError, optimisticCheckIn, rollbackCheckIn } = habitsSlice.actions;
export default habitsSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

// Read theme from localStorage (only UI prefs allowed per FE-ST-05)
const savedTheme = localStorage.getItem('cadence-theme') || 'dark';
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: savedTheme,
    sidebarCollapsed: false,
    activeModal: null,    // 'createObjective' | 'createHabit' | 'createKR' | 'confirmDelete' | null
    modalData: null,
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('cadence-theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('cadence-theme', action.payload);
      document.documentElement.setAttribute('data-theme', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem('cadence-sidebar-collapsed', state.sidebarCollapsed);
    },
    openModal: (state, action) => {
      state.activeModal = action.payload.modal;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;

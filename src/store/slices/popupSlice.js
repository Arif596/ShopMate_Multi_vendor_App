import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    isAuthPopupOpen: false,
    isSidebarOpen: false,
    isSearchBarOpen: false,
    isCartOpen: false,
    isAIPopupOpen: false,
    isProfilePanelOpen: false,
    isVendorModalOpen: false,
  },
  reducers: {
    toggleAuthPopup(state) {
      state.isAuthPopupOpen = !state.isAuthPopupOpen;
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleSearchBar(state) {
      state.isSearchBarOpen = !state.isSearchBarOpen;
    },
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },
    toggleAIModal(state) {
      state.isAIPopupOpen = !state.isAIPopupOpen;
    },
    toggleProfileOpen(state) {
      state.isProfilePanelOpen = !state.isProfilePanelOpen;
    },
    toggleVendorModal(state) {
      state.isVendorModalOpen = !state.isVendorModalOpen;
    }
  },
});

export const {
  toggleAuthPopup,
  toggleSidebar,
  toggleSearchBar,
  toggleCart,
  toggleAIModal,
  toggleProfileOpen,
  toggleVendorModal,
} = popupSlice.actions;
export default popupSlice.reducer;

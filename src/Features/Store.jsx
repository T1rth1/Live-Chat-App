import { configureStore } from "@reduxjs/toolkit";
import themeSliceReducer from "./ThemeSlice.jsx";
import refreshSidebar from "./refreshSidebar.jsx";

export const store = configureStore({
  reducer: {
    themeKey: themeSliceReducer,
    refreshKey: refreshSidebar,
  },
});

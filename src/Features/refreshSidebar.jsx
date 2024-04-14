import { createSlice } from "@reduxjs/toolkit";

export const refreshSidebar = createSlice({
  name: "refreshSidebar",
  initialState: true,
  reducers: {
    refreshSidebarFun: (state) => {
      console.log("Refreshing sidebar from Redux");
      return (state = !state);
    },
  },
});
// not used wastage....
export const { refreshSidebarFun } = refreshSidebar.actions;
export default refreshSidebar.reducer;

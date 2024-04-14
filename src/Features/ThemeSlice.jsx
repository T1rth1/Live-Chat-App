import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "themeSlice",
  initialState: true,
  reducers: { //here this reducers is an object contain reducer function..here in this case,
    // which is responsible to change the "state"(true and false)
    toggleTheme: (state) => {
      return (state = !state);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer; // export reducer fucntion...

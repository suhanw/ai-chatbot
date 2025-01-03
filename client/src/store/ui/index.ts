import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { getCurrentUserSuccess } from "../auth";

import { type IRootState } from "../";

interface IUiState {
  sideBarOpen: boolean;
}

const initialState: IUiState = {
  sideBarOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSideBar: (state) => {
      state.sideBarOpen = !state.sideBarOpen;
    },
  },
  extraReducers(builder) {
    builder.addCase(getCurrentUserSuccess, (state, action) => {
      state.sideBarOpen = Boolean(action.payload);
    });
  },
});

export const { toggleSideBar } = uiSlice.actions;

export const uiReducer = uiSlice.reducer;

export const useToggleSideBar = () => {
  const sideBarOpen = useSelector((state: IRootState) => state.ui.sideBarOpen);
  const dispatch = useDispatch();
  return {
    sideBarOpen,
    toggleSideBar: () => dispatch(toggleSideBar()),
  };
};

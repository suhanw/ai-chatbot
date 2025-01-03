import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { authReducer } from "./auth";
import { conversationsReducer } from "./conversations";
import { uiReducer } from "./ui";

const dataReducer = combineReducers({
  auth: authReducer,
  conversations: conversationsReducer,
});

export const store = configureStore({
  reducer: {
    data: dataReducer,
    ui: uiReducer,
  },
});

export type IRootState = ReturnType<typeof store.getState>;

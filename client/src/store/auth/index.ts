import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSlice } from "@reduxjs/toolkit";
import {
  getCurrentUserApi,
  loginApi,
  signupApi,
  logoutApi,
} from "../../api/auth";
import { IRootState } from "../";

declare global {
  interface Window {
    isLoggedIn: boolean;
  }
}

interface IAuthState {
  currentUser: { email: string; password: string } | null;
}

const initialState: IAuthState = { currentUser: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    getCurrentUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      if (!state.currentUser) {
        window.isLoggedIn = false;
      }
    },
    getAuthError: (state, action) => {
      state.currentUser = null;
    },
  },
});

export const { getCurrentUserSuccess, getAuthError } = authSlice.actions;

export const authReducer = authSlice.reducer;

/** REACT HOOKS */

export function useGetCurrentUser() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: IRootState) => state.data.auth);

  const getCurrentUser = async () => {
    try {
      const response = await getCurrentUserApi();
      dispatch(getCurrentUserSuccess(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return {
    getCurrentUser,
    currentUser,
    isLoggedIn: Boolean(currentUser) || window.isLoggedIn,
  };
}

export function useLogin() {
  const dispatch = useDispatch();
  const [error, setError] = useState<any>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi(email, password);
      dispatch(getCurrentUserSuccess(response.data));
    } catch (error) {
      dispatch(getAuthError(error));
      setError(error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return { login, error, clearError };
}

export function useSignup() {
  const dispatch = useDispatch();
  const [error, setError] = useState<any>(null);

  const signup = async (email: string, password: string) => {
    try {
      const response = await signupApi(email, password);
      dispatch(getCurrentUserSuccess(response.data));
    } catch (error) {
      dispatch(getAuthError(error));
      setError(error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return { signup, error, clearError };
}

export function useLogout() {
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      await logoutApi();
      dispatch(getCurrentUserSuccess(null));
    } catch (error) {
      console.error(error);
    }
  };

  return { logout };
}

export function useCurrentUser() {
  const currentUser = useSelector(
    (state: IRootState) => state.data.auth.currentUser
  );
  return { currentUser, isLoggedIn: Boolean(currentUser) };
}

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUserSuccess } from "../auth";
import {
  deleteConversationByIdApi,
  getConversationByIdApi,
  getConversationsApi,
  postConversationApi,
  putConversationByIdApi,
} from "../../api/conversations";
import { IRootState } from "../";

interface IConversationsState {
  list: { _id: string; title: string; updatedAt: Date }[];
  currentConversation: {
    _id?: string;
    title: string;
    messages: { role: "user" | "assistant"; content: string }[];
  };
}

const initialState: IConversationsState = {
  list: [],
  currentConversation: {
    title: "New conversation",
    messages: [],
  },
};

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    getConversationsSuccess: (state, action) => {
      state.list = action.payload;
    },
    clearConversations: (state) => {
      state.list = [];
    },
    setCurrentConversationId: (state, action) => {
      state.currentConversation = {
        _id: action.payload,
        title: state.currentConversation?.title || "New conversation",
        messages: state.currentConversation?.messages || [],
      };
    },
    getCurrentConversationSuccess: (state, action) => {
      state.currentConversation = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getCurrentUserSuccess, (state, action) => {
      // clear conversations if current user is null
      if (!action.payload) {
        state.list = [];
        state.currentConversation = initialState.currentConversation;
      }
    });
  },
});

export const {
  getConversationsSuccess,
  clearConversations,
  getCurrentConversationSuccess,
  setCurrentConversationId,
} = conversationsSlice.actions;

export const conversationsReducer = conversationsSlice.reducer;

export const useGetConversationList = (isLoggedIn: boolean) => {
  const conversationList = useSelector(
    (state: IRootState) => state.data.conversations.list
  );
  const dispatch = useDispatch();
  const [error, setError] = useState<any>(null);

  const getConversationList = async () => {
    try {
      const response = await getConversationsApi();
      dispatch(getConversationsSuccess(response.data));
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getConversationList();
    }
  }, [isLoggedIn]);

  return { conversationList, getConversationList, error };
};

export const useSetCurrentConversationId = () => {
  const currentConversationId = useSelector(
    (state: IRootState) => state.data.conversations.currentConversation?._id
  );
  const dispatch = useDispatch();

  return {
    currentConversationId,
    setCurrentConversationId: (conversationId: string) => {
      dispatch(setCurrentConversationId(conversationId));
    },
  };
};

export const useGetCurrentConversation = () => {
  const currentConversation = useSelector(
    (state: IRootState) => state.data.conversations.currentConversation
  );
  const dispatch = useDispatch();
  const [error, setError] = useState<any>(null);

  const getCurrentConversation = async (conversationId: string) => {
    try {
      const response = await getConversationByIdApi(conversationId);
      dispatch(getCurrentConversationSuccess(response.data));
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    if (currentConversation?._id) {
      getCurrentConversation(currentConversation?._id);
    }
  }, [currentConversation?._id]);

  return { getCurrentConversation, currentConversation, error };
};

export const useAddNewConversation = () => {
  const dispatch = useDispatch();

  const addNewConversation = async () => {
    dispatch(
      getCurrentConversationSuccess({
        title: "New Conversation",
        messages: [],
      })
    );
  };

  return { addNewConversation };
};

export const useUpdateConversation = () => {
  const currentConversation = useSelector(
    (state: IRootState) => state.data.conversations.currentConversation
  );
  const conversationList = useSelector(
    (state: IRootState) => state.data.conversations.list
  );
  const dispatch = useDispatch();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateConversation = async (content: any) => {
    const oldConversation = { ...currentConversation };
    setIsLoading(true);

    try {
      let response;
      const message = { role: "user", content };

      // Optimistic UI update
      dispatch(
        getCurrentConversationSuccess({
          ...currentConversation,
          messages: [...currentConversation?.messages, message],
        })
      );

      if (currentConversation?._id) {
        response = await putConversationByIdApi(currentConversation._id, {
          ...currentConversation,
          messages: [...currentConversation?.messages, message],
        });
      } else {
        response = await postConversationApi({
          title: "New Conversation",
          messages: [message],
        });
        dispatch(getConversationsSuccess([response.data, ...conversationList]));
      }

      dispatch(getCurrentConversationSuccess(response.data));
    } catch (err) {
      setError(err);
      dispatch(getCurrentConversationSuccess(oldConversation));
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    currentConversation,
    error,
    isLoading,
    updateConversation,
    clearError,
  };
};

export const useUpdateConversationTitle = ({ conversationId }: any) => {
  const conversationList = useSelector(
    (state: IRootState) => state.data.conversations.list
  );
  const dispatch = useDispatch();
  const [error, setError] = useState<any>(null);

  const updateConversationTitle = async (title: string) => {
    const oldConversationList = [...conversationList];

    // optimistic UI update
    const newConversationList = [
      {
        _id: conversationId,
        title,
      },
      ...conversationList.filter(({ _id }: any) => _id !== conversationId),
    ];
    dispatch(getConversationsSuccess(newConversationList));

    try {
      await putConversationByIdApi(conversationId, {
        title,
      });
    } catch (err) {
      setError(err);
      dispatch(getConversationsSuccess(oldConversationList));
    }
  };

  return {
    updateConversationTitle,
    error,
    clearError: () => setError(null),
  };
};

export const useDeleteConversation = ({ conversationId }: any) => {
  const dispatch = useDispatch();
  const conversationList = useSelector(
    (state: IRootState) => state.data.conversations.list
  );
  const [error, setError] = useState<any>(null);

  const deleteConversation = async () => {
    const oldConversationList = [...conversationList];

    // optimistic UI update
    const newConversationList = conversationList.filter(
      ({ _id }: any) => _id !== conversationId
    );
    dispatch(getConversationsSuccess(newConversationList));

    try {
      await deleteConversationByIdApi(conversationId);
    } catch (err) {
      setError(err);
      dispatch(getConversationsSuccess(oldConversationList));
    }
  };

  return {
    deleteConversation,
    error,
    clearError: () => setError(null),
  };
};

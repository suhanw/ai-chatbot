import { SyntheticEvent, useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import FormHelperText from "@mui/material/FormHelperText";
import LinearProgress from "@mui/material/LinearProgress";
import SendIcon from "@mui/icons-material/Send";

import { useUpdateConversation } from "../../store/conversations";

function ConversationInput() {
  const theme = useTheme();
  const [content, setContent] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    currentConversation,
    isLoading,
    error,
    updateConversation,
    clearError,
  } = useUpdateConversation();

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentConversation?._id, currentConversation?.messages?.length]);

  const sendMessage = (e: SyntheticEvent) => {
    e.preventDefault();
    if (content) {
      updateConversation(content);
      setContent("");
      clearError();
    }
  };

  return (
    <form onSubmit={sendMessage}>
      {isLoading && (
        <LinearProgress color="info" sx={{ width: "80%", margin: "0 auto" }} />
      )}

      <FormHelperText error={!!error} sx={{ textAlign: "center" }}>
        {error}
      </FormHelperText>
      <FormControl
        sx={{
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          "& textarea:focus-visible": {
            outline: "none",
          },
        }}
      >
        <TextareaAutosize
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-label="Message Bender"
          placeholder="Message Bender"
          maxRows={3}
          style={{
            resize: "none",
            width: "100%",
            padding: "20px",
            borderRadius: "20px 20px 0 0",
            border: 0,
            background: theme.palette.primary.main,
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            background: theme.palette.primary.main,
            borderRadius: "0 0 20px 20px",
            padding: "10px",
          }}
        >
          <IconButton type="submit" color="info" disabled={!content}>
            <SendIcon />
          </IconButton>
        </Box>
      </FormControl>
    </form>
  );
}

export default ConversationInput;

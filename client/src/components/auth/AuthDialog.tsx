import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import DialogContent from "@mui/material/DialogContent";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";

import { useGetCurrentUser } from "../../store/auth";
import useAuthForm from "./useAuthForm";
import BenderIcon from "../conversations/BenderIcon";

function AuthDialog() {
  const { isLoggedIn } = useGetCurrentUser();
  const [loginView, setLoginView] = useState(false);

  if (isLoggedIn) return null;
  return (
    <Dialog open fullWidth maxWidth="xs">
      <AuthDialogHeader loginView={loginView} />
      <DialogContent>
        <AuthDialogForm loginView={loginView} />
        <AuthDialogSwitcher loginView={loginView} setLoginView={setLoginView} />
      </DialogContent>
    </Dialog>
  );
}

function AuthDialogHeader({ loginView }: { loginView: boolean }) {
  return (
    <>
      <BenderIcon
        style={{
          width: "80px",
          height: "80px",
          margin: "30px auto 0px",
          padding: "10px",
        }}
      />
      {loginView ? (
        <DialogTitle textAlign="center">Welcome back</DialogTitle>
      ) : (
        <DialogTitle textAlign="center">Create an account</DialogTitle>
      )}
    </>
  );
}

function AuthDialogSwitcher({
  loginView,
  setLoginView,
}: {
  loginView: boolean;
  setLoginView: (loginView: boolean) => void;
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: "24px",
        marginTop: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        "& .MuiButton-root": {
          height: "100%",
          margin: 0,
          padding: 0,
          fontSize: "inherit",
          textTransform: "none",
          color: theme.palette.info.main,
        },
      }}
    >
      {loginView ? (
        <>
          <span>Don't have an account?</span>
          <Button onClick={() => setLoginView(false)} variant="text">
            Sign up
          </Button>
        </>
      ) : (
        <>
          <span>Already have an account?</span>
          <Button onClick={() => setLoginView(true)} variant="text">
            Log in
          </Button>
        </>
      )}
    </Box>
  );
}

function PasswordField({
  label = "Password",
  password,
  setPassword,
}: {
  label?: string;
  password: string;
  setPassword: (password: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <FormControl variant="outlined" required sx={{ marginTop: "10px" }}>
      <InputLabel htmlFor={label} sx={{ background: "#fff" }} color="info">
        {label}
      </InputLabel>
      <OutlinedInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        id={label}
        type={showPassword ? "text" : "password"}
        color="info"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={
                showPassword ? "hide the password" : "display the password"
              }
              onClick={() => setShowPassword((show) => !show)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}

function AuthDialogForm({ loginView }: { loginView: boolean }) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleContinue,
    error,
  } = useAuthForm(loginView);
  return (
    <form
      style={{ display: "flex", flexDirection: "column" }}
      onSubmit={handleContinue}
    >
      <TextField
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email"
        variant="outlined"
        required
        type="email"
        autoFocus
        color="info"
        sx={{ marginTop: "10px" }}
      />

      <PasswordField password={password} setPassword={setPassword} />

      {!loginView && (
        <PasswordField
          label="Confirm password"
          password={confirmPassword}
          setPassword={setConfirmPassword}
        />
      )}

      <FormHelperText error={!!error} sx={{ textAlign: "center" }}>
        {error}
      </FormHelperText>

      <Button
        variant="contained"
        size="large"
        sx={{ marginTop: "10px" }}
        type="submit"
        color="info"
      >
        Continue
      </Button>
    </form>
  );
}

export default AuthDialog;

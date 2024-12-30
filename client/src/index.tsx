import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { red, grey } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./components/App";
import { store } from "./store";

console.log("NODE_ENV", process.env.NODE_ENV);

const theme = createTheme({
  palette: {
    primary: {
      main: grey[300],
    },
    secondary: {
      main: grey[200],
    },
    error: {
      main: red.A400,
    },
  },
});

const queryClient = new QueryClient();

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </ThemeProvider>
);

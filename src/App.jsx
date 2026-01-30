import { createContext, useState, useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import baseTheme from "./themes/base-theme";
import lightTheme from "./themes/light-theme";
import darkTheme from "./themes/dark-theme";
import { deepmerge } from "@mui/utils";
import { Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";

import SignupPage from "./pages/index.jsx";
import ThankYouPage from "./pages/thank-you.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignupPage />,
  },
  {
    path: "/thank-you",
    element: <ThankYouPage />,
  },
]);

const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

const getDesignTokens = (mode) =>
  deepmerge(baseTheme, mode === "light" ? lightTheme : darkTheme);

export default function App() {
  const [mode, setMode] = useState("light");
  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [],
  );
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <HelmetProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="au">
            <Box sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
              <RouterProvider router={router} />
            </Box>
          </LocalizationProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </HelmetProvider>
  );
}

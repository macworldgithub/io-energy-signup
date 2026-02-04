export default {
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          "&.MuiOutlinedInput-root": {
            backgroundColor: "white",
          },
        },
      },
    },
  },
  palette: {
    mode: "light",
    text: {
      primary: "#111827", // darker grey/black
      secondary: "#6b7280", // lighter grey
      contrastText: "#FFF",
    },
    background: {
      paper: "#FFFFFF",
    },
    primary: {
      // Dark blue for 'Find' buttons
      main: "#0f172a",
    },
    secondary: {
      // Pink for branding
      main: "#ff2d55",
    },
    tertiary: {
      main: "#6964b4",
    },
    inverse: {
      main: "#FFF",
      contrastText: "#181736",
    },
    subtle: {
      main: "#e2e8f0",
      light: "#f8fafc",
      dark: "#cbd5e1",
    },
  },
};

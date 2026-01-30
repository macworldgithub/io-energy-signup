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
      primary: "#000",
      contrastText: "#FFF",
    },
    background: {
      paper: "#FFFDF4",
    },
    primary: {
      main: "#181736",
    },
    secondary: {
      main: "#FF127F",
    },
    tertiary: {
      main: "#6964b4",
    },
    inverse: {
      main: "#FFF",
      contrastText: "#181736",
    },
    subtle: {
      main: "#ccc",
      light: "#F1F2F3",
      dark: "#C5C8CC",
    },
  },
};

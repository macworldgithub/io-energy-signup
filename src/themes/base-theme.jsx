import LinkBehaviour from "./LinkBehaviour";

export default {
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehaviour,
      },
      styleOverrides: {
        textTransform: "none",
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehaviour,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          textTransform: "none",
          ...((ownerState.variant === "contained" ||
            ownerState.variant === "outlined") && {
            borderRadius: "9999px",
          }),
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 9 },
      },
    },
  },
  typography: {
    fontFamily: [
      "Montserrat",
      "Helvetica Neue",
      "-apple-system",
      "Arial",
      "sans-serif",
    ].join(","),
  },
  palette: {},
};

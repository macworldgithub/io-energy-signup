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
          fontWeight: 600,
          boxShadow: "none",
          ...((ownerState.variant === "contained" ||
            ownerState.variant === "outlined") && {
            borderRadius: "8px",
          }),
          "&:hover": {
            boxShadow: "none",
          },
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
      "Outfit",
      "Helvetica Neue",
      "-apple-system",
      "Arial",
      "sans-serif",
    ].join(","),
  },
  palette: {},
};

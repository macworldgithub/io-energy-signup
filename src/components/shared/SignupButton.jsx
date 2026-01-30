import PropTypes from "prop-types";

import { Button } from "@mui/material";

SignupButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  actionProps: PropTypes.object,
};

export default function SignupButton({
  children = "Signup",
  actionProps,
  ...props
}) {
  const link = "/signup";

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        href={link}
        {...props}
        {...actionProps}
      >
        {children}
      </Button>
    </>
  );
}

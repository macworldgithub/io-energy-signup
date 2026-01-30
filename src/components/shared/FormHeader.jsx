import PropTypes from "prop-types";
import { Stack, Box, Typography } from "@mui/material";

FormHeader.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default function FormHeader({ heading, subheading }) {
  return (
    <Stack>
      {heading && (
        <Typography
          variant="h4"
          sx={{ ml: -0.4, fontSize: { xs: "1.4rem", sm: "2rem" } }}
        >
          {heading}
        </Typography>
      )}
      {subheading instanceof String ? (
        <Typography
          variant="subtitle1"
          sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
        >
          {subheading}
        </Typography>
      ) : (
        <Box>{subheading}</Box>
      )}
    </Stack>
  );
}

import PropTypes from "prop-types";

import CircleRoundedIcon from "@mui/icons-material/CircleRounded";

BrandDot.propTypes = {
  size: PropTypes.string,
  sx: PropTypes.object,
};

// Colored dot used for full stops in headings
export default function BrandDot({ size = "md", sx = {} }) {
  let fontSize = "10px";

  if (size === "sm") {
    fontSize = "7px";
  }

  if (size === "lg") {
    fontSize = "13px";
  }

  return (
    <CircleRoundedIcon
      sx={{
        fontSize: fontSize,
        mb: "-2px",
        ml: "2px",
        color: "secondary.main",
        ...sx,
      }}
    />
  );
}

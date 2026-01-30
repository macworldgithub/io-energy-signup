import PropTypes from "prop-types";
import { Stack, Box, Typography } from "@mui/material";

TurbineLoader.propTypes = {
  width: PropTypes.string,
  time: PropTypes.number,
  progressComponent: PropTypes.node,
  text: PropTypes.string,
  textColor: PropTypes.string,
  bladeColor: PropTypes.string,
  hubColor: PropTypes.string,
  towerColor: PropTypes.string,
};

export default function TurbineLoader({
  width = "4rem",
  time = "1.5s",
  progressComponent = null,
  text = null,
  textColor = "primary",
  bladeColor = "slategrey",
  hubColor = "darkgrey",
  towerColor = "dimgrey",
}) {
  const blade = (rotation) => {
    return (
      <Box
        sx={{
          height: "10%",
          width: "50%",
          borderRadius: "42%",
          position: "absolute",
          top: "45%",
          backgroundColor: bladeColor,
          transform: rotation
            ? `translateX(100%) rotateZ(${rotation}deg) rotate(${rotation}deg) translate(50%) rotate(-${rotation}deg)`
            : null,
        }}
      />
    );
  };

  return (
    <Stack
      sx={{
        width: "fit-content",
      }}
    >
      <Stack
        direction="row"
        alignItems={progressComponent ? "flex-end" : "baseline"}
        sx={{
          width: "fit-content",
        }}
      >
        {/* Spinner */}
        <Box sx={{ width: width, aspectRatio: "4/5", position: "relative" }}>
          {/* Tower */}
          <Box
            sx={{
              height: "66%",
              width: "6%",
              borderRadius: "5px",
              position: "absolute",
              bottom: 0,
              left: "47%",
              backgroundColor: towerColor,
            }}
          />

          {/* Turbine */}
          <Box
            sx={{
              width: 1,
              aspectRatio: "1/1",
              position: "relative",
              animation: `full-rotation ${time} infinite linear`,
            }}
          >
            {/* Blades */}
            {blade()}
            {blade(120)}
            {blade(240)}

            {/* Hub */}
            <Box
              sx={{
                height: "16%",
                width: "16%",
                borderRadius: "9999px",
                position: "absolute",
                top: "42%",
                left: "42%",
                backgroundColor: hubColor,
              }}
            />
          </Box>
        </Box>

        {text && (
          <Typography
            sx={{
              color: textColor,
              ml: progressComponent ? "1rem" : "-0.5rem",
              mr: progressComponent ? "2rem" : null,
              mb: progressComponent ? "0.25rem" : 0,
              fontWeight: 400,
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </Typography>
        )}
      </Stack>
      {progressComponent}
    </Stack>
  );
}

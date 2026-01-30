import PropTypes from "prop-types";
import { Box, Button, InputBase, InputAdornment } from "@mui/material";

InputGroup.propTypes = {
  showButton: PropTypes.bool,
  buttonLabel: PropTypes.node,
  placeholder: PropTypes.string,
  inputAdornmentStart: PropTypes.element,
  input: PropTypes.element,
  inputAdornmentEnd: PropTypes.element,
  actionable: PropTypes.bool,
  disabled: PropTypes.bool,
  displayOnly: PropTypes.bool,
  value: PropTypes.string,
  setValue: PropTypes.func,
  handleSubmit: PropTypes.func,
};

// TODO this would probably be better if we used children for the input field
export default function InputGroup({
  showButton = true,
  buttonLabel = "Submit",
  placeholder,
  inputAdornmentStart,
  input,
  inputAdornmentEnd,
  actionable = true,
  disabled,
  displayOnly,
  value,
  setValue,
  handleSubmit,
}) {
  const inputElement = input || (
    <InputBase
      placeholder={placeholder}
      value={value}
      disabled={disabled || displayOnly}
      sx={[{ flex: 1, pb: 0.25 }, !inputAdornmentStart && { pl: 2.5 }]}
      inputProps={{
        sx: {
          fontWeight: "medium",
          "&.Mui-disabled": {
            color: "white",
            WebkitTextFillColor: "white",
            fontWeight: "bold",
            letterSpacing: "0.02rem",
          },
        },
      }}
      onChange={(event) => {
        setValue(event.target.value);
      }}
    />
  );
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      bgcolor={disabled ? "primary.light" : "white"}
      sx={{
        p: 0,
        display: "flex",
        alignItems: "center",
        borderRadius: "9999px",
        position: "relative",
        minHeight: "3rem",
        bgcolor: displayOnly ? "primary.light" : "white",
      }}
      className="input-group"
    >
      {inputAdornmentStart && (
        <InputAdornment position="start">{inputAdornmentStart}</InputAdornment>
      )}
      {inputElement}
      {inputAdornmentEnd && (
        <InputAdornment position="end">{inputAdornmentEnd}</InputAdornment>
      )}

      {showButton && (
        <Button
          variant="contained"
          color="secondary"
          disabled={!actionable}
          sx={{
            margin: 0.5,
            mb: "0.4rem",
            mr: "0.4rem",
            px: 6,
            borderRadius: "9999px",
            border: 1,
            borderColor: "transparent",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            "&.Mui-disabled": {
              bgcolor: "white",
              borderColor: "secondary.main",
              color: "secondary.main",
            },
          }}
          onClick={handleSubmit}
          className="input-group-button"
        >
          {buttonLabel}
        </Button>
      )}
    </Box>
  );
}

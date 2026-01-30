import PropTypes from "prop-types";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Typography,
} from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/system/colorManipulator";

RadioButtons.propTypes = {
  list: PropTypes.array,
  label: PropTypes.string,
  value: PropTypes.any,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  handleChange: PropTypes.func,
};

export function RadioButtons({
  list,
  label,
  value,
  helperText,
  error,
  handleChange,
}) {
  const theme = useTheme();

  return (
    <FormControl
      component="fieldset"
      error={error}
      variant="standard"
      sx={{ display: "block" }}
    >
      {label && (
        <Typography variant="body1" sx={{ my: 2, fontWeight: "medium" }}>
          {label}
        </Typography>
      )}
      <RadioGroup
        row
        aria-label={label}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        sx={{ ml: 1 }}
      >
        {list.map((item, index) => (
          <FormControlLabel
            key={index}
            disabled={item.disabled}
            value={item.value}
            control={
              <Radio
                checkedIcon={<CheckCircleOutlineOutlinedIcon />}
                disableRipple
                sx={{
                  color: "subtle.main",
                  "&.Mui-checked": {
                    color: "secondary.main",
                  },
                }}
              />
            }
            label={item.label}
            componentsProps={{ typography: { fontWeight: "normal" } }}
            sx={{
              border: 1,
              borderColor: "grey.300",
              borderRadius: 2,
              bgcolor: "white",
              mt: 1.5,
              mr: 3,
              pr: 2,
              boxShadow: 0,
              "&:hover": {
                boxShadow: 2,
              },
              "&:has(.Mui-checked)": {
                bgcolor: "white",
                borderColor: alpha(theme.palette.secondary.light, 0.5),
                boxShadow: 4,
              },
            }}
          />
        ))}
      </RadioGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}

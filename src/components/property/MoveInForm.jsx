import PropTypes from "prop-types";
import { Stack, Box, Typography, FormHelperText } from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { RadioButtons } from "../shared/RadioButtons";

import { useFormik } from "formik";
import { moveInValidationSchema } from "../../util/formValidation";

MoveInForm.propTypes = {
  moveIn: PropTypes.object,
  handleMoveInChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default function MoveInForm({ moveIn, handleMoveInChange, disabled }) {
  const formik = useFormik({
    initialValues: {
      flag: moveIn.flag || "",
      date: moveIn.date || null,
    },
    validationSchema: moveInValidationSchema,
    validateOnChange: false,
    validateOnBlur: true,
  });

  const handleBlur = (event) => {
    formik.handleBlur(event);
  };

  const update = async (event) => {
    const field = event.target.name;
    const value = event.target.value;
    await formik.setFieldValue(field, value);
    handleMoveInChange({ ...moveIn, [field]: value });
  };

  return (
    <Stack sx={{ mt: 3 }}>
      <RadioButtons
        list={[
          { value: true, label: "Yes", disabled: disabled },
          { value: false, label: "No", disabled: disabled },
        ]}
        label="Are you about to move into this property?"
        value={formik.values.flag}
        handleChange={(value) => {
          update({ target: { name: "flag", value: value } });
        }}
      />

      {moveIn.flag === "true" ? (
        <Box sx={{ my: 1 }}>
          <Typography color="rgba(0,0,0,0.6)" fontSize="16px" my={1}>
            Please select your move in date
          </Typography>
          <Box my={2}>
            <DatePicker
              disablePast
              label="Expected move in date"
              value={moveIn.date}
              name="date"
              onChange={(value) =>
                update({ target: { name: "date", value: value } })
              }
              onBlur={handleBlur}
              margin="normal"
              slotProps={{ textField: { variant: "outlined" } }}
            />
            <FormHelperText error>{formik.errors.date}</FormHelperText>
          </Box>
          <Typography
            variant="body2"
            color="rgba(0,0,0,0.6)"
            fontSize="13px"
            sx={{ my: 1 }}
          >
            Note - SA Power Network is not able to connect power on weekends or
            public holidays
          </Typography>
        </Box>
      ) : null}
    </Stack>
  );
}

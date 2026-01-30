import PropTypes from "prop-types";

import { Grid, TextField } from "@mui/material";

import { useFormik } from "formik";
import { businessDetailsValidationSchema } from "../../util/formValidation";

BusinessDetailsForm.propTypes = {
  details: PropTypes.object,
  handleBusinessDetailsChange: PropTypes.func,
};

export default function BusinessDetailsForm({
  details,
  handleBusinessDetailsChange,
}) {
  const formik = useFormik({
    initialValues: {
      business_name: details.business_name || "",
      abn_number: details.abn_number || "",
    },
    validationSchema: businessDetailsValidationSchema,
    validateOnChange: false,
    validateOnBlur: true,
  });

  const handleBlur = (event) => {
    formik.handleBlur(event);
    update(event);
  };

  const update = async (event) => {
    const field = event.target.name;
    const value = event.target.value;
    await formik.setFieldValue(field, value);
    handleBusinessDetailsChange({ [field]: value });
  };

  return (
    <>
      <Grid
        container
        spacing={1}
        justifyContent={"space-between"}
        sx={{ my: 2 }}
      >
        <Grid item xs={12} md={7.5}>
          <TextField
            id="business_name"
            data-cy="business_name"
            name="business_name"
            label="Business Name"
            type="text"
            autoComplete="off"
            onChange={formik.handleChange}
            onBlur={handleBlur}
            value={formik.values.business_name || ""}
            error={
              formik.touched.business_name &&
              Boolean(formik.errors.business_name)
            }
            helperText={
              formik.touched.business_name && formik.errors.business_name
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4.5}>
          <TextField
            id="abn_number"
            data-cy="abn_number"
            name="abn_number"
            label="ABN"
            type="text"
            autoComplete="off"
            onChange={formik.handleChange}
            onBlur={handleBlur}
            value={formik.values.abn_number || ""}
            error={
              formik.touched.abn_number && Boolean(formik.errors.abn_number)
            }
            helperText={formik.touched.abn_number && formik.errors.abn_number}
            fullWidth
          />
        </Grid>
      </Grid>
    </>
  );
}

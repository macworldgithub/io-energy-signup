import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import {
  Grid,
  Box,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Stack,
  InputAdornment,
} from "@mui/material";
import { useFormik } from "formik";
import {
  contactValidationSchema,
  contactValidationSchemaWithID,
} from "../../util/formValidation";

ContactDetailsForm.propTypes = {
  idRequired: PropTypes.bool,
  details: PropTypes.object,
  handleDetailsChange: PropTypes.func,
  billingSame: PropTypes.bool,
  handleBillingToggle: PropTypes.func,
};

export default function ContactDetailsForm({
  idRequired,
  details,
  handleDetailsChange,
  billingSame,
  handleBillingToggle,
}) {
  const formik = useFormik({
    initialValues: {
      given_name: details.given_name || "",
      family_name: details.family_name || "",
      email: details.email || "",
      phone: details.phone || "",
    },
    enableReinitialize: true,
    validationSchema: idRequired
      ? contactValidationSchemaWithID
      : contactValidationSchema,
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
    await formik.setFieldValue(field, value, false);
    handleDetailsChange({
      [field]: value,
    });
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Contact details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We'll use these details to manage your account and send important
          updates.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="given_name"
            placeholder="Your first name"
            onChange={update}
            onBlur={handleBlur}
            value={formik.values.given_name}
            error={formik.touched.given_name && Boolean(formik.errors.given_name)}
            helperText={formik.touched.given_name && formik.errors.given_name}
            size="small"
            InputProps={{ sx: { bgcolor: "white", borderRadius: 2 } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="family_name"
            placeholder="Your last name"
            onChange={update}
            onBlur={handleBlur}
            value={formik.values.family_name}
            error={formik.touched.family_name && Boolean(formik.errors.family_name)}
            helperText={formik.touched.family_name && formik.errors.family_name}
            size="small"
            InputProps={{ sx: { bgcolor: "white", borderRadius: 2 } }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            name="email"
            placeholder="Email"
            onChange={update}
            onBlur={handleBlur}
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            size="small"
            InputProps={{ sx: { bgcolor: "white", borderRadius: 2 } }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            name="phone"
            placeholder="Phone number"
            onChange={update}
            onBlur={handleBlur}
            value={formik.values.phone}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            size="small"
            InputProps={{
              sx: { bgcolor: "white", borderRadius: 2 },
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    component="img"
                    src="https://flagcdn.com/w20/au.png"
                    sx={{ width: 20, mr: 1 }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Box>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
          Billing address
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={billingSame}
              onChange={(e) => handleBillingToggle(e.target.checked)}
              sx={{ color: "#bdc3c7", "&.Mui-checked": { color: "#ff2d55" } }}
            />
          }
          label={<Typography variant="body2">Same as property address</Typography>}
        />
      </Box>
    </Stack>
  );
}

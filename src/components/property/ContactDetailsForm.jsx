import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import {
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  Menu,
  MenuItem,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTime } from "luxon";

import { useFormik } from "formik";
import {
  contactValidationSchema,
  contactValidationSchemaWithID,
} from "../../util/formValidation";

ContactDetailsForm.propTypes = {
  idRequired: PropTypes.bool,
  excludeExistingContacts: PropTypes.bool,
  details: PropTypes.object,
  contacts: PropTypes.array,
  excludeEmail: PropTypes.string,
  handleDetailsChange: PropTypes.func,
  lockCoreDetails: PropTypes.bool, // NEW
};

export default function ContactDetailsForm({
  idRequired,
  excludeExistingContacts,
  details,
  contacts,
  excludeEmail,
  handleDetailsChange,
  lockCoreDetails = false,
}) {
  let initialValues = {
    title: details?.title || "",
    given_name: details.given_name || "",
    family_name: details.family_name || "",
    email: details.email || "",
    phone: details.phone || "",
    dob: details.dob || null,
    idRequired: idRequired,
    excludeEmail: excludeEmail,
  };

  if (idRequired) {
    initialValues = {
      ...initialValues,
      idType: details.idType || "",
      idNumber: details.idNumber || "",
      idExpiry: details.idExpiry || null,
    };
  }

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // so updates from parent are reflected
    validationSchema: idRequired
      ? contactValidationSchemaWithID
      : contactValidationSchema,
    validateOnChange: false,
    validateOnBlur: true,
  });

  useEffect(
    () => {
      formik.validateForm();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [details],
  );

  useEffect(
    () => {
      formik.setFieldValue("excludeEmail", excludeEmail, false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [excludeEmail],
  );

  useEffect(
    () => {
      formik.validateForm();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formik.values.excludeEmail],
  );

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

  const eighteenYearsAgo = DateTime.now().minus({ years: 18 });
  return (
    <Grid
      container
      spacing={1}
      justifyContent={"space-between"}
      sx={{ position: "relative", mt: 1, mb: 3 }}
    >
      <Grid item xs={12} md={3} sx={{ mt: { xs: 6, md: 1.5 } }}>
        <FormControl fullWidth>
          <InputLabel
            error={formik.touched.title && Boolean(formik.errors.title)}
          >
            Title
          </InputLabel>
          <Select
            name="title"
            data-cy="contact-title"
            value={formik.values.title}
            label="Title"
            onChange={lockCoreDetails ? undefined : update}
            onBlur={lockCoreDetails ? undefined : handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            sx={{ bgcolor: "white" }}
            disabled={lockCoreDetails}
          >
            <MenuItem value={"MR"}>Mr</MenuItem>
            <MenuItem value={"MRS"}>Mrs</MenuItem>
            <MenuItem value={"MS"}>Ms</MenuItem>
            <MenuItem value={"MISS"}>Miss</MenuItem>
            <MenuItem value={"DR"}>Dr</MenuItem>
          </Select>
          <FormHelperText
            hidden={!(formik.touched.title && Boolean(formik.errors.title))}
            error
          >
            {formik.errors.title}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4.5} sx={{ mt: 1.5 }}>
        <TextField
          fullWidth
          name="given_name"
          label="First Name"
          data-cy="contact-first-name"
          onChange={lockCoreDetails ? undefined : update}
          onBlur={lockCoreDetails ? undefined : handleBlur}
          value={formik.values.given_name}
          error={formik.touched.given_name && Boolean(formik.errors.given_name)}
          helperText={formik.touched.given_name && formik.errors.given_name}
          onKeyDown={(evt) => evt.key === "," && evt.preventDefault()}
          InputProps={{ sx: { bgcolor: "white" } }}
          disabled={lockCoreDetails}
        />
      </Grid>
      <Grid item xs={12} md={4.5} sx={{ mt: 1.5 }}>
        <TextField
          fullWidth
          name="family_name"
          label="Surname"
          data-cy="contact-last-name"
          onChange={lockCoreDetails ? undefined : update}
          onBlur={lockCoreDetails ? undefined : handleBlur}
          value={formik.values.family_name}
          error={
            formik.touched.family_name && Boolean(formik.errors.family_name)
          }
          helperText={formik.touched.family_name && formik.errors.family_name}
          onKeyDown={(evt) => evt.key === "," && evt.preventDefault()}
          InputProps={{ sx: { bgcolor: "white" } }}
          disabled={lockCoreDetails}
        />
      </Grid>

      <Grid item xs={12} md={7.5} sx={{ mt: 1.5 }}>
        <TextField
          data-cy="contact-email"
          name="email"
          label="Email"
          fullWidth
          onChange={lockCoreDetails ? undefined : update}
          onBlur={lockCoreDetails ? undefined : handleBlur}
          value={formik.values.email}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          onKeyDown={(evt) => evt.key === "," && evt.preventDefault()}
          InputProps={{ sx: { bgcolor: "white" } }}
          disabled={lockCoreDetails}
        />
      </Grid>
      <Grid item xs={12} md={4.5} sx={{ mt: 1.5 }}>
        <TextField
          data-cy="contact-phone-number"
          name="phone"
          label="Phone"
          fullWidth
          onChange={lockCoreDetails ? undefined : update}
          onBlur={lockCoreDetails ? undefined : handleBlur}
          value={formik.values.phone}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
          onKeyDown={(evt) => evt.key === "," && evt.preventDefault()}
          InputProps={{ sx: { bgcolor: "white" } }}
          disabled={lockCoreDetails}
        />
      </Grid>

      {/* ID / DOB still editable for credit check */}
      <Grid
        item
        xs={12}
        md={7.5}
        sx={{ mt: { xs: 1.5, md: idRequired ? 2.5 : 1.5 } }}
      >
        {idRequired && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Identity Information
            </Typography>
            <Typography variant="body2">
              We just need to do a little credit check on our end
            </Typography>
          </>
        )}
      </Grid>
      <Grid
        item
        xs={12}
        md={4.5}
        sx={{ mt: { xs: 1.5, md: idRequired ? 5 : 1.5 } }}
      >
        <DatePicker
          maxDate={eighteenYearsAgo}
          label="Date of birth"
          name="dob"
          value={formik.values.dob}
          onChange={(newValue) => {
            update({
              target: { name: "dob", value: newValue },
            });
          }}
          margin="normal"
          slotProps={{ textField: { variant: "outlined" } }}
          sx={{ width: 1 }}
        />
        <FormHelperText
          hidden={!(formik.touched.dob && Boolean(formik.errors.dob))}
          error
        >
          {formik.errors.dob}
        </FormHelperText>
      </Grid>
      {idRequired && (
        <>
          <Grid item xs={12} sx={{ mt: 1.5 }}>
            <FormControl fullWidth>
              <InputLabel
                error={formik.touched.idType && Boolean(formik.errors.idType)}
                id="identityTypeLabel"
              >
                Please choose one Identity Type
              </InputLabel>
              <Select
                id="idType"
                name="idType"
                label="Please choose one Identity Type"
                onChange={update}
                onBlur={handleBlur}
                value={formik.values.idType}
                error={formik.touched.idType && Boolean(formik.errors.idType)}
              >
                <MenuItem value={"Drivers Licence"}>Drivers Licence</MenuItem>
                <MenuItem value={"Passport"}>Passport</MenuItem>
                <MenuItem value={"Medicare"}>Medicare</MenuItem>
              </Select>
              <FormHelperText
                hidden={
                  !(formik.touched.idType && Boolean(formik.errors.idType))
                }
                error
              >
                {formik.errors.idType}
              </FormHelperText>
            </FormControl>
          </Grid>

          {formik.values.idType !== "" && (
            <Grid
              item
              xs={12}
              sm={12}
              md={formik.values.idType !== "Medicare" ? 7.5 : 12}
              sx={{ mt: 1.5 }}
            >
              <TextField
                required
                id="idNumber"
                name="idNumber"
                data-cy="idNumber"
                label={(formik.values.idType || "ID") + " Number"}
                fullWidth
                onChange={update}
                onBlur={handleBlur}
                value={formik.values.idNumber}
                error={
                  formik.touched.idNumber && Boolean(formik.errors.idNumber)
                }
                onKeyDown={(evt) => evt.key === "," && evt.preventDefault()}
              />
              <FormHelperText
                hidden={
                  !(formik.touched.idNumber && Boolean(formik.errors.idNumber))
                }
                error
              >
                {formik.errors.idNumber}
              </FormHelperText>
            </Grid>
          )}
          {formik.values.idType !== "" &&
            formik.values.idType !== "Medicare" && (
              <Grid item xs={12} md={4.5} sx={{ mt: 1.5 }}>
                <DatePicker
                  disablePast
                  label="Expiry date"
                  name="idExpiry"
                  value={formik.values.idExpiry}
                  onChange={(newValue) => {
                    const e = {
                      target: { name: "idExpiry", value: newValue },
                    };
                    formik.handleChange(e);
                    update(e);
                  }}
                  onBlur={handleBlur}
                  margin="normal"
                  slotProps={{ textField: { variant: "outlined" } }}
                  sx={{ width: 1 }}
                />
                <FormHelperText
                  hidden={
                    !(
                      formik.touched.idExpiry && Boolean(formik.errors.idExpiry)
                    )
                  }
                  error
                >
                  {formik.errors.idExpiry}
                </FormHelperText>
              </Grid>
            )}
        </>
      )}
    </Grid>
  );
}

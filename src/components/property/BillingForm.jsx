import PropTypes from "prop-types";

import {
  Grid,
  Box,
  TextField,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { RadioButtons } from "../shared/RadioButtons";

import { useFormik } from "formik";
import { paymentValidationSchema } from "../../util/formValidation";

import {
  DIRECT_DEBIT_DEF,
  buildPlainTextFromDef,
  renderBullets,
} from "../../constants/consentText";

BillingForm.propTypes = {
  payment: PropTypes.object,
  handleBillingChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default function BillingForm({
  payment,
  handleBillingChange,
  disabled,
}) {
  const formik = useFormik({
    initialValues: {
      method: payment.method || "DIRECT",
      bsb: payment.bsb || "",
      account: payment.account || "",
      accountName: payment.accountName || "",
      direct_debit_terms_accepted: payment.direct_debit_terms_accepted || null,
      direct_debit_consent_bundle: payment.direct_debit_consent_bundle || null,
    },
    validationSchema: paymentValidationSchema,
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
    handleBillingChange({ [field]: value });
  };
  const ddVars = {
    retailerName: "iO Energy",
    schemeLabel: "Bulk Electronic Clearing System",
  };

  const ddUrls = {
    directDebitAgreementUrl: new URL(
      `/src/assets/files/io-energy-eddrsa-202509.pdf`,
      import.meta.url,
    ).href,
  };

  const ddPlain = buildPlainTextFromDef(DIRECT_DEBIT_DEF, ddVars, ddUrls);
  const ddBulletsJSX = renderBullets(DIRECT_DEBIT_DEF, ddVars, ddUrls);

  return (
    <form name="PaymentForm" onSubmit={formik.handleSubmit}>
      <Box mb={5}>
        <RadioButtons
          list={[
            {
              value: "DIRECT",
              label: "Direct debit",
              disabled: disabled,
            },
            { value: "CHEQUE", label: "Other", disabled: disabled },
          ]}
          value={formik.values.method}
          handleChange={(value) => {
            update({ target: { name: "method", value: value } });
          }}
        />

        {formik.values.method === "DIRECT" && (
          <Grid container spacing={2} sx={{ mt: 0, maxWidth: "sm" }}>
            <Grid item xs={12}>
              <TextField
                id="bsb"
                name="bsb"
                data-cy="bsb-field"
                label="BSB"
                margin="normal"
                type="number"
                fullWidth
                onChange={formik.handleChange}
                onBlur={handleBlur}
                value={formik.values.bsb}
                error={formik.touched.bsb && Boolean(formik.errors.bsb)}
                helperText={formik.touched.bsb && formik.errors.bsb}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="account"
                name="account"
                data-cy="accNo-field"
                label="Account Number"
                margin="normal"
                type="number"
                fullWidth
                onChange={formik.handleChange}
                onBlur={handleBlur}
                value={formik.values.account}
                error={formik.touched.account && Boolean(formik.errors.account)}
                helperText={formik.touched.account && formik.errors.account}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="accountName"
                name="accountName"
                data-cy="accName-field"
                label="Account Name"
                margin="normal"
                type="text"
                fullWidth
                onChange={formik.handleChange}
                onBlur={handleBlur}
                value={formik.values.accountName}
                error={
                  formik.touched.accountName &&
                  Boolean(formik.errors.accountName)
                }
                helperText={
                  formik.touched.accountName && formik.errors.accountName
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  maxHeight: 240,
                  overflowY: "auto",
                  p: 1.5,
                  bgcolor: "white",
                  border: "1px solid #4b5563",
                  borderRadius: 1,
                }}
              >
                <strong>{DIRECT_DEBIT_DEF.header}</strong>
                <ul
                  style={{
                    paddingInlineStart: "1.25rem",
                    marginTop: 8,
                  }}
                >
                  {ddBulletsJSX}
                </ul>
              </Box>

              <FormControl margin="dense">
                <FormControlLabel
                  sx={{ mt: 1 }}
                  control={
                    <Checkbox
                      size="small"
                      id="direct_debit_terms_accepted"
                      checked={formik.values.direct_debit_terms_accepted}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const bundle = checked
                          ? {
                              version_label: DIRECT_DEBIT_DEF.version_label,
                              text: ddPlain,
                              links: {
                                direct_debit_agreement_url:
                                  ddUrls.directDebitAgreementUrl,
                              },
                            }
                          : null;

                        formik.setFieldValue(
                          "direct_debit_terms_accepted",
                          checked,
                        );
                        formik.setFieldValue(
                          "direct_debit_consent_bundle",
                          bundle,
                        );

                        handleBillingChange({
                          direct_debit_terms_accepted: checked,
                          direct_debit_consent_bundle: bundle,
                        });
                      }}
                    />
                  }
                  label="I authorise the above direct debit arrangement"
                />
              </FormControl>
            </Grid>
          </Grid>
        )}

        {formik.values.method === "CHEQUE" && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" sx={{ ml: 2, maxWidth: "lg" }}>
              We recommend setting up direct debit to avoid transaction and late
              payment fees, and you can also pay using BPAY, bank transfer,
              credit card or cheque; further details will be on your bills.
            </Typography>
            <Typography variant="body1" sx={{ ml: 2, mt: 1, maxWidth: "lg" }}>
              You can set up direct debit payment via Credit Card if you call
              1300 313 463. For your security we will not collect that
              information online.
            </Typography>
          </Box>
        )}
      </Box>
    </form>
  );
}

import PropTypes from "prop-types";
import {
  Grid,
  Box,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Stack,
  Card,
  CardActionArea,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useFormik } from "formik";

BillingForm.propTypes = {
  payment: PropTypes.object,
  handleBillingChange: PropTypes.func,
  disabled: PropTypes.bool,
  consents: PropTypes.object,
  handleConsentChange: PropTypes.func,
};

export default function BillingForm({
  payment,
  handleBillingChange,
  disabled,
  consents,
  handleConsentChange,
}) {
  const formik = useFormik({
    initialValues: {
      method: payment.method || "CC",
      bsb: payment.bsb || "",
      account: payment.account || "",
      accountName: payment.accountName || "",
      cc_number: payment.cc_number || "",
      cc_name: payment.cc_name || "",
      cc_expiry: payment.cc_expiry || "",
      cc_cvv: payment.cc_cvv || "",
      tips_accepted: payment.tips_accepted || false,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
  });

  const handleBlur = (event) => {
    formik.handleBlur(event);
    update(event);
  };

  const update = async (event) => {
    let field = event.target.name;
    let value = event.target.value;

    if (event.target.type === "checkbox") {
      value = event.target.checked;
    }

    await formik.setFieldValue(field, value);
    handleBillingChange({ [field]: value });
  };

  const handleMethodChange = (newMethod) => {
    formik.setFieldValue("method", newMethod);
    handleBillingChange({ method: newMethod });
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Payment & consent
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Set up your payment method and review the terms to complete your signup.
        </Typography>
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Payment method
        </Typography>
        <Stack spacing={1.5}>
          <Card
            sx={{
              border: formik.values.method === "CC" ? "2px solid #ff2d55" : "1px solid #e0e0e0",
              bgcolor: "#fff",
              borderRadius: 2,
              opacity: disabled ? 0.7 : 1
            }}
            elevation={0}
          >
            <CardActionArea
              onClick={() => !disabled && handleMethodChange("CC")}
              sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 2 }}
            >
              <CreditCardIcon sx={{ color: "#333" }} />
              <Typography variant="body2" fontWeight={500}>Credit Card</Typography>
            </CardActionArea>
          </Card>

          <Card
            sx={{
              border: formik.values.method === "DIRECT" ? "2px solid #ff2d55" : "1px solid #e0e0e0",
              bgcolor: "#fff",
              borderRadius: 2,
              opacity: disabled ? 0.7 : 1
            }}
            elevation={0}
          >
            <CardActionArea
              onClick={() => !disabled && handleMethodChange("DIRECT")}
              sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 2 }}
            >
              <AccountBalanceIcon sx={{ color: "#333" }} />
              <Typography variant="body2" fontWeight={500}>Direct Debit</Typography>
            </CardActionArea>
          </Card>
        </Stack>
      </Box>

      {formik.values.method === "CC" && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Card number
            </Typography>
            <TextField
              fullWidth
              name="cc_number"
              placeholder="Your card number"
              value={formik.values.cc_number}
              onChange={update}
              onBlur={handleBlur}
              size="small"
              InputProps={{ sx: { bgcolor: "white", borderRadius: 2 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Expiry date
            </Typography>
            <TextField
              fullWidth
              name="cc_expiry"
              placeholder="MM/YY"
              value={formik.values.cc_expiry}
              onChange={update}
              onBlur={handleBlur}
              size="small"
              InputProps={{ sx: { bgcolor: "white", borderRadius: 2 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              CVV
            </Typography>
            <TextField
              fullWidth
              name="cc_cvv"
              placeholder="123"
              value={formik.values.cc_cvv}
              onChange={update}
              onBlur={handleBlur}
              size="small"
              InputProps={{ sx: { bgcolor: "white", borderRadius: 2 } }}
            />
          </Grid>
        </Grid>
      )}

      {formik.values.method === "DIRECT" && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              BSB
            </Typography>
            <TextField
              fullWidth
              name="bsb"
              placeholder="000-000"
              value={formik.values.bsb}
              onChange={update}
              onBlur={handleBlur}
              size="small"
              InputProps={{ sx: { bgcolor: "white", borderRadius: 2 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Account Number
            </Typography>
            <TextField
              fullWidth
              name="account"
              placeholder="Account number"
              value={formik.values.account}
              onChange={update}
              onBlur={handleBlur}
              size="small"
              InputProps={{ sx: { bgcolor: "white", borderRadius: 2 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Account Name
            </Typography>
            <TextField
              fullWidth
              name="accountName"
              placeholder="Account name"
              value={formik.values.accountName}
              onChange={update}
              onBlur={handleBlur}
              size="small"
              InputProps={{ sx: { bgcolor: "white", borderRadius: 2 } }}
            />
          </Grid>
        </Grid>
      )}

      <Stack spacing={0.5}>
        <FormControlLabel
          control={
            <Checkbox
              checked={consents.contract_terms_accepted}
              onChange={(e) => handleConsentChange({ contract_terms_accepted: e.target.checked })}
              sx={{ color: "#bdc3c7", "&.Mui-checked": { color: "#ff2d55" } }}
            />
          }
          label={
            <Typography variant="body2">
              I agree to the <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span> and <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Energy Contract</span>
            </Typography>
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              name="tips_accepted"
              checked={formik.values.tips_accepted}
              onChange={(e) => update(e)}
              sx={{ color: "#bdc3c7", "&.Mui-checked": { color: "#ff2d55" } }}
            />
          }
          label={<Typography variant="body2">Send me energy saving tips and special offers</Typography>}
        />
      </Stack>
    </Stack>
  );
}

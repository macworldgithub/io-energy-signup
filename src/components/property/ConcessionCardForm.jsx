import PropTypes from "prop-types";
import {
  // Grid,
  Stack,
  // TextField,
  // FormControl,
  // InputLabel,
  // MenuItem,
  // Select,
  Typography,
  Box,
} from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { RadioButtons } from "../shared/RadioButtons";

// import concessionsForState from "../../constants/concessionCards.js";
import { useFormik } from "formik";
import { concessionValidationSchema } from "../../util/formValidation";

ConcessionCardForm.propTypes = {
  address: PropTypes.object,
  concessionCard: PropTypes.object,
  handleConcessionCardChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default function ConcessionCardForm({
  // address,
  concessionCard,
  handleConcessionCardChange,
  disabled,
}) {
  const formik = useFormik({
    initialValues: {
      flag: concessionCard.flag || "",
      // name: concessionCard.name || "",
      // type: concessionCard.type || "",
      // number: concessionCard.number || "",
      // expiryDate: concessionCard.expiryDate || null,
    },
    validationSchema: concessionValidationSchema,
    validateOnChange: false,
    validateOnBlur: true,
  });

  // const handleBlur = (event) => {
  //   formik.handleBlur(event);
  // };

  const update = async (event) => {
    const field = event.target.name;
    const value = event.target.value;
    await formik.setFieldValue(field, value);
    handleConcessionCardChange({ [field]: value });
  };

  // const concessions = concessionsForState(address.site_state);

  return (
    <Stack sx={{ mt: 3 }}>
      <RadioButtons
        list={[
          { value: true, label: "Yes", disabled: disabled },
          { value: false, label: "No", disabled: disabled },
        ]}
        label="Does a resident at this property hold a concession card?"
        value={formik.values.flag}
        handleChange={(value) => {
          update({ target: { name: "flag", value: value } });
        }}
      />

      {concessionCard.flag === "true" && (
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            borderRadius: 1.25,
          }}
        >
          <Typography variant="caption" sx={{ color: "#9ca3af" }}>
            We’re unable to process concessions directly in South Australia.
            Once your new account has been set up with iO Energy, you’ll need to
            call ConcessionsSA on 1800 307 758 with your updated account
            details. This step is required even if you’ve previously registered,
            as concessions will only apply once you’ve provided your new account
            information.
          </Typography>
        </Box>
        // <Grid container my={1} spacing={1} justifyContent={"space-between"}>
        //   <Grid item xs={12} sx={{ mt: 1.5 }}>
        //     <TextField
        //       id="concessionCardName"
        //       data-cy="concessionCardName"
        //       name="name"
        //       label="Concession Card Name"
        //       type="text"
        //       value={formik.values.name}
        //       fullWidth
        //       onChange={update}
        //       onBlur={handleBlur}
        //       error={formik.touched.name && Boolean(formik.errors.name)}
        //       helperText={formik.touched.name && formik.errors.name}
        //       onKeyDown={(evt) => evt.key === "," && evt.preventDefault()}
        //     />
        //   </Grid>
        //   <Grid item xs={12} sx={{ mt: 1.5 }}>
        //     <FormControl fullWidth>
        //       <InputLabel>Concession Card Type</InputLabel>
        //       <Select
        //         labelId="concession-card-type-select-label"
        //         id="concessionCardType"
        //         data-cy="concession-select"
        //         label="concession-card-type"
        //         name="type"
        //         value={formik.values.type || ""}
        //         onChange={update}
        //         error={formik.touched.type && Boolean(formik.errors.type)}
        //       >
        //         {Object.entries(concessions).map(([key, value]) => (
        //           <MenuItem key={key} value={key}>
        //             {value.card_type_desc}
        //           </MenuItem>
        //         ))}
        //       </Select>
        //     </FormControl>
        //   </Grid>
        //   <Grid item xs={12} md={8} sx={{ mt: 1.5 }}>
        //     <TextField
        //       id="concessionCardNumber"
        //       data-cy="concessionCardNumber"
        //       name="number"
        //       label="Concession Card Number"
        //       type="text"
        //       value={formik.values.number}
        //       fullWidth
        //       onChange={update}
        //       onBlur={handleBlur}
        //       error={formik.touched.number && Boolean(formik.errors.number)}
        //       helperText={formik.touched.number && formik.errors.number}
        //       onKeyDown={(evt) => evt.key === "," && evt.preventDefault()}
        //     />
        //   </Grid>
        //   <Grid item xs={12} md={4} sx={{ mt: 1.5 }}>
        //     <DatePicker
        //       disablePast
        //       label="Expiry date"
        //       value={formik.values.expiryDate}
        //       name="expiryDate"
        //       onChange={(value) =>
        //         update({ target: { name: "expiryDate", value: value } })
        //       }
        //       margin="normal"
        //       slotProps={{
        //         textField: {
        //           variant: "outlined",
        //           error:
        //             formik.touched.expiryDate &&
        //             Boolean(formik.errors.expiryDate),
        //           helperText:
        //             formik.touched.expiryDate && formik.errors.expiryDate,
        //         },
        //       }}
        //     />
        //   </Grid>
        // </Grid>
      )}
    </Stack>
  );
}

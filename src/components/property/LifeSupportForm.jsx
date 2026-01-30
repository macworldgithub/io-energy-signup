import { useState } from "react";
import PropTypes from "prop-types";
import {
  Stack,
  Box,
  TextField,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { RadioButtons } from "../shared/RadioButtons";

import LifeSupportModal from "./LifeSupportModal";
import lifeSupportMachines from "../../constants/lifeSupportMachines.js";
import { useFormik } from "formik";
import { lifeSupportValidationSchema } from "../../util/formValidation";

LocationForm.propTypes = {
  lifeSupport: PropTypes.object,
  handleLifeSupportChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default function LocationForm({
  lifeSupport,
  handleLifeSupportChange,
  disabled,
}) {
  const [modelOpen, setModalOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      flag: lifeSupport.flag || "",
      machineType: lifeSupport.machineType || "",
      notes: lifeSupport.notes || "",
    },
    validationSchema: lifeSupportValidationSchema,
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
    handleLifeSupportChange({ ...lifeSupport, [field]: value });
  };

  return (
    <Stack sx={{ mt: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <RadioButtons
          list={[
            { value: true, label: "Yes", disabled: disabled },
            { value: false, label: "No", disabled: disabled },
          ]}
          label="Does anyone at this property require life support equipment?"
          value={formik.values.flag}
          handleChange={(value) => {
            update({ target: { name: "flag", value: value } });
            if (value === "true") setModalOpen(true);
          }}
        />
        <Button variant="text" onClick={() => setModalOpen(true)}>
          <InfoOutlinedIcon />
        </Button>
      </Stack>

      {lifeSupport.flag === "true" && (
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mt: 1.5 }}>
            <InputLabel>Life Support Equipment Type</InputLabel>
            <Select
              labelId="life-support-type-select-label"
              id="lifeSupportType"
              data-cy="lifeSupport-select"
              label="life-support-type"
              name="machineType"
              value={formik.values.machineType || ""}
              onChange={update}
              onBlur={handleBlur}
            >
              {Object.entries(lifeSupportMachines).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormHelperText error>{formik.errors.machineType}</FormHelperText>
        </Box>
      )}
      {lifeSupport.flag === "true" && lifeSupport.machineType === "OTHER" && (
        <>
          <TextField
            id="ls-notes"
            data-cy="ls-notes"
            name="notes"
            label="Equipment details"
            required
            type="text"
            value={formik.values.notes || ""}
            onChange={formik.handleChange}
            onBlur={handleBlur}
            error={formik.touched.notes && Boolean(formik.errors.notes)}
            helperText={formik.touched.notes && formik.errors.notes}
            fullWidth
            sx={{ mt: 1.5 }}
          />
        </>
      )}
      <LifeSupportModal
        open={modelOpen}
        handleClose={() => setModalOpen(false)}
      />
    </Stack>
  );
}

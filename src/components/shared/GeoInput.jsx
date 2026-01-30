import { useState } from "react";
import PropTypes from "prop-types";

import { Button, Typography, Popover } from "@mui/material";
import PropertyAutocompleteDebounce from "./propertyAutocompleteDebounce.component";
import { addressValidationSchema } from "../../util/formValidation";
import { useFormik } from "formik";

GeoInput.propTypes = {
  id: PropTypes.string,
  icon: PropTypes.element,
  buttonLabel: PropTypes.string,
  placeholder: PropTypes.string,
  address: PropTypes.object,
  handleAddressChange: PropTypes.func,
  submitOnChange: PropTypes.bool,
  sx: PropTypes.object,
};

export default function GeoInput({
  id,
  buttonLabel = "Find My Rates",
  placeholder = "Your Address",
  address,
  handleAddressChange,
  submitOnChange = false,
  sx,
}) {
  const [tooltipAnchorEl, setTooltipAnchorEl] = useState(null);

  const handleTooltipClose = () => {
    setTooltipAnchorEl(null);
  };

  const tooltipOpen = Boolean(tooltipAnchorEl);
  const tooltipID = open ? "simple-popover" : undefined;

  const handleFormikChange = (values) => {
    if (submitOnChange) handleAddressChange(values);
  };

  const [addressAutocompleteOptions, setAddressAutocompleteOptions] = useState(
    address && address.site_formatted_address
      ? [
          {
            address: address.site_formatted_address,
            id: address.address_identifier,
            rank: 0,
          },
        ]
      : [],
  );

  const formik = useFormik({
    initialValues: address,
    validationSchema: addressValidationSchema,
    validate: (values) => {
      handleFormikChange(values);
    },
    onSubmit: () => {
      console.log("submit");
      // setAddress();
    },
  });

  const handleSubmit = (event) => {
    if (formik.values !== null) {
      handleAddressChange(formik.values);
    } else {
      setTooltipAnchorEl(event.currentTarget);
      setTimeout(() => {
        handleTooltipClose();
      }, 2000);
    }
  };

  return (
    <div id={id} className="input-group">
      <PropertyAutocompleteDebounce
        formik={formik}
        placeholder={placeholder}
        handleFormikChange={handleFormikChange}
        setSearchComplete={() => {}}
        setTariffType={() => {}}
        addressAutocompleteOptions={{
          addressAutocompleteOptions,
          setAddressAutocompleteOptions,
        }}
        sx={{
          width: 1,
          "& .MuiOutlinedInput-root": {
            py: 0,
            pl: 2,
            borderRadius: "9999px",
          },
          ...sx,
        }}
        button={
          submitOnChange ? null : (
            <Button
              variant="contained"
              color="secondary"
              sx={{
                margin: 0.5,
                mb: "0.4rem",
                px: 6,
                borderRadius: "9999px",
                border: 1,
                borderColor: "transparent",
                fontWeight: "bold",
                whiteSpace: "nowrap",
              }}
              onClick={handleSubmit}
              className="input-group-button"
            >
              {buttonLabel}
            </Button>
          )
        }
      />
      <Popover
        id={tooltipID}
        open={tooltipOpen}
        anchorEl={tooltipAnchorEl}
        onClose={handleTooltipClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{ mt: 1 }}
      >
        <Typography sx={{ p: 2 }}>
          Please search for an address first
        </Typography>
      </Popover>
    </div>
  );
}

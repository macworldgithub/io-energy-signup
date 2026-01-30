import { useState, useEffect, useCallback } from "react";
import { debounce, isEmpty } from "lodash";
import { TextField, Autocomplete, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TurbineLoader from "./TurbineLoader";

export default function PropertyAutocompleteDebounce(props) {
  const options = props.addressAutocompleteOptions.addressAutocompleteOptions;
  const setOptions =
    props.addressAutocompleteOptions.setAddressAutocompleteOptions;
  const [addressComponents, setAddressComponents] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(options[0] || null);
  const [loading, setLoading] = useState(false);

  const handlePredictiveAddressLookup = async (text) => {
    if (text === "" || text.length < 4) return;
    const query = encodeURIComponent(text);
    const url = `https://api.psma.com.au/v1/predictive/address?stateTerritory=SA&query=${query}`;
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "ca9GBqBUzvyOlni5l4lQWaeBNbAAND4A",
      },
    };
    try {
      const response = await fetch(url, options);
      setLoading(false);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetAddress = async (addressID) => {
    const url = `https://api.psma.com.au/v1/predictive/address/${addressID}`;
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "ca9GBqBUzvyOlni5l4lQWaeBNbAAND4A",
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setAddressComponents(data);
    } catch (error) {
      console.error(error);
    }
    props.setSearchComplete(true);
  };

  const getOptionsDelayed = useCallback(
    debounce((text, callback) => {
      setOptions([]);
      if (text === "") return;
      handlePredictiveAddressLookup(text).then(callback);
    }, 500),
    [],
  );

  useEffect(() => {
    getOptionsDelayed(inputValue, (filteredOptions) => {
      if (filteredOptions !== undefined) {
        setOptions(filteredOptions.suggest);
      }
    });
  }, [inputValue, getOptionsDelayed, setOptions]);

  useEffect(
    () => {
      if (!isEmpty(addressComponents)) {
        const addressProperties = addressComponents.address.properties;
        props.setTariffType("");
        const newAddressValues = {
          ...props.formik.values,
          address_identifier: addressProperties["address_identifier"] || "",
          site_suburb: addressProperties["locality_name"] || "",
          site_state: addressProperties["state_territory"] || "",
          site_post_code: addressProperties["postcode"] || "",
          site_street_no: addressProperties["street_number_1"] || "",
          site_street_no_suffix: "",
          site_street_name: addressProperties["street_name"] || "",
          site_street_suffix: addressProperties["street_suffix"] || "",
          site_street_type_code: addressProperties["street_type"] || "",
          site_unit_no: addressProperties["complex_unit_identifier"] || "",
          site_unit_type: addressProperties["complex_unit_type"] || "",
          site_floor_no: addressProperties["complex_level_number"] || "",
          site_floor_type: addressProperties["complex_level_type"] || "",
          site_lot_no: addressProperties["lot_identifier"] || "",
          site_formatted_address: addressProperties["formatted_address"] || "",
        };
        props.formik.setValues(newAddressValues);
        props.handleFormikChange(newAddressValues);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addressComponents],
  );

  return (
    <Autocomplete
      options={options}
      onInputChange={(e, val) => {
        if (options.find((item) => item.address === val)) return;
        setInputValue(val);
        setLoading(val.length > 4);
      }}
      value={selectedOption}
      filterOptions={(x) => x}
      onChange={(e, newValue) => {
        if (!newValue) return;
        handleGetAddress(newValue.id);
        setSelectedOption(newValue);
      }}
      getOptionLabel={(options) => {
        return options.address;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          placeholder={props.placeholder || "123 My Street, Adelaide SA 5000"}
          onChange={() => props.setSearchComplete(false)}
          error={
            props.formik.touched["site_post_code"] &&
            Boolean(props.formik.errors["site_post_code"])
          }
          helperText={
            props.formik.touched["site_post_code"] &&
            props.formik.errors["site_post_code"]
          }
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <InputAdornment position="start">
                  {loading ? (
                    <Box
                      sx={{ width: "30px", mb: -0.75, ml: -0.75 }}
                      className="fadein"
                    >
                      <TurbineLoader width="30px" />
                    </Box>
                  ) : (
                    <SearchIcon className="fadein" />
                  )}
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <>
                {props.button}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: 1,
            },
            "& > div.MuiAutocomplete-inputRoot[class*='MuiOutlinedInput-root']":
              {
                // default paddingRight was 39px since clear icon was positioned absolute
                pr: "2px!important",

                // Search icon
                "& button": {
                  order: 3, // order 3 means the search icon will appear after the clear icon which has an order of 2
                },

                // Clear icon
                "& > div.MuiAutocomplete-endAdornment": {
                  position: "relative", // default was absolute. we make it relative so that it is now within the flow of the other two elements
                  order: 2,
                },
              },
          }}
        ></TextField>
      )}
      sx={{ ...props.sx }}
    />
  );
}

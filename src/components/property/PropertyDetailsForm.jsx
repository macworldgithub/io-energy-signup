import PropTypes from "prop-types";
import {
    Stack,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { getPropertyTypes } from "../../util/plans"; // Assuming this exists or I'll fallback

export default function PropertyDetailsForm({ connection, handleChange }) {
    const { property_type, residents, solar, moveInFlag, moveInDate } = connection;

    const handleUpdate = (field, value) => {
        handleChange({ [field]: value });
    };

    return (
        <Stack spacing={1.5}>
            <Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Property details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Tell us a bit about your property so we can provide accurate estimates.
                </Typography>
            </Box>

            {/* Property Type */}
            <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.1, display: 'block' }}>
                    Property type
                </Typography>
                <FormControl fullWidth size="small">
                    <Select
                        value={property_type || ""}
                        displayEmpty
                        onChange={(e) => handleUpdate("property_type", e.target.value)}
                        renderValue={(selected) => {
                            if (!selected) {
                                return <Typography color="text.secondary">Select property type</Typography>;
                            }
                            return selected;
                        }}
                        sx={{
                            borderRadius: 2,
                            bgcolor: "#fff",
                        }}
                    >
                        <MenuItem value="House">House</MenuItem>
                        <MenuItem value="Unit">Unit</MenuItem>
                        <MenuItem value="Apartment">Apartment</MenuItem>
                        <MenuItem value="Townhouse">Townhouse</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Number of Residents */}
            <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.1, display: 'block' }}>
                    Number of residents
                </Typography>
                <FormControl fullWidth size="small">
                    <Select
                        value={residents || ""}
                        displayEmpty
                        onChange={(e) => handleUpdate("residents", e.target.value)}
                        renderValue={(selected) => {
                            if (!selected) {
                                return <Typography color="text.secondary">Select number of residents</Typography>;
                            }
                            return selected;
                        }}
                        sx={{
                            borderRadius: 2,
                            bgcolor: "#fff",
                        }}
                    >
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                        <MenuItem value="4">4</MenuItem>
                        <MenuItem value="5+">5+</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Checkboxes */}
            <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={solar || false}
                            onChange={(e) => handleUpdate("solar", e.target.checked)}
                            sx={{ color: "#bdc3c7", "&.Mui-checked": { color: "#ff2d55" } }}
                        />
                    }
                    label={<Typography variant="body2">I have solar panels installed</Typography>}
                    sx={{ color: "#333", my: -0.5 }}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={moveInFlag === true || moveInFlag === "true"}
                            onChange={(e) => handleUpdate("moveInFlag", e.target.checked)}
                            sx={{ color: "#bdc3c7", "&.Mui-checked": { color: "#ff2d55" } }}
                        />
                    }
                    label={<Typography variant="body2">I'm moving into a new property</Typography>}
                    sx={{ color: "#333", my: -0.5 }}
                />

                {/* Date Picker if moving in */}
                {(moveInFlag === true || moveInFlag === "true") && (
                    <Box sx={{ pl: 4, mt: 1 }}>
                        <DatePicker
                            disablePast
                            label="Expected move in date"
                            value={moveInDate}
                            onChange={(newValue) => handleUpdate("moveInDate", newValue)}
                            slotProps={{ textField: { variant: "outlined", fullWidth: true, size: "small" } }}
                            sx={{ bgcolor: "#fff", borderRadius: 2 }}
                        />
                    </Box>
                )}
            </Stack>
        </Stack>
    );
}

PropertyDetailsForm.propTypes = {
    connection: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
};

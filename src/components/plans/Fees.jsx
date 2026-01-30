import PropTypes from "prop-types";
import { Box, Stack, Grid, Typography } from "@mui/material";

Fees.propTypes = {
  plan: PropTypes.object,
};

export default function Fees({ plan }) {
  const fees = plan?.fees;

  const sortFn = (a, b) => {
    const nameA = a[1].label.toUpperCase();
    const nameB = b[1].label.toUpperCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  };

  return (
    <Box>
      {fees ? (
        <Stack spacing={1}>
          <Typography variant="h5">Fees and Charges</Typography>
          <Grid container>
            {Object.entries(fees)
              .sort(sortFn)
              .map(([key, fee]) => (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={8}
                    sx={{
                      mt: 2,
                      borderBottom: { sm: 1 },
                      borderColor: { sm: "subtle.main" },
                    }}
                    zeroMinWidth
                  >
                    <Typography key={key} noWrap sx={{ fontWeight: 500 }}>
                      {fee.label}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    sx={{
                      mt: { sm: 2 },
                      borderBottom: 1,
                      borderColor: "subtle.main",
                    }}
                    zeroMinWidth
                  >
                    <Typography
                      sx={{ ml: { sm: 2 }, mb: 1, textAlign: { sm: "right" } }}
                      noWrap
                      key={key}
                    >
                      {fee.value}
                    </Typography>
                  </Grid>
                </>
              ))}
          </Grid>
        </Stack>
      ) : (
        <Typography variant="subtitle2" sx={{ color: "error.main" }}>
          Error: Fees and charges not found
        </Typography>
      )}
    </Box>
  );
}

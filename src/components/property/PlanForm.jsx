import PropTypes from "prop-types";

import { Stack, Box, Typography } from "@mui/material";
import { RadioButtons } from "../shared/RadioButtons";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

import PlanPanel from "../plans/PlanPanel";
import { isMeterRequired } from "../../util/msatsPublic";

PlanForm.propTypes = {
  plan: PropTypes.object,
  eligiblePlans: PropTypes.array,
  msats: PropTypes.object,
  handlePlanChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default function PlanForm({
  plan,
  eligiblePlans,
  msats = null,
  handlePlanChange,
  disabled,
}) {
  if (eligiblePlans.length === 0) return null;

  const meterRequired = isMeterRequired(msats);

  return (
    <Stack spacing={3}>
      <Box sx={{ ml: { xs: 2, sm: 0 } }}>
        <RadioButtons
          list={eligiblePlans.map((p) => {
            return {
              value: p.price_plan_code,
              label: p.short_display_name,
              disabled: disabled,
            };
          })}
          value={plan ? plan.price_plan_code : null}
          handleChange={(value) =>
            handlePlanChange(
              eligiblePlans.find((p) => p.price_plan_code === value) || null,
            )
          }
        />
      </Box>
      {meterRequired && (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <InfoRoundedIcon color="secondary" sx={{ opacity: 0.8 }} />
          <Typography variant="body2">
            You require a new meter for this property connection. We will
            arrange for a new meter installation and charge $149 once installed.
          </Typography>
        </Stack>
      )}
      {meterRequired === null && (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <InfoRoundedIcon color="secondary" sx={{ opacity: 0.8 }} />
          <Typography variant="body2">
            If you require a new meter we will charge $149 once installed.
          </Typography>
        </Stack>
      )}
      {plan && (
        <Stack
          sx={{
            ml: { xs: 2, sm: 0 },
            mb: 2,
            px: 4,
            py: 4,
            bgcolor: "primary.main",
            borderRadius: "0.75rem",
            color: "white",
          }}
        >
          <PlanPanel plan={plan} summary={false} actionable={false} />
        </Stack>
      )}
    </Stack>
  );
}

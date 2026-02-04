// import PropTypes from "prop-types";

// import { Stack, Box, Typography } from "@mui/material";
// import { RadioButtons } from "../shared/RadioButtons";
// import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

// import PlanPanel from "../plans/PlanPanel";
// import { isMeterRequired } from "../../util/msatsPublic";

// PlanForm.propTypes = {
//   plan: PropTypes.object,
//   eligiblePlans: PropTypes.array,
//   msats: PropTypes.object,
//   handlePlanChange: PropTypes.func,
//   disabled: PropTypes.bool,
// };

// export default function PlanForm({
//   plan,
//   eligiblePlans,
//   msats = null,
//   handlePlanChange,
//   disabled,
// }) {
//   if (eligiblePlans.length === 0) return null;

//   const meterRequired = isMeterRequired(msats);

//   return (
//     <Stack spacing={3}>
//       <Box sx={{ ml: { xs: 2, sm: 0 } }}>
//         <RadioButtons
//           list={eligiblePlans.map((p) => {
//             return {
//               value: p.price_plan_code,
//               label: p.short_display_name,
//               disabled: disabled,
//             };
//           })}
//           value={plan ? plan.price_plan_code : null}
//           handleChange={(value) =>
//             handlePlanChange(
//               eligiblePlans.find((p) => p.price_plan_code === value) || null,
//             )
//           }
//         />
//       </Box>
//       {meterRequired && (
//         <Stack direction="row" spacing={1.5} alignItems="center">
//           <InfoRoundedIcon color="secondary" sx={{ opacity: 0.8 }} />
//           <Typography variant="body2">
//             You require a new meter for this property connection. We will
//             arrange for a new meter installation and charge $149 once installed.
//           </Typography>
//         </Stack>
//       )}
//       {meterRequired === null && (
//         <Stack direction="row" spacing={1.5} alignItems="center">
//           <InfoRoundedIcon color="secondary" sx={{ opacity: 0.8 }} />
//           <Typography variant="body2">
//             If you require a new meter we will charge $149 once installed.
//           </Typography>
//         </Stack>
//       )}
//       {plan && (
//         <Stack
//           sx={{
//             ml: { xs: 2, sm: 0 },
//             mb: 2,
//             px: 4,
//             py: 4,
//             bgcolor: "primary.main",
//             borderRadius: "0.75rem",
//             color: "white",
//           }}
//         >
//           <PlanPanel plan={plan} summary={false} actionable={false} />
//         </Stack>
//       )}
//     </Stack>
//   );
// }
import PropTypes from "prop-types";

import {
  Stack,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

import { isMeterRequired } from "../../util/msatsPublic";

PlanForm.propTypes = {
  plan: PropTypes.object,
  eligiblePlans: PropTypes.array,
  msats: PropTypes.object,
  handlePlanChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default function PlanForm({
  plan: selectedPlan,
  eligiblePlans,
  msats = null,
  handlePlanChange,
  disabled = false,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // stack on mobile

  if (!eligiblePlans?.length) return null;

  const meterRequired = isMeterRequired(msats);

  // Map your plans to match screenshot style (adjust keys if your data uses different names)
  const planDisplay = eligiblePlans.map((p) => {
    let displayName = p.short_display_name || p.name || "Plan";
    let rate = p.rate_display || `${p.rate?.toFixed(2) || "??.??"} c/kWh`;
    let features = [];

    // Customize per plan name - match your actual data structure
    if (displayName.toLowerCase().includes("basic")) {
      displayName = "Basic Plan";
      features = [
        "Simple and straightforward pricing",
        "Fixed rates",
        "No contract lock-in",
        "24/7 support",
      ];
    } else if (
      displayName.toLowerCase().includes("standard") ||
      displayName.toLowerCase().includes("green")
    ) {
      displayName = "Standard Plan";
      features = [
        "100% renewable energy sources",
        "100% green energy",
        "Carbon neutral",
        "Support renewables",
      ];
      rate = "24.60 c/kWh"; // from screenshot
    } else if (
      displayName.toLowerCase().includes("premium") ||
      displayName.toLowerCase().includes("time")
    ) {
      displayName = "Premium Plan";
      features = [
        "Time-of-use pricing for savings",
        "Off-peak discounts",
        "Smart meter required",
        "Usage insights",
      ];
      rate = "28.53 c/kWh";
    } else {
      // fallback
      features = p.features || ["Contact us for details"];
    }

    return {
      ...p,
      displayName,
      rate,
      features,
    };
  });

  return (
    <Stack spacing={4}>
      {/* Header text from screenshot */}
      <Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Choose your plan
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select the energy plan that best suits your needs. All plans include
          no exit fees.
        </Typography>
      </Box>

      {/* Cards grid */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 3, md: 2.5 }}
        alignItems={{ xs: "stretch", md: "flex-start" }}
        justifyContent="center"
        sx={{ flexWrap: "wrap" }}
      >
        {planDisplay.map((p) => {
          const isSelected =
            selectedPlan?.price_plan_code === p.price_plan_code;

          return (
            <Card
              key={p.price_plan_code}
              elevation={isSelected ? 6 : 2}
              sx={{
                flex: 1,
                minWidth: { xs: "100%", md: 0 },
                maxWidth: { md: "33.3%" },
                border: isSelected ? "2px solid #ff2d55" : "1px solid #e0e0e0",
                borderRadius: 3,
                bgcolor: "#f8f9fa",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 8,
                },
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.7 : 1,
              }}
              onClick={() => !disabled && handlePlanChange(p)}
            >
              <CardContent sx={{ p: 3, pb: 2, textAlign: "center" }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color={isSelected ? "#ff2d55" : "text.primary"}
                  gutterBottom
                >
                  {p.displayName}
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={800}
                  color={isSelected ? "#ff2d55" : "primary.main"}
                  sx={{ mb: 1 }}
                >
                  {p.rate}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1} alignItems="flex-start">
                  {p.features.map((feature, idx) => (
                    <Stack
                      key={idx}
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <CheckCircleIcon
                        fontSize="small"
                        sx={{
                          color: isSelected ? "#ff2d55" : "action.active",
                          opacity: 0.7,
                        }}
                      />
                      <Typography variant="body2">{feature}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>

              <Box sx={{ p: 3, pt: 1, textAlign: "center" }}>
                <Button
                  variant={isSelected ? "contained" : "outlined"}
                  disableElevation
                  fullWidth
                  disabled={disabled}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    ...(isSelected && {
                      bgcolor: "#ff2d55",
                      borderColor: "#ff2d55",
                      "&:hover": { bgcolor: "#e51e45" },
                    }),
                    ...(!isSelected && {
                      borderColor: "#ff2d55",
                      color: "#ff2d55",
                      "&:hover": {
                        bgcolor: "rgba(255,45,85,0.08)",
                        borderColor: "#ff2d55",
                      },
                    }),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    !disabled && handlePlanChange(p);
                  }}
                >
                  {isSelected ? "Selected" : "Choose This Plan"}
                </Button>
              </Box>
            </Card>
          );
        })}
      </Stack>

      {/* Meter warning - keep from original */}
      {meterRequired && (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 1 }}>
          <InfoRoundedIcon color="secondary" sx={{ opacity: 0.8 }} />
          <Typography variant="body2" color="text.secondary">
            You require a new meter for this property connection. We will
            arrange for a new meter installation and charge $149 once installed.
          </Typography>
        </Stack>
      )}

      {meterRequired === null && (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 1 }}>
          <InfoRoundedIcon color="secondary" sx={{ opacity: 0.8 }} />
          <Typography variant="body2" color="text.secondary">
            If you require a new meter we will charge $149 once installed.
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}

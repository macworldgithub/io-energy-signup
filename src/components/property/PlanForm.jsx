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
  if (!eligiblePlans?.length) return null;

  const meterRequired = isMeterRequired(msats);

  // Map your plans to match screenshot style
  const planDisplay = eligiblePlans.map((p) => {
    let displayName = p.short_display_name || p.name || "Plan";
    let rate = "20.54 c/kWh";
    let subTitle = "";
    let features = [];

    if (displayName.toLowerCase().includes("basic")) {
      displayName = "Basic Plan";
      subTitle = "Simple and straightforward pricing";
      rate = "20.54 c/kWh";
      features = ["Fixed Rates", "No contract lock-in", "24/7 support"];
    } else if (
      displayName.toLowerCase().includes("standard") ||
      displayName.toLowerCase().includes("green")
    ) {
      displayName = "Standard Plan";
      subTitle = "100% renewable energy sources";
      rate = "24.60 c/kWh";
      features = ["100% green energy", "Carbon neutral", "Support renewables"];
    } else if (
      displayName.toLowerCase().includes("premium") ||
      displayName.toLowerCase().includes("time")
    ) {
      displayName = "Premium Plan";
      subTitle = "Time-of-use pricing for savings";
      rate = "28.53 c/kWh";
      features = ["Off-peak discounts", "Smart meter required", "Usage insights"];
    } else {
      features = p.features || ["Contact us for details"];
    }

    return {
      ...p,
      displayName,
      subTitle,
      rate,
      features,
    };
  });

  return (
    <Stack spacing={4}>
      {/* Header section */}
      <Box>
        <Typography variant="h4" fontWeight={900} sx={{ color: "#111827", mb: 1.5, fontSize: { xs: "1.8rem", md: "2.2rem" } }}>
          Choose your plan
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, lineHeight: 1.5, opacity: 0.8 }}
        >
          Select the energy plan that best suits your needs. All plans include
          no exit fees.
        </Typography>
      </Box>

      {/* Cards grid */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems={{ xs: "stretch", md: "stretch" }}
        justifyContent="flex-start"
        sx={{ flexWrap: "nowrap", overflowX: "auto", pb: 2 }}
      >
        {planDisplay.map((p) => {
          const isSelected =
            selectedPlan?.price_plan_code === p.price_plan_code;

          return (
            <Card
              key={p.price_plan_code}
              elevation={isSelected ? 8 : 0}
              sx={{
                flex: "1 1 300px",
                minWidth: 280,
                borderRadius: 8,
                bgcolor: "#CFD1D6", // Accurate grey from screenshot
                transition: "all 0.3s ease",
                cursor: disabled ? "not-allowed" : "pointer",
                boxShadow: isSelected ? "0 20px 40px rgba(0,0,0,0.12)" : "none",
                transform: isSelected ? "translateY(-4px)" : "none",
                display: "flex",
                flexDirection: "column"
              }}
              onClick={() => !disabled && handlePlanChange(p)}
            >
              <CardContent sx={{ p: 4, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Chip
                  label={p.displayName}
                  sx={{
                    bgcolor: "#111827",
                    color: "#fff",
                    fontWeight: 700,
                    height: 32,
                    mb: 3,
                    alignSelf: "flex-start",
                    px: 1,
                    fontSize: "0.8rem",
                    textTransform: "capitalize"
                  }}
                />

                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{ color: "#111827", mb: 2, height: 48, lineHeight: 1.3, fontSize: "1.1rem" }}
                >
                  {p.subTitle}
                </Typography>

                <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ mb: 4 }}>
                  <Typography
                    variant="h2"
                    fontWeight={900}
                    sx={{ color: "#fff", letterSpacing: "-2px", fontSize: "3.5rem" }}
                  >
                    {p.rate.split(" ")[0]}
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#111827", fontWeight: 700, fontSize: "1.2rem" }}>
                    c/kWh
                  </Typography>
                </Stack>

                <Box sx={{ mb: 4 }}>
                  <Button
                    variant="contained"
                    disableElevation
                    fullWidth
                    disabled={disabled}
                    sx={{
                      borderRadius: 10,
                      bgcolor: isSelected ? "#ff2d55" : "#fff",
                      color: isSelected ? "#fff" : "#111827",
                      textTransform: "none",
                      fontWeight: 800,
                      py: 1.8,
                      fontSize: "1rem",
                      boxShadow: isSelected ? "0 10px 20px rgba(255, 45, 85, 0.3)" : "none",
                      "&:hover": { bgcolor: isSelected ? "#e02548" : "#f8f8f8" },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      !disabled && handlePlanChange(p);
                    }}
                  >
                    Choose This Plan
                  </Button>
                </Box>

                <Divider sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.3)" }} />

                <Stack spacing={2} sx={{ mt: "auto" }}>
                  {p.features.map((feature, idx) => (
                    <Stack
                      key={idx}
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >
                      <CheckCircleIcon
                        sx={{
                          color: "#fff",
                          fontSize: 24,
                        }}
                      />
                      <Typography variant="body2" fontWeight={600} sx={{ color: "#fff", fontSize: "0.95rem" }}>
                        {feature}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {/* Meter info footer */}
      {(meterRequired || meterRequired === null) && (
        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-start"
          sx={{
            p: 2,
            bgcolor: "rgba(0,0,0,0.03)",
            borderRadius: 4,
            border: "1px solid rgba(0,0,0,0.05)"
          }}
        >
          <InfoRoundedIcon color="secondary" sx={{ mt: 0.3, opacity: 0.8 }} />
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {meterRequired
              ? "You require a new meter for this property connection. We will arrange for a new meter installation and charge $149 once installed."
              : "If you require a new meter we will charge $149 once installed."}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}

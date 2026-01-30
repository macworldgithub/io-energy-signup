import { useState } from "react";
import PropTypes from "prop-types";
import {
  Stack,
  Box,
  Button,
  Typography,
  Link,
  List,
  ListItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import Modal from "../shared/Modal";
import Fees from "./Fees";

PlanPanel.propTypes = {
  plan: PropTypes.object,
  address: PropTypes.object,
  summary: PropTypes.bool,
  actionable: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default function PlanPanel({
  plan,
  address,
  summary = false,
  actionable = true,
  onSelect,
}) {
  const [otherFeesOpen, setOtherFeesOpen] = useState(false);
  const handleOtherFeesOpen = () => setOtherFeesOpen(true);
  const handleOtherFeesClose = () => setOtherFeesOpen(false);

  const separator = (
    <Box component="span" sx={{ mx: 1, color: "secondary.light" }}>
      &bull;
    </Box>
  );

  return (
    <Stack
      direction={{ xs: "column", lg: summary ? "column" : "row" }}
      alignItems="center"
      spacing={4}
    >
      <Stack
        sx={{
          display: { lg: summary ? "block" : "none" },
          textAlign: "center",
        }}
      >
        <Typography variant="h4">{plan.offering_name}</Typography>
        <Typography variant="h6">{plan.tagline}</Typography>
      </Stack>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "center", md: "flex-start" }}
        spacing={{ xs: 2, md: 8 }}
      >
        <Box
          component="img"
          src={plan.rate_card_link}
          sx={{
            pt: { xs: 0, md: 4, lg: summary ? 4 : 1 },
            width: { xs: "100%", md: "350px", lg: summary ? "350px" : "400px" },
          }}
        />

        <Stack spacing={{ xs: 2, lg: 4 }}>
          <Stack
            sx={{ display: { xs: "none", lg: summary ? "none" : "block" } }}
          >
            <Typography variant="h4">{plan.offering_name}</Typography>
            <Typography variant="h6">{plan.tagline}</Typography>
          </Stack>

          {!summary && (
            <List color="white">
              {plan.highlights.map((highlight, index) => (
                <ListItem key={index} alignItems="flex-start" disableGutters>
                  <ListItemIcon sx={{ position: "relative" }}>
                    <Stack
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        bgcolor: "tertiary.main",
                        borderRadius: "100%",
                        width: 24,
                        height: 24,
                        mt: -0.75,
                      }}
                    >
                      <CheckRoundedIcon color="inverse" fontSize="small" />
                    </Stack>
                  </ListItemIcon>
                  <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                    {highlight}
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}

          <Stack spacing={1} maxWidth="sm" divider={<Divider color="white" />}>
            {plan.dmo && (
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ fontSize: "0.9rem" }}>
                  Estimated annual cost for {plan.dmo.reference_usage} is{" "}
                  {plan.dmo.comparison_price} ({plan.dmo.comparison_percentage}{" "}
                  than reference price)
                </Typography>

                {plan.dmo.reference_usage_with_controlled_load &&
                  plan.dmo.reference_price_with_controlled_load &&
                  plan.dmo.comparison_percentage_with_controlled_load && (
                    <Typography variant="caption" sx={{ fontSize: "0.9rem" }}>
                      Estimated annual cost w/controlled load for{" "}
                      {plan.dmo.reference_usage_with_controlled_load} is{" "}
                      {plan.dmo.comparison_price_with_controlled_load} (
                      {plan.dmo.comparison_percentage_with_controlled_load} than
                      reference price)
                    </Typography>
                  )}
              </Stack>
            )}

            {plan.feed_in_tariff_details?.length > 0 && (
              <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                <Box component="span">
                  Feed-In Tariff&nbsp;&mdash;&nbsp;&nbsp;
                </Box>
                {plan.feed_in_tariff_details.map((details, index) => {
                  const value = parseFloat(details.rate);
                  const label = value < 0 ? "(Charge)" : "(Rebate)";
                  return (
                    <span key={index}>
                      {value}
                      {details.units} {details.times} <strong>{label}</strong>
                      {index < plan.feed_in_tariff_details.length - 1 &&
                        separator}
                    </span>
                  );
                })}
              </Typography>
            )}
            {/* {plan.demand_details && plan.demand_details.length > 0 && (
              <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                <Box component="span">Demand&nbsp;&mdash;&nbsp;&nbsp;</Box>
                {plan.demand_details.map((details, index) => (
                  <span key={index}>
                    {details.rate}
                    {details.units} {details.times}
                    {index < plan.feed_in_tariff_details.length - 1 &&
                      separator}
                  </span>
                ))}
              </Typography>
            )} */}

            {/* TODO supply charge and network tariff ??? */}
            <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
              {plan.fees?.supply_charge && (
                <span>
                  {plan.fees.supply_charge.label}:{" "}
                  {plan.fees.supply_charge.value}
                  {separator}
                </span>
              )}
              {plan.controlled_load_details && (
                <span>
                  Controlled load:{" "}
                  {plan.controlled_load_details.map((d) => d.rate).join("/")}
                  {plan.controlled_load_details[0].units}
                  {plan.controlled_load_details.length > 1 &&
                    " depending on time"}
                  {separator}
                </span>
              )}
              {plan.distributor && (
                <span>
                  Network: {plan.distributor}
                  {separator}
                </span>
              )}
              {plan.required_network_tariff_codes && (
                <span>
                  Network tariff
                  {plan.required_network_tariff_codes.length > 1
                    ? "s"
                    : null}: {plan.required_network_tariff_codes.join(", ")}
                  {separator}
                </span>
              )}
              {plan.baseload_average && (
                <span>
                  Baseload average: {plan.baseload_average}
                  {separator}
                </span>
              )}
              {/* {plan.other_details &&
                plan.other_details.map((details, index) => (
                  <span key={index}>
                    {details}
                    {index < plan.other_details.length - 1 && separator}
                  </span>
                ))} */}
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            justifyContent={summary ? "center" : "space-between"}
            flexWrap="wrap"
            sx={{ width: 1 }}
          >
            {actionable && onSelect && (
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  width: "fit-content",
                  mt: 2,
                  mr: { xs: 0, sm: 4 },
                  px: 2,
                  whiteSpace: "nowrap",
                }}
                onClick={() => onSelect(plan, address)}
              >
                Select this plan
              </Button>
            )}
            <Stack
              direction={{ xs: "column", sm: summary ? "column" : "row" }}
              spacing={{ xs: 1, sm: summary ? 1 : 4 }}
              alignItems={{ xs: "center", md: "center" }}
              maxWidth="sm"
              flexWrap="wrap"
              sx={{ mt: 2 }}
            >
              <Link
                href={plan.bpid_link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "white",
                  fontSize: "0.8rem",
                  fontWeight: "medium",
                  whiteSpace: "nowrap",
                }}
              >
                See this BPID
              </Link>
              <Button
                variant="text"
                sx={{
                  color: "white",
                  fontSize: "0.8rem",
                  fontWeight: "medium",
                  whiteSpace: "nowrap",
                  ml: summary ? { md: "0!important" } : null,
                  p: 0,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={handleOtherFeesOpen}
              >
                See other possible charges
              </Button>
              <Modal open={otherFeesOpen} handleClose={handleOtherFeesClose}>
                <Stack
                  spacing={3}
                  alignItems="flex-end"
                  sx={{
                    p: 3,
                    width: "max-content",
                    maxWidth: { xs: "90vw", sm: "32rem" },
                  }}
                >
                  <Fees plan={plan} />
                  <Button
                    variant="outlined"
                    sx={{ px: 4 }}
                    onClick={handleOtherFeesClose}
                  >
                    Close
                  </Button>
                </Stack>
              </Modal>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

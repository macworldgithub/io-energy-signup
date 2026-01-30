import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Stack, Box, Tab, Typography, LinearProgress } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import PlanPanel from "./PlanPanel";
import TurbineLoader from "../shared/TurbineLoader";

import { getPlans } from "../../util/plans.js";

Plans.propTypes = {
  address: PropTypes.object,
};

export default function Plans({ address }) {
  const [propertyType, setPropertyType] = useState("home");
  const [plans, setPlans] = useState({ RESIDENTIAL: [], BUSINESS: [] });
  const [loading, setLoading] = useState(true);

  const postcode = address?.site_post_code;

  useEffect(
    () => {
      getPlans({ postcode: address.site_post_code }).then((p) => {
        setPlans(
          p
            ? p.reduce(
                (acc, plan) => {
                  acc[plan.customer_type].push(plan);
                  return acc;
                },
                { RESIDENTIAL: [], BUSINESS: [] },
              )
            : [],
        );
        setLoading(false);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const planCount = plans.RESIDENTIAL.length + plans.BUSINESS.length;

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      sx={{
        width: 1,
        px: 2,
        backgroundColor: "primary.main",
      }}
    >
      {loading && (
        <Box className="fadein">
          <TurbineLoader
            text="Searching plans..."
            textColor="white"
            progressComponent={
              <LinearProgress color="secondary" sx={{ height: 3 }} />
            }
          />
        </Box>
      )}
      {!loading && planCount > 0 && (
        <Box sx={{ mt: "3.7rem" }} className="fadein">
          <TabContext value={propertyType}>
            <Box sx={{ color: "white" }}>
              <TabList
                onChange={(event, newValue) => setPropertyType(newValue)}
                aria-label="plans"
                textColor="inherit"
                indicatorColor="secondary"
              >
                <Tab
                  label={
                    <Typography
                      variant="button"
                      sx={{ fontSize: "1.1rem", px: 2 }}
                    >
                      Home
                    </Typography>
                  }
                  value="home"
                />
                <Tab
                  label={
                    <Typography
                      variant="button"
                      sx={{ fontSize: "1.1rem", px: 2 }}
                    >
                      Business
                    </Typography>
                  }
                  value="business"
                />
              </TabList>
            </Box>
            <Box sx={{ color: "white" }}>
              <TabPanel value="home" sx={{ px: 0 }}>
                <Stack
                  spacing={4}
                  justifyContent="space-around"
                  useFlexGap
                  sx={{ mt: 4 }}
                >
                  {plans.RESIDENTIAL.map((plan) => (
                    <PlanPanel
                      key={plan.offering_code}
                      plan={plan}
                      address={address}
                    />
                  ))}
                </Stack>
              </TabPanel>
              <TabPanel value="business" sx={{ px: 0, pb: 0 }}>
                <Stack
                  spacing={4}
                  justifyContent="space-around"
                  useFlexGap
                  sx={{ mt: 4 }}
                >
                  {plans.BUSINESS.map((plan) => (
                    <PlanPanel
                      key={plan.offering_code}
                      plan={plan}
                      address={address}
                    />
                  ))}
                </Stack>
              </TabPanel>
            </Box>
          </TabContext>
        </Box>
      )}
      {!loading && planCount === 0 && (
        <Stack sx={{ p: 6, bgcolor: "white", borderRadius: 3 }}>
          No plans found for {postcode}
        </Stack>
      )}
    </Stack>
  );
}

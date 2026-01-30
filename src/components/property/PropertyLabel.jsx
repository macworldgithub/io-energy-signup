import PropTypes from "prop-types";
import { Stack, Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import PersistenceStateEnum from "../../constants/persistenceStateEnum";

PropertyLabel.propTypes = {
  connection: PropTypes.object,
  showIndicator: PropTypes.bool,
};

export default function PropertyLabel({ connection, showIndicator = true }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {showIndicator && (
        <>
          {(connection.persistenceState === PersistenceStateEnum.UPDATING ||
            connection.persistenceState === PersistenceStateEnum.NEW) && (
            <Box
              sx={{ width: "24px", height: "24px" }}
              className="loader-ping"
            />
          )}
          {connection.persistenceState === PersistenceStateEnum.PERSISTED &&
            connection.plan === null && (
              <ErrorOutlineRoundedIcon color="warning" />
            )}
          {connection.persistenceState === PersistenceStateEnum.PERSISTED &&
            connection.plan !== null && <CheckCircleIcon color="success" />}
        </>
      )}

      <Stack alignItems="flex-start">
        <Typography
          variant="subtitle1"
          sx={{ fontSize: "1.15rem", fontWeight: "medium" }}
        >
          {connection.address.site_formatted_address}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontSize: "1.05rem" }}>
          {connection.plan?.offering_name}
        </Typography>
      </Stack>
    </Stack>
  );
}

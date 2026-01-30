import PropTypes from "prop-types";

import Modal from "../shared/Modal";
import { Stack, Typography, Button } from "@mui/material";

LifeSupportModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default function LifeSupportModal({ open, handleClose }) {
  return (
    <Modal open={open}>
      <Stack
        spacing={4}
        sx={{ p: 4, width: "100%", maxWidth: { xs: "90vw", sm: 600, md: 800 } }}
      >
        <Typography variant="h6">Life Support Disclaimer</Typography>
        <Stack alignItems="flex-start" spacing={2}>
          <Typography>
            Please note that your premises will only be temporarily flagged for
            life support at this stage.
          </Typography>
          <Typography>
            You will receive written correspondence along with a medical
            confirmation form over the next few days. Please ensure you send the
            completed medical confirmation form to iO Energy to ensure complete
            registration of your premises for life support.
          </Typography>
          <Typography>
            Please confirm you are aware of and understand this requirement. If
            your life support equipment is powered by both electricity and gas,
            please inform your gas retailer about the life support requirement
            at your premises, as iO Energy is only responsible for the supply of
            electricity to your property.
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="end">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleClose()}
          >
            I understand
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}

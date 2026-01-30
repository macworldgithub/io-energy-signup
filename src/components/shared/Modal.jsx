import PropTypes from "prop-types";
import { Modal, Box } from "@mui/material";

PropertyModal.propTypes = {
  children: PropTypes.node,
  framed: PropTypes.bool,
  sx: PropTypes.object,
};

export default function PropertyModal({
  children,
  framed = true,
  sx,
  ...props
}) {
  return (
    <Modal {...props}>
      <Box
        sx={[
          {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",

            // Force it always to stay within the viewport
            width: "100%",
            maxWidth: { xs: "90vw", sm: 600, md: 800 },
            boxSizing: "border-box",

            // No horizontal scroll ever
            overflowX: "hidden",
            overflowY: "auto",
            maxHeight: "90vh",

            // Responsive padding
            p: { xs: 2, sm: 4 },

            bgcolor: "background.paper",
            border: framed ? "2px solid #000" : null,
            borderRadius: framed ? 4 : null,
            boxShadow: framed ? 24 : null,
          },
          sx,
        ]}
      >
        {children}
      </Box>
    </Modal>
  );
}

import { useState } from "react";
import PropTypes from "prop-types";

import { Modal, Stack, Box, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

ImageModal.propTypes = {
  src: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  errorMsg: PropTypes.string,
};

export default function ImageModal({
  src,
  open = false,
  handleClose,
  errorMsg = "Image not found",
}) {
  const [isInError, setIsInError] = useState(false);

  const onClose = () => {
    handleClose();
    setIsInError(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          minWidth: "20rem",
          minHeight: "13rem",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
        }}
        onClick={onClose}
      >
        {!isInError && (
          <Box
            component="img"
            src={src}
            sx={{ maxWidth: "95vw" }}
            onError={(event) => setIsInError(true)}
          />
        )}
        {isInError && (
          <Typography variant="subtitle2" sx={{ color: "error.main" }}>
            {errorMsg}
          </Typography>
        )}
        <Stack
          sx={{
            position: "absolute",
            top: "-0.5rem",
            right: "-0.5rem",
            width: "2rem",
            height: "2rem",
            p: 2,
            bgcolor: "white",
            border: "2px solid #000",
            borderRadius: "9999px",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <CloseRoundedIcon color="subtle.dark" />
        </Stack>
      </Stack>
    </Modal>
  );
}

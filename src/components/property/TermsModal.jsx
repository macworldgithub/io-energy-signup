// src/components/TermsModal.jsx
import PropTypes from "prop-types";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo } from "react";

import {
  TERMS_CONSENT_DEF,
  renderBullets,
  buildPlainTextFromDef,
} from "../../constants/consentText";

export default function TermsModal({
  open,
  onClose,
  onAccept, // will receive {version_label, text, links}
  contractName = "electricity contract",
  retailerName = "iO Energy, a trading name of Radian Holdings Pty Ltd",
  abn = "ABN 94 633 200 656",
  // Keep only Privacy Policy by default; other doc URLs intentionally omitted for now
  privacyPolicyUrl = new URL(
    `/src/assets/files/io-energy-privacy-policy-20250930.pdf`,
    import.meta.url,
  ).href,
  contractUrl = new URL(
    `/src/assets/files/io-energy-market-retail-contract-20250929.pdf`,
    import.meta.url,
  ).href,
  versionLabel = TERMS_CONSENT_DEF.version_label,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const vars = useMemo(
    () => ({ contractName, retailerName, abn }),
    [contractName, retailerName, abn],
  );

  const urls = useMemo(
    () => ({ privacyPolicyUrl, contractUrl }),
    [privacyPolicyUrl, contractUrl],
  );
  const bulletsJSX = useMemo(
    () => renderBullets(TERMS_CONSENT_DEF, vars, urls),
    [vars, urls],
  );
  const plainText = useMemo(
    () => buildPlainTextFromDef(TERMS_CONSENT_DEF, vars, urls),
    [vars, urls],
  );

  return (
    <Dialog
      open={open}
      onClose={(e, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      scroll="paper"
      slotProps={{ backdrop: { sx: { zIndex: theme.zIndex.modal - 1999 } } }}
    >
      <DialogTitle>{TERMS_CONSENT_DEF.header}</DialogTitle>
      <DialogContent dividers>
        <Typography>
          You are entering into an <strong>{contractName}</strong> with{" "}
          <strong>{retailerName}</strong> ({abn}).
        </Typography>

        <Typography sx={{ mt: 2 }}>{TERMS_CONSENT_DEF.leadin}</Typography>

        <ul style={{ paddingInlineStart: "1.25rem", marginTop: 8 }}>
          {bulletsJSX}
        </ul>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onAccept({
              version_label: versionLabel,
              text: plainText,
              links: {
                privacy_url: privacyPolicyUrl,
                contract_url: contractUrl,
              },
            });
          }}
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}

TermsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired, // gets {version_label, text, links}
  contractName: PropTypes.string,
  retailerName: PropTypes.string,
  abn: PropTypes.string,
  privacyPolicyUrl: PropTypes.string,
  contractUrl: PropTypes.string,
  versionLabel: PropTypes.string,
};

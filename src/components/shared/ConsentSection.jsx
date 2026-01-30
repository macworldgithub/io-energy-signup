// ConsentSection.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
} from "@mui/material";

import TermsModal from "../property/TermsModal"; // adjust path as needed

ConsentSection.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default function ConsentSection({ onChange }) {
  const [tncModalOpen, setTncModalOpen] = useState(false);

  const [contractAccepted, setContractAccepted] = useState(false);
  const [contractError, setContractError] = useState("");

  // keep a single place that emits the current consent bundle
  const emitConsent = (next = {}) => {
    const payload = {
      contract_terms_accepted: next.contract_terms_accepted ?? contractAccepted,
      terms_consent_bundle:
        next.terms_consent_bundle ??
        (contractAccepted
          ? {
              // whatever your TermsModal returns; this matches your first app
              version_label: "current",
            }
          : null),
    };
    onChange(payload);
  };

  // expose validate so parent can call it via ref if you want
  // for now, parent will just re-check flags before submit

  return (
    <Box sx={{ mt: 4 }}>
      {/* Terms & Conditions */}
      <FormControl error={!!contractError} margin="dense">
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              id="contract_terms_accepted"
              checked={contractAccepted}
              onChange={(e) => {
                const checked = e.target.checked;
                setContractAccepted(checked);
                if (checked) {
                  setTncModalOpen(true);
                } else {
                  // unaccept
                  emitConsent({
                    contract_terms_accepted: false,
                    terms_consent_bundle: null,
                  });
                }
              }}
            />
          }
          label={
            <Typography variant="body2">
              I have read and agree to the Terms &amp; Conditions
            </Typography>
          }
        />
        <FormHelperText>{contractError}</FormHelperText>
      </FormControl>

      <TermsModal
        open={tncModalOpen}
        onClose={() => {
          setTncModalOpen(false);
          setContractAccepted(false);
          emitConsent({
            contract_terms_accepted: false,
            terms_consent_bundle: null,
          });
          setContractError("You must accept the Terms & Conditions.");
        }}
        onAccept={(consentBundle) => {
          setTncModalOpen(false);
          setContractAccepted(true);
          setContractError("");
          emitConsent({
            contract_terms_accepted: true,
            terms_consent_bundle: consentBundle,
          });
        }}
      />
    </Box>
  );
}

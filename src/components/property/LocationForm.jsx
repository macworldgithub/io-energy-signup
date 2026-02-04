import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Stack,
  TextField,
  Typography,
  Button,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Link,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import GeoInput from "../shared/GeoInput";

import NMIvalidation from "../../util/NMIvalidator";
import {
  fetchPublicNmiDetails,
  discoverPublicNmis,
} from "../../util/msatsPublic";

LocationForm.propTypes = {
  property: PropTypes.object,
  handleNmiPublicMatch: PropTypes.func.isRequired,
  handlePublicSelection: PropTypes.func.isRequired,
  handleAddressChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func, // <-- NEW
};

export default function LocationForm({
  property,
  handleNmiPublicMatch,
  handlePublicSelection,
  handleAddressChange,
  onCancel,
}) {
  const [nmiInput, setNmiInput] = useState(
    property?.maskedNmi ? "" : property?.nmi || "",
  );
  const [waitingNmi, setWaitingNmi] = useState(false);
  const [err, setErr] = useState(null);
  const [showAddress, setShowAddress] = useState(false);

  // Address search state
  const [candidates, setCandidates] = useState(null);
  const [selectedPublicId, setSelectedPublicId] = useState("");
  const [waitingAddr, setWaitingAddr] = useState(false);

  const debounceTimer = useRef(null);
  const inFlight = useRef(null); // AbortController

  const selectedCandidate = useMemo(() => {
    if (!candidates || !selectedPublicId) return null;
    return candidates.find((c) => c.publicId === selectedPublicId) || null;
  }, [candidates, selectedPublicId]);

  // --- NMI (typed) path
  const onFindByNmi = async () => {
    // MOCK FOR TESTING
    if (nmiInput === "1111111111") {
      setErr(null);
      handleNmiPublicMatch({
        nmi: "1111111111",
        maskedNmi: "1111111111",
        address: {
          site_address_line_1: "123 Test St",
          site_suburb: "ADELAIDE",
          site_state: "SA",
          site_post_code: "5000",
          site_street_name: "Test",
          site_street_type_code: "ST",
          site_street_no: "123"
        },
        tariffCode: "SR", // specific tariff to ensure plans load?
        network: "SAPN"
      });
      return;
    }

    if (!NMIvalidation(nmiInput)) {
      setErr("Invalid NMI. Please check and try again.");
      return;
    }
    setErr(null);
    setWaitingNmi(true);
    const res = await fetchPublicNmiDetails(nmiInput);
    setWaitingNmi(false);
    if (res && res.error) {
      setSignUpErrorOpen(true);
      setErr(res.error);
      return;
    }
    handleNmiPublicMatch(res);
  };

  // --- Address autocomplete path (AUTO triggers)
  const hasMinimumAddressFields = (a) => {
    // tune these to your backend filter requirements
    const state = a?.site_state?.trim();
    const post = (a?.site_post_code || "").toString().trim();
    const street = a?.site_street_name?.trim();
    const suburb = a?.site_suburb?.trim();
    // Require: state + postcode + (street name OR suburb)
    return !!(state && post && (street || suburb));
  };

  const triggerDiscovery = async (payload) => {
    if (inFlight.current) {
      inFlight.current.abort();
      inFlight.current = null;
    }
    const controller = new AbortController();
    inFlight.current = controller;

    setWaitingAddr(true);
    setErr(null);
    setCandidates(null);
    setSelectedPublicId("");

    try {
      const res = await discoverPublicNmis(payload);
      if (controller.signal.aborted) return; // ignore aborted
      setWaitingAddr(false);

      if (res && res.error) {
        setSignUpErrorOpen(true);
        // setErr(res.error);
        return;
      }

      if (res && res.exactMatch) {
        // Auto-select exact match
        handlePublicSelection(res.exactMatch);
        setCandidates(null);
        return;
      }

      if (res && res.matches) {
        setCandidates(res.matches);
        return;
      }

      // setErr("Unexpected response.");
      setSignUpErrorOpen(true);
    } catch (e) {
      if (controller.signal.aborted) return;
      setWaitingAddr(false);
      setSignUpErrorOpen(true);
      // setErr("Address lookup failed. Please try again.");
    } finally {
      inFlight.current = null;
    }
  };

  const onGeoInputChange = (addr) => {
    // Keep your local address visible
    handleAddressChange(addr);

    const payload = {
      post_code: addr?.site_post_code || "",
      state: addr?.site_state || "",
      suburb: addr?.site_suburb || "",
      street_name: addr?.site_street_name || "",
      street_no: addr?.site_street_no || "",
      street_suffix: addr?.site_street_suffix || "",
      street_type_code: addr?.site_street_type_code || "",
      unit_no: addr?.site_unit_no || "",
      floor_no: addr?.site_floor_no || "",
      lot_no: addr?.site_lot_no || "",
      gasa_id: addr?.address_identifier || "",
    };

    // Debounced auto-discovery
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (hasMinimumAddressFields(addr)) {
        triggerDiscovery(payload);
      }
    }, 600);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (inFlight.current) inFlight.current.abort();
    };
  }, []);

  const onPickCandidate = () => {
    if (!selectedCandidate) return;
    handlePublicSelection(selectedCandidate);
  };

  const [signUpErrorOpen, setSignUpErrorOpen] = useState(false);

  const handleSignUpErrorClose = () => {
    setSignUpErrorOpen(false);
    setShowAddress(false); // optional: hide the address section too

    onCancel();
  };

  const signUpErrorDialog = (
    <Dialog
      open={signUpErrorOpen}
      onClose={handleSignUpErrorClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Sign Up Error</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          There was an issue finding your supply address. Please contact us to
          complete your signup. Call{" "}
          <Link href="tel:1300313463" sx={{ my: 2 }}>
            1300 313 463
          </Link>{" "}
          or email{" "}
          <Link href="mailto:hello@ioenergy.com.au?subject=iO%20Energy%20customer%signup%20request">
            customer support
          </Link>
          .
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSignUpErrorClose} autoFocus>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Stack spacing={1} sx={{ mt: 1 }}>
      <Typography sx={{ mb: 1, fontSize: '0.9rem' }}>
        Start with your National Meter Identifier (NMI) — or just select your
        address below and we’ll look it up automatically.
      </Typography>

      {/* NMI entry path */}
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          id="nmi"
          name="nmi"
          label="NMI (Recommended)"
          type="text"
          autoComplete="off"
          value={nmiInput}
          onChange={(e) => {
            setNmiInput(e.target.value);
            setErr(null);
          }}
          onKeyDown={(evt) => evt.key === "," && evt.preventDefault()}
          sx={{ flex: 1 }}
          size="small"
        />
        <LoadingButton
          loading={waitingNmi}
          variant={showAddress ? "outlined" : "contained"}
          onClick={onFindByNmi}
        >
          Find
        </LoadingButton>
        {!showAddress && (
          <Button variant="text" onClick={() => setShowAddress(true)}>
            Search by address instead
          </Button>
        )}
      </Stack>

      {err && <Alert severity="error">{err}</Alert>}

      {/* Address autocomplete path */}
      {showAddress && (
        <Stack spacing={1} sx={{ mt: 1 }}>
          <Divider />
          <Typography variant="subtitle2">Search your address</Typography>
          <Grid container spacing={1} sx={{ my: 1 }}>
            <Grid item xs={12}>
              <GeoInput
                buttonLabel="Update"
                placeholder="Address"
                address={property.address}
                handleAddressChange={onGeoInputChange}
                submitOnChange={true} // <<— important: changes fire immediately
              />
            </Grid>
            <Grid item xs={12}>
              {waitingAddr && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={20} />
                  <Typography variant="body2">
                    Looking up connections…
                  </Typography>
                </Stack>
              )}
            </Grid>
          </Grid>

          {Array.isArray(candidates) && candidates.length > 0 && (
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                We found multiple active connections. Please select one:
              </Typography>
              <RadioGroup
                value={selectedPublicId}
                onChange={(e) => setSelectedPublicId(e.target.value)}
              >
                {candidates.map((c) => (
                  <FormControlLabel
                    key={c.publicId}
                    value={c.publicId}
                    control={<Radio />}
                    label={
                      <span>
                        {c.maskedNmi} —{" "}
                        {[c.address?.site_address_line_1]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    }
                  />
                ))}
              </RadioGroup>
              <Button
                variant="contained"
                disabled={!selectedPublicId}
                onClick={onPickCandidate}
              >
                Use this connection
              </Button>
            </Stack>
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="text" onClick={() => setSignUpErrorOpen(true)}>
              Can’t find your address?
            </Button>
          </Stack>
          {signUpErrorOpen && signUpErrorDialog}
        </Stack>
      )}
    </Stack>
  );
}

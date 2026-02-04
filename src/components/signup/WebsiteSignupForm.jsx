import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";

import FormHeader from "../shared/FormHeader";
import LocationForm from "../property/LocationForm";
import PlanForm from "../property/PlanForm";
import MoveInForm from "../property/MoveInForm";
import ConcessionCardForm from "../property/ConcessionCardForm";
import LifeSupportForm from "../property/LifeSupportForm";
import ContactDetailsForm from "../property/ContactDetailsForm";
import BusinessDetailsForm from "../property/BusinessDetailsForm";
import BillingForm from "../property/BillingForm";
import ConsentSection from "../shared/ConsentSection";
import BaseBg from "../../assets/logos/Base.png";
import { getSignupPlans } from "../../util/plans";
import { submitSignup } from "../../util/caf";
import {
  addressValidationSchema,
  businessDetailsValidationSchema,
  contactValidationSchema,
  contactValidationSchemaWithID,
  concessionValidationSchema,
  lifeSupportValidationSchema,
  moveInValidationSchema,
  paymentValidationSchema,
} from "../../util/formValidation";

const emptyAddress = {
  address_identifier: "",
  site_identifier: "",
  site_suburb: "",
  site_state: "",
  site_post_code: "",
  site_street_no: "",
  site_street_no_to: "",
  site_street_no_suffix: "",
  site_street_name: "",
  site_street_suffix: "",
  site_street_type_code: "",
  site_unit_no: "",
  site_unit_type: "",
  site_floor_no: "",
  site_floor_type: "",
  site_lot_no: "",
  site_formatted_address: "",
};

const emptyContact = {
  title: "",
  given_name: "",
  family_name: "",
  email: "",
  phone: "",
  dob: null,
  idType: "",
  idNumber: "",
  idExpiry: null,
};

export default function WebsiteSignupForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [connection, setConnection] = useState({
    msats: null,
    address: emptyAddress,
    plan: null,
    nmi: "",
    moveInFlag: "",
    moveInDate: null,
    concession: { flag: "" },
    lifeSupportFlag: "",
    lifeSupportMachineType: "",
    lifeSupportNotes: "",
    business_name: "",
    abn_number: "",
    contactDetails: { ...emptyContact },
    secondaryContactDetails: { ...emptyContact },
    payment: {
      method_type: "DIRECT",
      dd_bsb: "",
      dd_acc_no: "",
      dd_acc_name: "",
      direct_debit_terms_accepted: false,
      direct_debit_consent_bundle: null,
    },
  });

  const [eligiblePlans, setEligiblePlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [lookupFailed, setLookupFailed] = useState(false);
  const [consents, setConsents] = useState({
    contract_terms_accepted: false,
    terms_consent_bundle: null,
  });
  const [validationErrors, setValidationErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showSecondaryContact, setShowSecondaryContact] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const customerType = connection.plan?.customer_type || "";
  const requireIdForPrimary = customerType === "RESIDENTIAL";

  const stepLabels = [
    "Connection",
    "Plan",
    "Property details",
    "Contacts",
    "Payment & consent",
  ];

  const isConnectionComplete = () => !!connection.msats;
  const isPlanComplete = () => !!connection.plan;
  const isPropertyComplete = () =>
    moveInValidationSchema.isValidSync({
      flag: connection.moveInFlag,
      date: connection.moveInDate,
    }) &&
    concessionValidationSchema.isValidSync(
      connection.concession || { flag: "" },
    ) &&
    lifeSupportValidationSchema.isValidSync({
      flag: connection.lifeSupportFlag,
      machineType: connection.lifeSupportMachineType,
      notes: connection.lifeSupportNotes,
    });
  const isContactsComplete = (secondaryEmpty) => {
    const contactSchema = requireIdForPrimary
      ? contactValidationSchemaWithID
      : contactValidationSchema;
    const primaryOk = contactSchema.isValidSync(connection.contactDetails);
    const secondaryOk =
      showSecondaryContact && !secondaryEmpty
        ? contactValidationSchema.isValidSync(
            connection.secondaryContactDetails,
          )
        : true;
    const businessOk =
      customerType === "BUSINESS"
        ? businessDetailsValidationSchema.isValidSync({
            business_name: connection.business_name,
            abn_number: connection.abn_number,
          })
        : true;
    return primaryOk && secondaryOk && businessOk;
  };
  const isPaymentComplete = () =>
    paymentValidationSchema.isValidSync(connection.payment || {}) &&
    consents.contract_terms_accepted &&
    (connection.payment.method !== "DIRECT" ||
      connection.payment.direct_debit_terms_accepted);

  const stepComplete = (index, secondaryEmpty) => {
    switch (index) {
      case 0:
        return isConnectionComplete();
      case 1:
        return isPlanComplete();
      case 2:
        return isPropertyComplete();
      case 3:
        return isContactsComplete(secondaryEmpty);
      case 4:
        return isPaymentComplete();
      default:
        return false;
    }
  };

  // const handleNext = (secondaryEmpty) => {
  //   if (!stepComplete(activeStep, secondaryEmpty)) return;
  //   setActiveStep((prev) => Math.min(stepLabels.length - 1, prev + 1));
  // };

  const handleNext = (secondaryEmpty) => {
    setActiveStep(1);
  };

  const clearErrors = () => setValidationErrors([]);

  const handleNmiPublicMatch = (match) => {
    const addr = normaliseMsatsAddress(match?.address || {});
    clearErrors();
    setLookupFailed(false);
    setConnection((prev) => ({
      ...prev,
      msats: match,
      nmi: normaliseNmi(match?.nmi || match?.maskedNmi || prev.nmi),
      address: {
        ...prev.address,
        ...addr,
        site_identifier: match?.nmi || addr.site_identifier || "",
      },
      plan: null,
    }));
    setEligiblePlans([]);
  };

  const handlePublicSelection = (match) => {
    handleNmiPublicMatch(match);
  };

  const handleAddressChange = (address) => {
    clearErrors();
    setLookupFailed(false);
    setConnection((prev) => ({
      ...prev,
      address,
      msats: null,
      nmi: "",
      plan: null,
    }));
  };

  const handlePlanChange = (plan) => {
    clearErrors();
    setConnection((prev) => ({
      ...prev,
      plan,
    }));
  };

  const handleMoveInChange = (data) => {
    clearErrors();
    setConnection((prev) => ({
      ...prev,
      moveInFlag: data.flag,
      moveInDate: data.date,
    }));
  };

  const handleConcessionCardChange = (changes) => {
    clearErrors();
    setConnection((prev) => ({
      ...prev,
      concession: { ...prev.concession, ...changes },
    }));
  };

  const handleLifeSupportChange = (lifeSupport) => {
    clearErrors();
    setConnection((prev) => ({
      ...prev,
      lifeSupportFlag: lifeSupport.flag,
      lifeSupportMachineType: lifeSupport.machineType,
      lifeSupportNotes: lifeSupport.notes,
    }));
  };

  const handleContactDetailsChange = (changes) => {
    clearErrors();
    setConnection((prev) => ({
      ...prev,
      contactDetails: { ...prev.contactDetails, ...changes },
    }));
  };

  const handleSecondaryContactDetailsChange = (changes) => {
    clearErrors();
    setConnection((prev) => ({
      ...prev,
      secondaryContactDetails: { ...prev.secondaryContactDetails, ...changes },
    }));
  };

  const handleBusinessDetailsChange = (changes) => {
    clearErrors();
    setConnection((prev) => ({
      ...prev,
      ...changes,
    }));
  };

  const handleBillingChange = (changes) => {
    clearErrors();
    setConnection((prev) => ({
      ...prev,
      payment: { ...prev.payment, ...changes },
    }));
  };

  const resetSecondaryContact = () => {
    setConnection((prev) => ({
      ...prev,
      secondaryContactDetails: { ...emptyContact },
    }));
  };

  const handleConsentChange = (payload) => {
    setConsents(payload);
  };

  // Fetch plans when we have MSATS data (tariff + address)
  useEffect(() => {
    const fetchPlansForMsats = async () => {
      setPlansLoading(true);
      const tariffCode = connection.msats?.tariffCode || null;
      const postcode =
        connection.msats?.site_post_code ||
        connection.msats?.address?.site_post_code ||
        connection.address?.site_post_code ||
        null;

      if (!tariffCode && !postcode) {
        setEligiblePlans([]);
        setPlansLoading(false);
        return;
      }

      const plans =
        (await getSignupPlans({
          network_tariff_code: tariffCode,
          postcode,
        })) ?? [];

      setEligiblePlans(plans);
      setConnection((prev) => ({
        ...prev,
        plan: choosePlan(plans, prev.plan),
      }));
      setPlansLoading(false);
    };

    if (connection.msats) {
      fetchPlansForMsats();
    } else {
      setPlansLoading(false);
      setEligiblePlans([]);
    }
  }, [connection.msats]);

  // Clear business details when switching away from business plans
  useEffect(() => {
    if (
      customerType !== "BUSINESS" &&
      (connection.business_name || connection.abn_number)
    ) {
      setConnection((prev) => ({
        ...prev,
        business_name: "",
        abn_number: "",
      }));
    }
  }, [customerType]);

  const isSecondaryContactEmpty = useMemo(() => {
    const c = connection.secondaryContactDetails;
    return (
      !c.title &&
      !c.given_name &&
      !c.family_name &&
      !c.email &&
      !c.phone &&
      !c.dob
    );
  }, [connection.secondaryContactDetails]);

  const handleSubmit = async () => {
    const errors = validateBeforeSubmit({
      connection,
      consents,
      customerType,
      requireIdForPrimary,
      hasSecondaryContact: showSecondaryContact && !isSecondaryContactEmpty,
    });

    setValidationErrors(errors);
    if (errors.length > 0) {
      enqueueSnackbar("Please fix the highlighted issues before submitting.", {
        variant: "error",
      });
      return;
    }

    const payload = buildPayload({
      connection,
      consents,
      hasSecondaryContact: showSecondaryContact && !isSecondaryContactEmpty,
    });

    setSubmitting(true);
    const result = await submitSignup(payload);
    setSubmitting(false);

    if (result?.success) {
      navigate("/thank-you", {
        state: { email: connection.contactDetails.email || "" },
      });
    } else {
      const message =
        result?.error || "We could not complete your signup. Please try again.";
      setValidationErrors([message]);
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  // return (
  //   <Stack spacing={4}>
  //     <FormHeader
  //       heading="Connection details"
  //       subheading="Work through each step to complete your signup"
  //     />
  //     <Stepper activeStep={activeStep} alternativeLabel>
  //       {stepLabels.map((label, index) => (
  //         <Step
  //           key={label}
  //           completed={stepComplete(index, isSecondaryContactEmpty)}
  //         >
  //           <StepLabel>{label}</StepLabel>
  //         </Step>
  //       ))}
  //     </Stepper>

  //     {activeStep === 0 && (
  //       <Stack spacing={3} divider={<Divider />}>
  //         <Box>
  //           <Typography variant="h6" sx={{ mb: 1 }}>
  //             NMI lookup
  //           </Typography>
  //           <LocationForm
  //             property={connection}
  //             handleNmiPublicMatch={handleNmiPublicMatch}
  //             handlePublicSelection={handlePublicSelection}
  //             handleAddressChange={handleAddressChange}
  //             onCancel={() => setLookupFailed(true)}
  //           />
  //         </Box>
  //       </Stack>
  //     )}

  //     {activeStep === 1 && (
  //       <Stack spacing={3} divider={<Divider />}>
  //         <Box>
  //           <Typography variant="h6" sx={{ mb: 1 }}>
  //             Plan
  //           </Typography>
  //           {!connection.msats ? (
  //             <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
  //               {lookupFailed
  //                 ? "We could not confirm your NMI online. Please contact us on 1300 313 463 to complete your signup."
  //                 : "Enter your NMI to show available plans. If we can't match it, we'll ask you to contact us to finish the signup."}
  //             </Typography>
  //           ) : plansLoading ? (
  //             <Stack
  //               direction="row"
  //               spacing={1}
  //               alignItems="center"
  //               sx={{ py: 1 }}
  //             >
  //               <CircularProgress size={18} />
  //               <Typography variant="body2" color="text.secondary">
  //                 Loading plans...
  //               </Typography>
  //             </Stack>
  //           ) : eligiblePlans.length === 0 ? (
  //             <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
  //               We couldn't load plans for this NMI. Please contact us on 1300
  //               313 463.
  //             </Typography>
  //           ) : (
  //             <PlanForm
  //               plan={connection.plan}
  //               eligiblePlans={eligiblePlans}
  //               msats={connection.msats}
  //               handlePlanChange={handlePlanChange}
  //             />
  //           )}
  //         </Box>
  //       </Stack>
  //     )}

  //     {activeStep === 2 && (
  //       <Stack spacing={3} divider={<Divider />}>
  //         <FormHeader
  //           heading="Property details"
  //           subheading="Tell us when you are moving in and if any concessions or life support apply"
  //         />
  //         <MoveInForm
  //           moveIn={{
  //             flag: connection.moveInFlag,
  //             date: connection.moveInDate,
  //           }}
  //           handleMoveInChange={handleMoveInChange}
  //         />
  //         <ConcessionCardForm
  //           address={connection.address}
  //           concessionCard={connection.concession}
  //           handleConcessionCardChange={handleConcessionCardChange}
  //         />
  //         <LifeSupportForm
  //           lifeSupport={{
  //             flag: connection.lifeSupportFlag,
  //             machineType: connection.lifeSupportMachineType,
  //             notes: connection.lifeSupportNotes,
  //           }}
  //           handleLifeSupportChange={handleLifeSupportChange}
  //         />
  //       </Stack>
  //     )}

  //     {activeStep === 3 && (
  //       <Stack spacing={3} divider={<Divider />}>
  //         <FormHeader
  //           heading="Contact details"
  //           subheading="Who should we set up the account for?"
  //         />
  //         <ContactDetailsForm
  //           idRequired={requireIdForPrimary}
  //           details={connection.contactDetails}
  //           contacts={[]}
  //           excludeEmail={connection.secondaryContactDetails.email}
  //           handleDetailsChange={handleContactDetailsChange}
  //         />
  //         {customerType === "BUSINESS" && (
  //           <BusinessDetailsForm
  //             details={{
  //               business_name: connection.business_name,
  //               abn_number: connection.abn_number,
  //             }}
  //             handleBusinessDetailsChange={handleBusinessDetailsChange}
  //           />
  //         )}
  //       </Stack>
  //     )}

  //     {activeStep === 4 && (
  //       <Stack spacing={3} divider={<Divider />}>
  //         <FormHeader
  //           heading="Payment & consent"
  //           subheading="Choose how you pay and confirm the terms"
  //         />

  //         <Grid container spacing={2}>
  //           <Grid item xs={12}>
  //             <BillingForm
  //               payment={connection.payment}
  //               handleBillingChange={handleBillingChange}
  //             />
  //           </Grid>
  //           <Grid item xs={12}>
  //             <ConsentSection
  //               onChange={(payload) => {
  //                 handleConsentChange(payload);
  //                 clearErrors();
  //               }}
  //             />
  //           </Grid>
  //         </Grid>
  //       </Stack>
  //     )}

  //     {validationErrors.length > 0 && (
  //       <Alert severity="error">
  //         <Typography variant="subtitle2" sx={{ mb: 1 }}>
  //           Please address the following:
  //         </Typography>
  //         <ul style={{ margin: 0, paddingInlineStart: "1.25rem" }}>
  //           {validationErrors.map((msg, index) => (
  //             <li key={index}>{msg}</li>
  //           ))}
  //         </ul>
  //       </Alert>
  //     )}

  //     <Stack direction="row" justifyContent="space-between" spacing={2}>
  //       <Button variant="text" disabled={activeStep === 0} onClick={handleBack}>
  //         Back
  //       </Button>
  //       {activeStep < stepLabels.length - 1 ? (
  //         <Button
  //           variant="contained"
  //           onClick={() => handleNext(isSecondaryContactEmpty)}
  //           disabled={!stepComplete(activeStep, isSecondaryContactEmpty)}
  //         >
  //           Next
  //         </Button>
  //       ) : (
  //         <LoadingButton
  //           variant="contained"
  //           color="primary"
  //           loading={submitting}
  //           onClick={handleSubmit}
  //           disabled={!stepComplete(activeStep, isSecondaryContactEmpty)}
  //         >
  //           Submit signup
  //         </LoadingButton>
  //       )}
  //     </Stack>
  //   </Stack>
  // );
  return (
    <Grid
      container
      sx={{
        minHeight: { xs: "auto", md: "100vh", lg: "auto" },
      }}
    >
      {/* LEFT – Hero / Branding / Steps */}
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url(${BaseBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          p: { xs: 3, sm: 4, md: 5 },
          display: "flex",
          flexDirection: "column",
          justifyContent: { xs: "flex-start", md: "space-between" },
          minHeight: { xs: "45vh", sm: "50vh", md: "auto" }, // ← limits height on mobile
          gap: { xs: 3, md: 4 },
        }}
      >
        <Box>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: "#ff2d55",
              mb: 1,
            }}
          >
            ioenergy
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              lineHeight: 1.1,
              mb: 1.5,
              fontSize: { xs: "1.9rem", sm: "2.4rem", md: "2.8rem" },
            }}
          >
            Sign up with
            <br />
            io Energy.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              opacity: 0.9,
              maxWidth: { xs: "420px", md: 280 },
              fontSize: { xs: "1rem", md: "0.95rem" },
            }}
          >
            Start with your NMI or address and choose your plan. We’ll gather
            the details needed to create your account.
          </Typography>
        </Box>

        {/* STEP INDICATOR */}
        <Stack
          spacing={1.5}
          sx={{
            display: { xs: "none", sm: "flex" }, // hide below ~600px if too crowded
          }}
        >
          {stepLabels.map((label, index) => (
            <Stack
              key={label}
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor:
                    activeStep >= index ? "#ff2d55" : "rgba(255,255,255,0.35)",
                  border: activeStep === index ? "2px solid #ff2d55" : "none",
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: activeStep === index ? 600 : 400,
                  opacity: activeStep >= index ? 1 : 0.55,
                  fontSize: { sm: "0.9rem", md: "0.95rem" },
                }}
              >
                {label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Grid>

      {/* RIGHT FORM PANEL */}
      <Grid
        item
        xs={12}
        md={8}
        sx={{
          backgroundColor: "#ffffff",
          p: { xs: 2.5, sm: 4, md: 6, lg: 8 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Connection details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Work through each step to complete your signup
          </Typography>
        </Box>

        {/* STEP CONTENT */}
        <Box sx={{ flex: 1 }}>
          {activeStep === 0 && (
            <Stack spacing={3.5}>
              <Typography variant="h6" fontWeight={600}>
                NMI lookup
              </Typography>

              <LocationForm
                property={connection}
                handleNmiPublicMatch={handleNmiPublicMatch}
                handlePublicSelection={handlePublicSelection}
                handleAddressChange={handleAddressChange}
                onCancel={() => setLookupFailed(true)}
              />
            </Stack>
          )}

          {activeStep === 1 && (
            <Stack spacing={3}>
              <Typography variant="h6">Plan</Typography>
              {plansLoading ? (
                <CircularProgress size={24} />
              ) : (
                <PlanForm
                  plan={connection.plan}
                  eligiblePlans={eligiblePlans}
                  msats={connection.msats}
                  handlePlanChange={handlePlanChange}
                />
              )}
            </Stack>
          )}

          {activeStep === 2 && (
            <Stack spacing={3}>
              <MoveInForm
                moveIn={{
                  flag: connection.moveInFlag,
                  date: connection.moveInDate,
                }}
                handleMoveInChange={handleMoveInChange}
              />
              <ConcessionCardForm
                address={connection.address}
                concessionCard={connection.concession}
                handleConcessionCardChange={handleConcessionCardChange}
              />
              <LifeSupportForm
                lifeSupport={{
                  flag: connection.lifeSupportFlag,
                  machineType: connection.lifeSupportMachineType,
                  notes: connection.lifeSupportNotes,
                }}
                handleLifeSupportChange={handleLifeSupportChange}
              />
            </Stack>
          )}

          {activeStep === 3 && (
            <Stack spacing={3}>
              <ContactDetailsForm
                idRequired={requireIdForPrimary}
                details={connection.contactDetails}
                excludeEmail={connection.secondaryContactDetails.email}
                handleDetailsChange={handleContactDetailsChange}
              />

              {customerType === "BUSINESS" && (
                <BusinessDetailsForm
                  details={{
                    business_name: connection.business_name,
                    abn_number: connection.abn_number,
                  }}
                  handleBusinessDetailsChange={handleBusinessDetailsChange}
                />
              )}
            </Stack>
          )}

          {activeStep === 4 && (
            <Stack spacing={3}>
              <BillingForm
                payment={connection.payment}
                handleBillingChange={handleBillingChange}
              />
              <ConsentSection
                onChange={(payload) => {
                  handleConsentChange(payload);
                  clearErrors();
                }}
              />
            </Stack>
          )}
        </Box>

        {/* FOOTER BUTTONS */}
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{
            mt: "auto",
            pt: { xs: 3, md: 4 },
            pb: { xs: 2, md: 3 },
          }}
        >
          {activeStep < stepLabels.length - 1 ? (
            <Button
              variant="contained"
              disableElevation
              onClick={() => handleNext(isSecondaryContactEmpty)}
              disabled={!stepComplete(activeStep, isSecondaryContactEmpty)}
              sx={{
                minWidth: 110,
                bgcolor: "#ff2d55",
                "&:hover": { bgcolor: "#e02548" },
              }}
            >
              Next
            </Button>
          ) : (
            <LoadingButton
              variant="contained"
              loading={submitting}
              onClick={handleSubmit}
              sx={{
                minWidth: 140,
                bgcolor: "#ff2d55",
                "&:hover": { bgcolor: "#e02548" },
              }}
            >
              Submit signup
            </LoadingButton>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}

function normaliseNmi(nmi) {
  return (nmi || "").toString().replace(/\s/g, "");
}

function normaliseMsatsAddress(address) {
  return {
    site_identifier: address?.site_identifier || "",
    site_suburb: address?.site_suburb || "",
    site_state: address?.site_state || "",
    site_post_code: address?.site_post_code || "",
    site_street_no: address?.site_street_no || "",
    site_street_no_to: address?.site_street_no_to || "",
    site_street_no_suffix: address?.site_street_no_suffix || "",
    site_street_name: address?.site_street_name || "",
    site_street_suffix: address?.site_street_suffix || "",
    site_street_type_code: address?.site_street_type_code || "",
    site_unit_no: address?.site_unit_no || "",
    site_unit_type: address?.site_unit_type || "",
    site_floor_no: address?.site_floor_no || "",
    site_floor_type: address?.site_floor_type || "",
    site_lot_no: address?.site_lot_no || "",
    site_formatted_address: address?.site_formatted_address || "",
    address_identifier: address?.address_identifier || "",
  };
}

function choosePlan(plans, current) {
  if (!plans || plans.length === 0) return null;
  if (
    current &&
    plans.some((plan) => plan.price_plan_code === current.price_plan_code)
  ) {
    return current;
  }
  if (plans.length === 1) return plans[0];
  return null;
}

function toFeAddress(address) {
  return {
    post_code: address?.site_post_code || "",
    state: address?.site_state || "",
    street_name: address?.site_street_name || "",
    street_type_code: address?.site_street_type_code || "",
    street_suffix: address?.site_street_suffix || "",
    suburb: address?.site_suburb || "",
    unit_no: address?.site_unit_no || "",
    unit_type: address?.site_unit_type || "",
    street_no: address?.site_street_no || "",
    street_no_to: address?.site_street_no_to || "",
    street_no_suffix: address?.site_street_no_suffix || "",
    floor_no: address?.site_floor_no || "",
    floor_type: address?.site_floor_type || "",
    lot_no: address?.site_lot_no || "",
    gasa_id: address?.address_identifier || address?.gasa_id || "",
    building_name: address?.building_name || "",
    transaction_id: address?.transaction_id || "",
  };
}

function mapContact(details) {
  return {
    title: details?.title || "",
    first_name: details?.given_name || "",
    last_name: details?.family_name || "",
    email: details?.email || "",
    mobile_number: details?.phone || "",
    dob: details?.dob?.toISODate?.() || null,
  };
}

function mapIdDocument(details) {
  if (!details?.idType) return null;
  return {
    type: details.idType,
    number: details.idNumber || "",
    card_number: details.card_number || "",
    expiry: details.idExpiry?.toISODate?.() || null,
  };
}

function buildPayload({ connection, consents, hasSecondaryContact }) {
  const nmiValue = connection.msats?.nmi || connection.nmi || "";
  const publicId =
    connection.msats?.publicId ||
    connection.msats?.public_id ||
    connection.connectionId ||
    "";
  const moveInSelected = `${connection.moveInFlag}` === "true";
  const todayLocal = new Date();
  const todayString = todayLocal.toISOString().slice(0, 10);
  const primaryContact = mapContact(connection.contactDetails);
  const secondaryContact = hasSecondaryContact
    ? mapContact(connection.secondaryContactDetails)
    : null;
  const idDocument = mapIdDocument(connection.contactDetails);

  const lifeSupportDetails =
    `${connection.lifeSupportFlag}` === "true"
      ? {
          machine_type: connection.lifeSupportMachineType,
          machineType: connection.lifeSupportMachineType,
          notes: connection.lifeSupportNotes,
        }
      : null;

  const concessionDetails =
    `${connection.concession.flag}` === "true"
      ? { ...connection.concession }
      : null;

  const businessDetails =
    connection.plan?.customer_type === "BUSINESS"
      ? {
          business_name: connection.business_name || "",
          abn_number: connection.abn_number || "",
        }
      : null;

  return {
    signup: {
      primary_contact: primaryContact,
      secondary_contact: secondaryContact,
      business_details: businessDetails,
      address: toFeAddress(connection.address),
      nmi: "",
      nmi_checksum: "",
      public_nmi_id: publicId,
      class_code:
        connection.msats?.classCode ||
        connection.msats?.nmiClassificationCode ||
        connection.msats?.classificationCode ||
        "",
      meter_type_code: connection.msats?.meterTypeCode || "",
      selected_plan_id: connection.plan?.id || connection.plan?.plan_id || null,
      customer_type: connection.plan?.customer_type || "",
      has_concession: `${connection.concession.flag}` === "true",
      concession_details: concessionDetails,
      has_life_support: `${connection.lifeSupportFlag}` === "true",
      life_support_details: lifeSupportDetails,
      id_document: idDocument,
      payment_method_type: connection.payment?.method || "",
      dd_bsb: connection.payment?.dd_bsb || "",
      dd_acc_no: connection.payment?.dd_acc_no || "",
      dd_acc_name: connection.payment?.dd_acc_name || "",
      transfer_type: moveInSelected ? "MOVE_IN" : "TRANSFER",
      move_in_date: moveInSelected
        ? connection.moveInDate?.toISODate?.() || null
        : null,
      transfer_date: moveInSelected
        ? null
        : connection.moveInDate?.toISODate?.() || todayString,
      drivers_license_expiry:
        connection.contactDetails.idType === "Drivers Licence"
          ? connection.contactDetails.idExpiry?.toISODate?.() || null
          : null,
      passport_expiry:
        connection.contactDetails.idType === "Passport"
          ? connection.contactDetails.idExpiry?.toISODate?.() || null
          : null,
    },
    consents: {
      concession: concessionDetails,
      contract_terms_accepted: !!consents.contract_terms_accepted,
      direct_debit_terms_accepted:
        !!connection.payment.direct_debit_terms_accepted,
      direct_debit_consent_bundle:
        connection.payment.method === "DIRECT"
          ? connection.payment.direct_debit_consent_bundle
          : null,
      lifeSupport: lifeSupportDetails,
      payment:
        connection.payment.method === "DIRECT"
          ? {
              method_type: connection.payment.method_type,
              dd_bsb: connection.payment.dd_bsb,
              dd_acc_no: connection.payment.dd_acc_no,
              dd_acc_name: connection.payment.dd_acc_name,
            }
          : { method_type: connection.payment.method_type },
      terms_consent_bundle: consents.terms_consent_bundle,
      business: businessDetails,
    },
  };
}

function validateBeforeSubmit({
  connection,
  consents,
  customerType,
  requireIdForPrimary,
  hasSecondaryContact,
}) {
  const errors = [];

  const hasMsats = !!connection.msats;
  if (
    !hasMsats &&
    !addressValidationSchema.isValidSync(connection.address || {})
  ) {
    errors.push("Please confirm a valid supply address or NMI.");
  }

  if (!connection.plan) {
    errors.push("Please select a plan.");
  }

  const contactSchema = requireIdForPrimary
    ? contactValidationSchemaWithID
    : contactValidationSchema;
  if (!contactSchema.isValidSync(connection.contactDetails)) {
    errors.push("Primary contact details are incomplete.");
  }

  if (
    hasSecondaryContact &&
    !contactValidationSchema.isValidSync(connection.secondaryContactDetails)
  ) {
    errors.push("Secondary contact details are incomplete.");
  }

  if (customerType === "BUSINESS") {
    if (
      !businessDetailsValidationSchema.isValidSync({
        business_name: connection.business_name,
        abn_number: connection.abn_number,
      })
    ) {
      errors.push("Business name and ABN are required for business plans.");
    }
  }

  if (
    !moveInValidationSchema.isValidSync({
      flag: connection.moveInFlag,
      date: connection.moveInDate,
    })
  ) {
    errors.push("Please confirm your move-in or transfer date.");
  }

  if (
    !concessionValidationSchema.isValidSync(
      connection.concession || { flag: "" },
    )
  ) {
    errors.push("Please let us know if a concession applies.");
  }

  if (
    !lifeSupportValidationSchema.isValidSync({
      flag: connection.lifeSupportFlag,
      machineType: connection.lifeSupportMachineType,
      notes: connection.lifeSupportNotes,
    })
  ) {
    errors.push("Please confirm whether life support equipment is required.");
  }

  if (!paymentValidationSchema.isValidSync(connection.payment || {})) {
    errors.push("Payment details are incomplete.");
  }

  if (!consents.contract_terms_accepted) {
    errors.push("Terms & Conditions must be accepted.");
  }

  if (
    connection.payment.method === "DIRECT" &&
    !connection.payment.direct_debit_terms_accepted
  ) {
    errors.push("Please authorise the direct debit arrangement.");
  }

  return errors;
}

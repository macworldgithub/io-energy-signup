import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

import PageLayout from "../layouts/PageLayout";
import BrandDot from "../components/shared/BrandDot";

export default function ThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  return (
    <PageLayout>
      <Helmet>
        <title>Thank you | iO Energy</title>
      </Helmet>

      <Box
        sx={{
          width: 1,
          py: { xs: 4, sm: 6 },
          backgroundColor: "primary.main",
          color: "text.contrastText",
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={1}>
            <Typography variant="h3">
              Thanks for signing up
              <BrandDot />
            </Typography>
            <Typography variant="subtitle1" sx={{ maxWidth: 700 }}>
              We're processing your details now. We'll be in touch shortly with
              next steps.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6 } }}>
        <Stack spacing={2}>
          {email && (
            <Typography variant="body1">
              You will receive correspondence to your provided email address: <strong>{email}</strong>.
            </Typography>
          )}
          <Typography variant="body1">
            Need a hand? Call <strong>1300 313 463</strong> or email{" "}
            <strong>hello@ioenergy.com.au</strong>.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => navigate("/")}>
              Start another signup
            </Button>
            <Button variant="outlined" href="mailto:hello@ioenergy.com.au">
              Contact support
            </Button>
          </Stack>
        </Stack>
      </Container>
    </PageLayout>
  );
}

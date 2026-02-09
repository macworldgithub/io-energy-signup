import { Helmet } from "react-helmet-async";
import { Box, Container, Stack, Typography } from "@mui/material";

import PageLayout from "../layouts/PageLayout";
import WebsiteSignupForm from "../components/signup/WebsiteSignupForm";
import BrandDot from "../components/shared/BrandDot";

export default function SignupPage() {
  return (
    <PageLayout>
      <Helmet>
        <title>Sign up | iO Energy</title>
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
              Sign up with iO Energy
              <BrandDot />
            </Typography>
            <Typography variant="subtitle1" sx={{ maxWidth: 720 }}>
              Start with your NMI or address and choose your plan. We'll gather
              the details needed to create your account.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, sm: 6 } }}>
        <WebsiteSignupForm />
      </Container>
    </PageLayout>
  );
}

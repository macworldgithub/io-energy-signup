import * as React from "react";
import logo from "../../assets/logos/ioEnergyLogoLight.png";
import {
  AppBar,
  Toolbar,
  Stack,
  Box,
  Link,
  Button,
  IconButton,
  Menu,
  Container,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import SignupButton from "./SignupButton";

const pages = [
  { label: "Residential", href: "/residential", primary: true },
  { label: "Business", href: "/business", primary: true },
  // { label: "Calculators", href: "/" },
  { label: "Services", href: "/services", primary: true },
  { label: "Why Choose iO", href: "/customers" },
  // { label: "About Us", href: "/about" },
  // {
  //   label: "Help",
  //   href: "https://ioenergy.zendesk.com/hc/en-gb",
  //   newTab: true,
  // },
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" sx={{ py: 2, backgroundColor: "primary.main" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Link href="/">
            <Box
              component="img"
              sx={{ height: "3rem" }}
              alt="iO Energy"
              src={logo}
            />
          </Link>

          {/* Desktop menu */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ flexGrow: 1, width: 1, display: { xs: "none", sm: "flex" } }}
          >
            <Stack
              direction="row"
              sx={{
                gap: 2,
                ml: 4,
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page.label}
                  href={page.href}
                  target={page.newTab ? "_blank" : null}
                  rel={page.newTab ? "noopener noreferrer" : null}
                  sx={{
                    my: 2,
                    color: "text.contrastText",
                    fontWeight: 700,
                    display: {
                      xs: "none",
                      md: page.primary ? "block" : "none",
                      lg: "block",
                    },
                    whiteSpace: "nowrap",
                  }}
                >
                  {page.label}
                </Button>
              ))}
            </Stack>
            {/* <Stack direction="row" sx={{ mr: 2 }}>
              <Button
                variant="outlined"
                color="inverse"
                href="https://portal.energylocals.com.au/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ whiteSpace: "nowrap", mr: 2 }}
              >
                Customer Portal
              </Button>
              <SignupButton />
            </Stack> */}
          </Stack>

          {/* Mobile dropdown menu */}
          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "right",
              display: { xs: "flex", lg: "none" },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", lg: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  sx={{
                    display: {
                      xs: "block",
                      md: page.primary ? "none" : "block",
                      lg: "none",
                    },
                  }}
                  key={page.label}
                  onClick={handleCloseNavMenu}
                >
                  <Button
                    key={page.label}
                    href={page.href}
                    sx={{ display: "block" }}
                  >
                    {page.label}
                  </Button>
                </MenuItem>
              ))}
              {/* <Stack spacing={2} sx={{ my: 2, mx: 2, display: { sm: "none" } }}>
                <Button
                  variant="outlined"
                  href="https://portal.energylocals.com.au/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Customer Portal
                </Button>
                <SignupButton />
              </Stack> */}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;

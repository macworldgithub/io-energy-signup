import PropTypes from "prop-types";
import {
  Stack,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

EnergySystemPanel.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  attributes: PropTypes.array,
};

export default function EnergySystemPanel({
  title,
  subtitle,
  attributes = [],
}) {
  return (
    <Card
      sx={{
        bgcolor: "white",
        maxWidth: 420,
        px: { xs: 1, sm: 4, md: 1 },
      }}
    >
      <CardHeader title={title} subheader={subtitle} />
      <CardContent>
        <List>
          {attributes.map((attribute, index) => (
            <ListItem key={index} alignItems="flex-start" disableGutters>
              <ListItemIcon sx={{ position: "relative", minWidth: 36 }}>
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    width: 24,
                    height: 24,
                    mt: -1.25,
                  }}
                >
                  <CheckRoundedIcon color="secondary" fontSize="small" />
                </Stack>
              </ListItemIcon>
              <Typography variant="body2" sx={{ fontWeight: "normal" }}>
                {attribute}
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

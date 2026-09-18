import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { fontHeading, fontMono } from "../theme/tokens";

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
      }}
    >
      <Typography sx={{ fontFamily: fontMono, color: "text.secondary" }}>404</Typography>
      <Typography variant="h4" sx={{ fontFamily: fontHeading }}>
        Route not found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        This page doesn't exist — but you can define it as a mock one.
      </Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 1 }}>
        Back to dashboard
      </Button>
    </Box>
  );
}

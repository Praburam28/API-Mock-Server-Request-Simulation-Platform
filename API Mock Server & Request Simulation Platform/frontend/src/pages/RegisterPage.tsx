import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Divider, Link as MuiLink, TextField, Typography } from "@mui/material";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../api/client";
import { fontHeading, ink } from "../theme/tokens";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ first_name: firstName, last_name: lastName, email, password });
      navigate("/");
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(142,124,240,0.14), transparent 45%), radial-gradient(circle at 80% 80%, rgba(242,169,59,0.12), transparent 45%)",
      }}
    >
      <Card sx={{ width: 420, p: 1 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 3 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "9px",
                background: "linear-gradient(135deg, #F2A93B, #8E7CF0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BoltRoundedIcon sx={{ fontSize: 20, color: ink[950] }} />
            </Box>
            <Typography variant="h5" sx={{ fontFamily: fontHeading }}>
              MockForge
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create an account to start mocking APIs.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                fullWidth
              />
            </Box>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              helperText="At least 8 characters"
            />
            <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 1 }}>
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </Box>
          <Divider sx={{ my: 2.5 }} />
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Already have an account?{" "}
            <MuiLink component={Link} to="/login" color="primary.light">
              Sign in
            </MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

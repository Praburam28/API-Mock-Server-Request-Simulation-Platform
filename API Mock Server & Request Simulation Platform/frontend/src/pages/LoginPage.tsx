import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ApiRoundedIcon from "@mui/icons-material/ApiRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../api/client";

import {
  amber,
  violet,
  fontBody,
  fontHeading,
  fontMono,
  ink,
} from "../theme/tokens";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
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
        width: "100%",
        display: "flex",
        backgroundColor: "#F5F7FA",
        fontFamily: fontBody,
        overflow: "hidden",
      }}
    >
      {/* =====================================================
          LEFT BRANDING PANEL
          ===================================================== */}

      {!isMobile && (
        <Box
          sx={{
            width: "48%",
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: {
              md: 5,
              lg: 7,
            },
            background: `
              radial-gradient(
                circle at 75% 15%,
                rgba(124,58,237,0.24),
                transparent 35%
              ),
              radial-gradient(
                circle at 15% 85%,
                rgba(245,158,11,0.16),
                transparent 32%
              ),
              #0F131C
            `,
            color: "#FFFFFF",
          }}
        >
          {/* Decorative grid */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.055,
              backgroundImage: `
                linear-gradient(${ink[300]} 1px, transparent 1px),
                linear-gradient(90deg, ${ink[300]} 1px, transparent 1px)
              `,
              backgroundSize: "42px 42px",
              pointerEvents: "none",
            }}
          />

          {/* Decorative glow */}
          <Box
            sx={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: "50%",
              right: -180,
              top: -150,
              background:
                "radial-gradient(circle, rgba(124,58,237,0.20), transparent 70%)",
              filter: "blur(10px)",
              pointerEvents: "none",
            }}
          />

          {/* Brand */}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `linear-gradient(135deg, ${amber.main}, ${violet.main})`,
                  boxShadow: "0 10px 30px rgba(245,158,11,0.18)",
                }}
              >
                <BoltRoundedIcon
                  sx={{
                    fontSize: 25,
                    color: "#111827",
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: fontHeading,
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.1,
                  }}
                >
                  MockForge
                </Typography>

                <Typography
                  sx={{
                    mt: 0.35,
                    fontFamily: fontMono,
                    fontSize: "0.62rem",
                    color: ink[400],
                    letterSpacing: "0.09em",
                  }}
                >
                  API MOCK PLATFORM
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Main branding content */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              maxWidth: 590,
              my: "auto",
              py: 8,
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.8,
                px: 1.2,
                py: 0.65,
                mb: 2.5,
                borderRadius: "6px",
                backgroundColor: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.18)",
              }}
            >
              <ApiRoundedIcon
                sx={{
                  fontSize: 15,
                  color: amber.light,
                }}
              />

              <Typography
                sx={{
                  fontFamily: fontMono,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  color: amber.light,
                  letterSpacing: "0.06em",
                }}
              >
                BUILD • TEST • SIMULATE
              </Typography>
            </Box>

            <Typography
              sx={{
                fontFamily: fontHeading,
                fontSize: {
                  md: "2.6rem",
                  lg: "3.25rem",
                },
                lineHeight: 1.08,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                mb: 2.5,
              }}
            >
              Build APIs.
              <br />
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(90deg, #FBBF24 0%, #A78BFA 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Mock anything.
              </Box>
            </Typography>

            <Typography
              sx={{
                maxWidth: 510,
                color: ink[300],
                fontSize: "1rem",
                lineHeight: 1.7,
                mb: 4,
              }}
            >
              Create, configure and test realistic API endpoints without
              waiting for the real backend to be ready.
            </Typography>

            {/* Feature list */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.6,
              }}
            >
              {[
                {
                  icon: <SpeedRoundedIcon />,
                  title: "Instant API simulation",
                  text: "Test endpoints with configurable responses and delays.",
                },
                {
                  icon: <SecurityRoundedIcon />,
                  title: "Controlled environments",
                  text: "Configure authentication and API access rules.",
                },
                {
                  icon: <ApiRoundedIcon />,
                  title: "Developer focused",
                  text: "Schemas, scenarios, logs and API versions in one place.",
                },
              ].map((feature) => (
                <Box
                  key={feature.title}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: amber.light,
                    }}
                  >
                    {feature.icon}
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.84rem",
                        fontWeight: 600,
                        color: "#F8FAFC",
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.2,
                        fontSize: "0.73rem",
                        lineHeight: 1.5,
                        color: ink[400],
                      }}
                    >
                      {feature.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: fontMono,
                fontSize: "0.62rem",
                color: ink[500],
              }}
            >
              MOCKFORGE / API PLATFORM
            </Typography>

            <Typography
              sx={{
                fontSize: "0.65rem",
                color: ink[500],
              }}
            >
              Developer Workspace
            </Typography>
          </Box>
        </Box>
      )}

      {/* =====================================================
          RIGHT LOGIN PANEL
          ===================================================== */}

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          px: {
            xs: 2,
            sm: 4,
            md: 5,
          },
          py: {
            xs: 3,
            md: 5,
          },
          backgroundColor: "#F8FAFC",
        }}
      >
        {/* Mobile brand */}
        {isMobile && (
          <Box
            sx={{
              position: "absolute",
              top: 24,
              left: 24,
              display: "flex",
              alignItems: "center",
              gap: 1.2,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${amber.main}, ${violet.main})`,
              }}
            >
              <BoltRoundedIcon
                sx={{
                  fontSize: 21,
                  color: "#111827",
                }}
              />
            </Box>

            <Typography
              sx={{
                fontFamily: fontHeading,
                fontSize: "1.15rem",
                fontWeight: 700,
                color: ink[900],
              }}
            >
              MockForge
            </Typography>
          </Box>
        )}

        <Card
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 440,
            borderRadius: "18px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E4E7EC",
            boxShadow:
              "0 20px 50px rgba(16,24,40,0.08), 0 4px 12px rgba(16,24,40,0.04)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: 4,
              background: `linear-gradient(90deg, ${amber.main}, ${violet.main})`,
            }}
          />

          <Box
            sx={{
              p: {
                xs: 3,
                sm: 4,
              },
            }}
          >
            {/* Header */}
            <Box sx={{ mb: 3.5 }}>
              <Typography
                sx={{
                  fontFamily: fontHeading,
                  fontSize: "1.65rem",
                  lineHeight: 1.25,
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: ink[900],
                }}
              >
                Welcome back
              </Typography>

              <Typography
                sx={{
                  mt: 0.8,
                  fontSize: "0.86rem",
                  lineHeight: 1.6,
                  color: ink[500],
                }}
              >
                Sign in to continue to your MockForge workspace.
              </Typography>
            </Box>

            {/* Error */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2.5,
                  borderRadius: "9px",
                  fontSize: "0.8rem",
                  alignItems: "center",
                }}
              >
                {error}
              </Alert>
            )}

            {/* Login form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2.2,
              }}
            >
              {/* Email */}
              <Box>
                <Typography
                  component="label"
                  htmlFor="login-email"
                  sx={{
                    display: "block",
                    mb: 0.8,
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: ink[700],
                  }}
                >
                  Email address
                </Typography>

                <TextField
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  fullWidth
                  autoComplete="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon
                          sx={{
                            fontSize: 19,
                            color: ink[400],
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Password */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.8,
                  }}
                >
                  <Typography
                    component="label"
                    htmlFor="login-password"
                    sx={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: ink[700],
                    }}
                  >
                    Password
                  </Typography>
                </Box>

                <TextField
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  fullWidth
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon
                          sx={{
                            fontSize: 19,
                            color: ink[400],
                          }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          onClick={() =>
                            setShowPassword((value) => !value)
                          }
                          edge="end"
                          size="small"
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon fontSize="small" />
                          ) : (
                            <VisibilityOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Sign in */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                endIcon={
                  !loading ? (
                    <ArrowForwardRoundedIcon fontSize="small" />
                  ) : undefined
                }
                sx={{
                  mt: 0.5,
                  height: 46,
                  borderRadius: "9px",
                  fontSize: "0.86rem",
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                  color: "#111827",
                  boxShadow: "0 6px 16px rgba(245,158,11,0.18)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #FBBF24 0%, #D97706 100%)",
                    boxShadow: "0 8px 20px rgba(245,158,11,0.24)",
                  },

                  "&.Mui-disabled": {
                    backgroundColor: "#F2F4F7",
                    color: "#98A2B3",
                  },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={18}
                      sx={{
                        mr: 1,
                        color: "inherit",
                      }}
                    />
                    Signing in...
                  </>
                ) : (
                  "Sign in to MockForge"
                )}
              </Button>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography
                sx={{
                  px: 1,
                  fontSize: "0.68rem",
                  fontFamily: fontMono,
                  color: ink[400],
                }}
              >
                NEW TO MOCKFORGE?
              </Typography>
            </Divider>

            {/* Register */}
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              fullWidth
              sx={{
                height: 44,
                borderRadius: "9px",
                borderColor: "#D0D5DD",
                color: ink[700],
                fontSize: "0.82rem",
                fontWeight: 600,

                "&:hover": {
                  borderColor: violet.main,
                  backgroundColor: "rgba(124,58,237,0.04)",
                },
              }}
            >
              Create an account
            </Button>

            {/* Security indicator */}
            <Box
              sx={{
                mt: 3,
                pt: 2.5,
                borderTop: "1px solid #EAECF0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.8,
              }}
            >
              <CheckCircleRoundedIcon
                sx={{
                  fontSize: 15,
                  color: "#16A34A",
                }}
              />

              <Typography
                sx={{
                  fontSize: "0.68rem",
                  color: ink[400],
                }}
              >
                Secure developer workspace
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Bottom version */}
        <Typography
          sx={{
            position: "absolute",
            bottom: 18,
            fontFamily: fontMono,
            fontSize: "0.6rem",
            color: ink[300],
          }}
        >
          MOCKFORGE • API MANAGEMENT
        </Typography>
      </Box>
    </Box>
  );
}
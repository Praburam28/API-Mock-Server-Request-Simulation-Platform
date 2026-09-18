import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";

import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ink,
  amber,
  violet,
  fontHeading,
  fontMono,
  sidebar,
  workspace,
} from "../theme/tokens";

const DRAWER_WIDTH = 250;

const navItems = [
  {
    label: "Dashboard",
    to: "/",
    icon: <SpaceDashboardRoundedIcon fontSize="small" />,
  },
  {
    label: "Mock APIs",
    to: "/mock-apis",
    icon: <RouteRoundedIcon fontSize="small" />,
  },
  {
    label: "Request Logs",
    to: "/request-logs",
    icon: <HistoryRoundedIcon fontSize="small" />,
  },
];

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = isAdmin
    ? [
        ...navItems,
        {
          label: "Users",
          to: "/users",
          icon: <GroupRoundedIcon fontSize="small" />,
        },
      ]
    : navItems;

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "?";

  const currentPage =
    items.find((item) =>
      item.to === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(item.to)
    )?.label ?? "MockForge";

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/login");
  };

  const handleNavigation = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: sidebar.background,
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          height: 72,
          px: 2.25,
          display: "flex",
          alignItems: "center",
          gap: 1.4,
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            flexShrink: 0,
            borderRadius: "11px",
            background: `linear-gradient(135deg, ${amber.main}, ${violet.main})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 18px rgba(245,158,11,0.18)",
          }}
        >
          <BoltRoundedIcon
            sx={{
              fontSize: 21,
              color: "#111827",
            }}
          />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              color: "#FFFFFF",
              fontFamily: fontHeading,
              fontWeight: 700,
              fontSize: "1.12rem",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            MockForge
          </Typography>

          <Typography
            sx={{
              color: sidebar.textMuted,
              fontFamily: fontMono,
              fontSize: "0.61rem",
              letterSpacing: "0.04em",
              mt: 0.35,
            }}
          >
            API MOCK PLATFORM
          </Typography>
        </Box>

        {isMobile && (
          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{
              ml: "auto",
              color: sidebar.textSecondary,
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        )}
      </Box>

      <Divider
        sx={{
          borderColor: sidebar.border,
        }}
      />

      {/* Navigation */}
      <Box sx={{ px: 1.25, pt: 2 }}>
        <Typography
          sx={{
            px: 1.25,
            mb: 1,
            color: sidebar.textMuted,
            fontFamily: fontMono,
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Workspace
        </Typography>

        <List
          disablePadding
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          {items.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.to === "/"}
              onClick={handleNavigation}
              sx={{
                minHeight: 44,
                px: 1.25,
                borderRadius: "9px",
                color: sidebar.textSecondary,
                position: "relative",
                transition:
                  "background-color 150ms ease, color 150ms ease",

                "&:hover": {
                  backgroundColor: sidebar.hover,
                  color: sidebar.text,
                },

                "&.active": {
                  backgroundColor: "rgba(245,158,11,0.11)",
                  color: amber.light,

                  "& .MuiListItemIcon-root": {
                    color: amber.main,
                  },

                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 9,
                    bottom: 9,
                    width: 3,
                    borderRadius: "0 4px 4px 0",
                    backgroundColor: amber.main,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 38,
                  color: sidebar.textMuted,
                  transition: "color 150ms ease",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.86rem",
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Developer section */}
      <Box sx={{ px: 1.25, pt: 3 }}>
        <Typography
          sx={{
            px: 1.25,
            mb: 1,
            color: sidebar.textMuted,
            fontFamily: fontMono,
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Developer
        </Typography>

        <List disablePadding>
          <ListItemButton
            sx={{
              minHeight: 44,
              px: 1.25,
              borderRadius: "9px",
              color: sidebar.textSecondary,

              "&:hover": {
                backgroundColor: sidebar.hover,
                color: sidebar.text,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 38,
                color: sidebar.textMuted,
              }}
            >
              <CodeRoundedIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText
              primary="API Playground"
              primaryTypographyProps={{
                fontSize: "0.86rem",
                fontWeight: 600,
              }}
            />
          </ListItemButton>

          <ListItemButton
            sx={{
              minHeight: 44,
              px: 1.25,
              borderRadius: "9px",
              color: sidebar.textSecondary,

              "&:hover": {
                backgroundColor: sidebar.hover,
                color: sidebar.text,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 38,
                color: sidebar.textMuted,
              }}
            >
              <SettingsRoundedIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText
              primary="Settings"
              primaryTypographyProps={{
                fontSize: "0.86rem",
                fontWeight: 600,
              }}
            />
          </ListItemButton>
        </List>
      </Box>

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      {/* System status */}
      <Box
        sx={{
          mx: 1.5,
          mb: 1.5,
          px: 1.5,
          py: 1.35,
          borderRadius: "10px",
          backgroundColor: "rgba(255,255,255,0.035)",
          border: `1px solid ${sidebar.border}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CircleRoundedIcon
            sx={{
              fontSize: 8,
              color: "#4ADE80",
            }}
          />

          <Typography
            sx={{
              color: sidebar.textSecondary,
              fontSize: "0.74rem",
              fontWeight: 500,
            }}
          >
            API services operational
          </Typography>
        </Box>
      </Box>

      {/* User section */}
      <Box
        sx={{
          px: 1.5,
          py: 1.5,
          borderTop: `1px solid ${sidebar.border}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            minWidth: 0,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontSize: "0.76rem",
              fontWeight: 700,
              background:
                "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
              color: "#FFFFFF",
            }}
          >
            {initials}
          </Avatar>

          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography
              noWrap
              sx={{
                color: "#FFFFFF",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {user?.first_name} {user?.last_name}
            </Typography>

            <Typography
              noWrap
              sx={{
                color: sidebar.textMuted,
                fontSize: "0.68rem",
                mt: 0.15,
              }}
            >
              {isAdmin ? "Administrator" : "Developer"}
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              color: sidebar.textMuted,

              "&:hover": {
                color: "#FFFFFF",
                backgroundColor: sidebar.hover,
              },
            }}
          >
            <LogoutRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: workspace.background,
      }}
    >
      {/* Desktop sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,

            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main application */}
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top header */}
        <AppBar
          position="sticky"
          elevation={0}
          color="transparent"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer - 1,
          }}
        >
          <Toolbar
            sx={{
              minHeight: "64px !important",
              px: {
                xs: 1.5,
                sm: 2.5,
                md: 3,
              },
              gap: 2,
            }}
          >
            {isMobile && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{
                  mr: 0.5,
                }}
              >
                <MenuRoundedIcon />
              </IconButton>
            )}

            {/* Page title */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                sx={{
                  fontFamily: fontHeading,
                  fontWeight: 700,
                  fontSize: "0.98rem",
                  color: workspace.text,
                }}
              >
                {currentPage}
              </Typography>

              <Typography
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                  },
                  fontSize: "0.68rem",
                  color: workspace.textMuted,
                  mt: 0.15,
                }}
              >
                MockForge API Management
              </Typography>
            </Box>

            {/* Environment */}
            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "flex",
                },
                alignItems: "center",
                gap: 0.75,
                px: 1.2,
                py: 0.65,
                borderRadius: "7px",
                backgroundColor: "#ECFDF3",
                border: "1px solid #A7F3D0",
              }}
            >
              <CircleRoundedIcon
                sx={{
                  fontSize: 7,
                  color: "#16A34A",
                }}
              />

              <Typography
                sx={{
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  color: "#166534",
                }}
              >
                Online
              </Typography>
            </Box>

            {/* User avatar */}
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              size="small"
              sx={{
                p: 0.25,
              }}
            >
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
                  color: "#FFFFFF",
                }}
              >
                {initials}
              </Avatar>
            </IconButton>

            {/* User menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
                    minWidth: 230,
                    borderRadius: "10px",
                    border: `1px solid ${workspace.border}`,
                    boxShadow:
                      "0 12px 30px rgba(16,24,40,0.12)",
                  },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: workspace.text,
                  }}
                >
                  {user?.first_name} {user?.last_name}
                </Typography>

                <Typography
                  noWrap
                  sx={{
                    fontSize: "0.72rem",
                    color: workspace.textMuted,
                    mt: 0.3,
                  }}
                >
                  {user?.email}
                </Typography>
              </Box>

              <Divider />

              <MenuItem
                onClick={handleLogout}
                sx={{
                  gap: 1,
                  mx: 0.5,
                  my: 0.5,
                  borderRadius: "7px",
                  fontSize: "0.82rem",
                  color: "#B91C1C",

                  "&:hover": {
                    backgroundColor: "#FEF2F2",
                  },
                }}
              >
                <LogoutRoundedIcon fontSize="small" />
                Sign out
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
            maxWidth: "1600px",
            mx: "auto",
            p: {
              xs: 1.5,
              sm: 2.5,
              md: 3,
              lg: 4,
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
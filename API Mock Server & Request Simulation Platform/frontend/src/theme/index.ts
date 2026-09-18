import { createTheme } from "@mui/material/styles";

import {
  amber,
  violet,
  blue,
  green,
  red,
  ink,
  fontBody,
  fontHeading,
  fontMono,
  workspace,
  sidebar,
  shadows,
  radius,
} from "./tokens";

declare module "@mui/material/styles" {
  interface Palette {
    surfaceAlt: string;
  }

  interface PaletteOptions {
    surfaceAlt?: string;
  }
}

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: amber.main,
      light: amber.light,
      dark: amber.dark,
      contrastText: amber.contrast,
    },

    secondary: {
      main: violet.main,
      light: violet.light,
      dark: violet.dark,
      contrastText: violet.contrast,
    },

    background: {
      default: workspace.background,
      paper: workspace.surface,
    },

    surfaceAlt: workspace.surfaceMuted,

    divider: workspace.border,

    text: {
      primary: workspace.text,
      secondary: workspace.textSecondary,
    },

    success: {
      main: green.main,
      light: green.light,
      dark: green.dark,
      contrastText: green.contrast,
    },

    warning: {
      main: amber.main,
      light: amber.light,
      dark: amber.dark,
      contrastText: amber.contrast,
    },

    error: {
      main: red.main,
      light: red.light,
      dark: red.dark,
      contrastText: red.contrast,
    },

    info: {
      main: blue.main,
      light: blue.light,
      dark: blue.dark,
      contrastText: blue.contrast,
    },
  },

  shape: {
    borderRadius: radius.md,
  },

  typography: {
    fontFamily: fontBody,

    h1: {
      fontFamily: fontHeading,
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.2,
      letterSpacing: "-0.025em",
      color: workspace.text,
    },

    h2: {
      fontFamily: fontHeading,
      fontWeight: 700,
      fontSize: "1.75rem",
      lineHeight: 1.25,
      letterSpacing: "-0.02em",
      color: workspace.text,
    },

    h3: {
      fontFamily: fontHeading,
      fontWeight: 700,
      fontSize: "1.5rem",
      lineHeight: 1.3,
      letterSpacing: "-0.015em",
      color: workspace.text,
    },

    h4: {
      fontFamily: fontHeading,
      fontWeight: 600,
      fontSize: "1.25rem",
      color: workspace.text,
    },

    h5: {
      fontFamily: fontHeading,
      fontWeight: 600,
      fontSize: "1.125rem",
      color: workspace.text,
    },

    h6: {
      fontFamily: fontHeading,
      fontWeight: 600,
      fontSize: "1rem",
      color: workspace.text,
    },

    subtitle1: {
      fontFamily: fontBody,
      fontWeight: 500,
      color: workspace.textSecondary,
    },

    subtitle2: {
      fontFamily: fontBody,
      fontWeight: 600,
      color: workspace.textSecondary,
    },

    body1: {
      fontFamily: fontBody,
      fontSize: "0.95rem",
      lineHeight: 1.6,
    },

    body2: {
      fontFamily: fontBody,
      fontSize: "0.875rem",
      lineHeight: 1.55,
      color: workspace.textSecondary,
    },

    button: {
      fontFamily: fontBody,
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0",
    },

    overline: {
      fontFamily: fontMono,
      fontWeight: 600,
      fontSize: "0.68rem",
      letterSpacing: "0.08em",
    },

    caption: {
      fontFamily: fontBody,
      color: workspace.textMuted,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: "smooth",
        },

        body: {
          margin: 0,
          backgroundColor: workspace.background,
          color: workspace.text,
          backgroundImage:
            "radial-gradient(circle at 85% 0%, rgba(124,58,237,0.035), transparent 30%), radial-gradient(circle at 15% 0%, rgba(245,158,11,0.035), transparent 30%)",
          backgroundAttachment: "fixed",
        },

        "*": {
          boxSizing: "border-box",
        },

        "::selection": {
          backgroundColor: "rgba(245,158,11,0.22)",
        },

        "::-webkit-scrollbar": {
          width: 8,
          height: 8,
        },

        "::-webkit-scrollbar-thumb": {
          backgroundColor: ink[300],
          borderRadius: 8,
        },

        "::-webkit-scrollbar-thumb:hover": {
          backgroundColor: ink[400],
        },

        "::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
      },
    },

    // ---------------------------------------------------------
    // Paper
    // ---------------------------------------------------------

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${workspace.border}`,
          boxShadow: "none",
        },

        elevation1: {
          boxShadow: shadows.card,
        },

        elevation2: {
          boxShadow: shadows.cardHover,
        },
      },
    },

    // ---------------------------------------------------------
    // Cards
    // ---------------------------------------------------------

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: workspace.surface,
          border: `1px solid ${workspace.border}`,
          borderRadius: radius.lg,
          boxShadow: shadows.card,
          transition:
            "box-shadow 180ms ease, border-color 180ms ease, transform 180ms ease",

          "&:hover": {
            borderColor: workspace.borderStrong,
          },
        },
      },
    },

    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "20px 20px 12px",
        },

        title: {
          fontFamily: fontHeading,
          fontWeight: 600,
        },

        subheader: {
          color: workspace.textMuted,
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 20,

          "&:last-child": {
            paddingBottom: 20,
          },
        },
      },
    },

    // ---------------------------------------------------------
    // Buttons
    // ---------------------------------------------------------

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          minHeight: 40,
          borderRadius: radius.sm,
          paddingInline: 16,
          fontWeight: 600,
          transition:
            "background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
        },

        containedPrimary: {
          backgroundColor: amber.main,
          color: amber.contrast,

          "&:hover": {
            backgroundColor: amber.dark,
            boxShadow: "0 4px 12px rgba(245,158,11,0.20)",
          },
        },

        outlinedPrimary: {
          borderColor: amber.main,

          "&:hover": {
            borderColor: amber.dark,
            backgroundColor: "rgba(245,158,11,0.06)",
          },
        },

        outlined: {
          borderColor: workspace.borderStrong,

          "&:hover": {
            borderColor: ink[400],
            backgroundColor: workspace.surfaceMuted,
          },
        },

        text: {
          "&:hover": {
            backgroundColor: workspace.surfaceMuted,
          },
        },
      },
    },

    // ---------------------------------------------------------
    // Icon Buttons
    // ---------------------------------------------------------

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          color: workspace.textSecondary,

          "&:hover": {
            backgroundColor: workspace.surfaceMuted,
            color: workspace.text,
          },
        },
      },
    },

    // ---------------------------------------------------------
    // Chips
    // ---------------------------------------------------------

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontFamily: fontMono,
          fontWeight: 600,
          fontSize: "0.7rem",
          height: 26,
        },

        label: {
          paddingInline: 9,
        },

        outlined: {
          borderColor: workspace.borderStrong,
        },
      },
    },

    // ---------------------------------------------------------
    // Text fields
    // ---------------------------------------------------------

    MuiTextField: {
      defaultProps: {
        size: "small",
        variant: "outlined",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: workspace.surface,
          borderRadius: radius.sm,

          "& fieldset": {
            borderColor: workspace.borderStrong,
          },

          "&:hover fieldset": {
            borderColor: ink[400],
          },

          "&.Mui-focused fieldset": {
            borderColor: amber.main,
            borderWidth: 1,
            boxShadow: "0 0 0 3px rgba(245,158,11,0.10)",
          },
        },

        input: {
          fontFamily: fontBody,
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          color: workspace.textSecondary,

          "&.Mui-focused": {
            color: amber.dark,
          },
        },
      },
    },

    // ---------------------------------------------------------
    // Tables
    // ---------------------------------------------------------

    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          border: `1px solid ${workspace.border}`,
          backgroundColor: workspace.surface,
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: workspace.surfaceMuted,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontFamily: fontMono,
          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: workspace.textMuted,
          borderBottom: `1px solid ${workspace.border}`,
          padding: "12px 16px",
        },

        root: {
          borderBottom: `1px solid ${workspace.border}`,
          padding: "14px 16px",
          color: workspace.text,
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background-color 120ms ease",

          "&:hover": {
            backgroundColor: workspace.surfaceMuted,
          },

          "&:last-child td": {
            borderBottom: 0,
          },
        },
      },
    },

    // ---------------------------------------------------------
    // Drawer / Sidebar
    // ---------------------------------------------------------

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: sidebar.background,
          color: sidebar.text,
          borderRight: `1px solid ${sidebar.border}`,
          backgroundImage: "none",
        },
      },
    },

    // ---------------------------------------------------------
    // App Bar
    // ---------------------------------------------------------

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.92)",
          color: workspace.text,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "none",
          borderBottom: `1px solid ${workspace.border}`,
        },
      },
    },

    // ---------------------------------------------------------
    // Tabs
    // ---------------------------------------------------------

    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 44,
        },

        indicator: {
          height: 2,
          borderRadius: "2px 2px 0 0",
          backgroundColor: amber.main,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 44,
          textTransform: "none",
          fontFamily: fontBody,
          fontWeight: 600,
          color: workspace.textMuted,

          "&.Mui-selected": {
            color: workspace.text,
          },
        },
      },
    },

    // ---------------------------------------------------------
    // Dialogs
    // ---------------------------------------------------------

    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: workspace.surface,
          backgroundImage: "none",
          border: `1px solid ${workspace.border}`,
          borderRadius: radius.lg,
          boxShadow: shadows.dialog,
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: fontHeading,
          fontWeight: 700,
          fontSize: "1.2rem",
          padding: "20px 24px 12px",
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "12px 24px 20px",
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "12px 24px 20px",
          gap: 8,
        },
      },
    },

    // ---------------------------------------------------------
    // Alerts
    // ---------------------------------------------------------

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          border: "1px solid",
          fontFamily: fontBody,
        },

        standardSuccess: {
          backgroundColor: "#ECFDF3",
          borderColor: "#A7F3D0",
          color: "#166534",
        },

        standardWarning: {
          backgroundColor: "#FFFAEB",
          borderColor: "#FEDF89",
          color: "#92400E",
        },

        standardError: {
          backgroundColor: "#FEF2F2",
          borderColor: "#FECACA",
          color: "#991B1B",
        },

        standardInfo: {
          backgroundColor: "#EFF6FF",
          borderColor: "#BFDBFE",
          color: "#1E40AF",
        },
      },
    },

    // ---------------------------------------------------------
    // Tooltips
    // ---------------------------------------------------------

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: ink[900],
          color: "#FFFFFF",
          fontSize: "0.75rem",
          borderRadius: 6,
          padding: "7px 10px",
        },

        arrow: {
          color: ink[900],
        },
      },
    },

    // ---------------------------------------------------------
    // Dividers
    // ---------------------------------------------------------

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: workspace.border,
        },
      },
    },

    // ---------------------------------------------------------
    // Pagination
    // ---------------------------------------------------------

    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          fontWeight: 500,

          "&.Mui-selected": {
            backgroundColor: amber.main,
            color: amber.contrast,

            "&:hover": {
              backgroundColor: amber.dark,
            },
          },
        },
      },
    },

    // ---------------------------------------------------------
    // Circular Progress
    // ---------------------------------------------------------

    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: amber.main,
        },
      },
    },
  },
});

export default theme;
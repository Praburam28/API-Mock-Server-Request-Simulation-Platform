import { Box, Card, CardContent, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { fontHeading } from "../theme/tokens";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: 3,
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      {icon && (
        <Box sx={{ color: "text.secondary", mb: 1.5, "& svg": { fontSize: 40 } }}>{icon}</Box>
      )}
      <Typography variant="h6" sx={{ fontFamily: fontHeading, mb: description ? 0.5 : 2 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: action ? 2.5 : 0 }}>
          {description}
        </Typography>
      )}
      {action}
    </Box>
  );
}

export function StatCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: ReactNode;
  accent?: string;
  icon?: ReactNode;
}) {
  return (
    <Card sx={{ position: "relative", overflow: "hidden" }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: accent ?? "linear-gradient(90deg, #F2A93B, #8E7CF0)",
        }}
      />
      <CardContent sx={{ py: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="overline" color="text.secondary">
            {label}
          </Typography>
          {icon && <Box sx={{ color: "text.secondary", opacity: 0.7 }}>{icon}</Box>}
        </Box>
        <Typography variant="h4" sx={{ fontFamily: fontHeading }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

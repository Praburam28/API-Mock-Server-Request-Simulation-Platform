import { Chip, Box } from "@mui/material";
import { methodColors, statusColor } from "../theme/tokens";

export function MethodBadge({ method }: { method: string }) {
  const upper = method.toUpperCase();
  const color = methodColors[upper] ?? "#93A1C4";
  return (
    <Chip
      label={upper}
      size="small"
      sx={{
        color,
        backgroundColor: `${color}1F`,
        border: `1px solid ${color}55`,
        fontWeight: 700,
        minWidth: 66,
      }}
    />
  );
}

export function StatusBadge({ status }: { status: number }) {
  const color = statusColor(status);
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        color,
        backgroundColor: `${color}1F`,
        border: `1px solid ${color}55`,
        fontWeight: 700,
      }}
    />
  );
}

export function ActiveDot({ active }: { active: boolean }) {
  const color = active ? "#5FD48C" : "#65759E";
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: color,
        boxShadow: active ? `0 0 8px ${color}` : "none",
        mr: 1,
      }}
    />
  );
}

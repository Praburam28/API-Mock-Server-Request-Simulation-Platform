import { Box, Divider, Drawer, IconButton, Stack, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import type { RequestLog } from "../types";
import { MethodBadge, StatusBadge } from "./Badges";
import { fontMono } from "../theme/tokens";

function JsonBlock({ label, value }: { label: string; value: unknown }) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <Box
        sx={{
          fontFamily: fontMono,
          fontSize: "0.78rem",
          backgroundColor: "background.default",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 1.5,
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          color: "text.secondary",
          maxHeight: 240,
          overflow: "auto",
        }}
      >
        {value ? JSON.stringify(value, null, 2) : "—"}
      </Box>
    </Box>
  );
}

export default function RequestLogDrawer({
  log,
  onClose,
}: {
  log: RequestLog | null;
  onClose: () => void;
}) {
  return (
    <Drawer anchor="right" open={!!log} onClose={onClose}>
      {log && (
        <Box sx={{ width: 440, p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <MethodBadge method={log.method} />
                <StatusBadge status={log.response_status} />
              </Stack>
              <Typography sx={{ fontFamily: fontMono, fontSize: "0.85rem" }}>{log.path}</Typography>
            </Box>
            <IconButton size="small" onClick={onClose}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Response Time
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {log.response_time_ms} ms
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Timestamp
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {new Date(log.created_at).toLocaleString()}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            <JsonBlock label="Query Parameters" value={log.query_params} />
            <JsonBlock label="Path Parameters" value={log.path_params} />
            <JsonBlock label="Request Headers" value={log.request_headers} />
            <JsonBlock label="Request Body" value={log.request_body} />
          </Stack>
        </Box>
      )}
    </Drawer>
  );
}

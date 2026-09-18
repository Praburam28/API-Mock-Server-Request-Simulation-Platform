import { useEffect, useState } from "react";
import {
  Box,
  LinearProgress,
  MenuItem,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import { requestLogApi } from "../api/misc";
import { mockApiApi } from "../api/mockApis";
import type { MockAPI, RequestLog } from "../types";
import { MethodBadge, StatusBadge } from "../components/Badges";
import { EmptyState } from "../components/Common";
import RequestLogDrawer from "../components/RequestLogDrawer";
import { useToast } from "../context/ToastContext";
import { extractErrorMessage } from "../api/client";
import { fontHeading, fontMono } from "../theme/tokens";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const STATUS_GROUPS = [
  { label: "2xx Success", value: "2" },
  { label: "3xx Redirect", value: "3" },
  { label: "4xx Client Error", value: "4" },
  { label: "5xx Server Error", value: "5" },
];

export default function RequestLogsPage() {
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [mockApis, setMockApis] = useState<MockAPI[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RequestLog | null>(null);

  const [mockApiFilter, setMockApiFilter] = useState<number | "">("");
  const [methodFilter, setMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { notify } = useToast();
  const pageSize = 20;

  useEffect(() => {
    mockApiApi.list().then(setMockApis).catch(() => undefined);
  }, []);

  useEffect(() => {
    setLoading(true);
    requestLogApi
      .list({
        page,
        page_size: pageSize,
        mock_api_id: mockApiFilter || undefined,
        method: methodFilter || undefined,
      })
      .then((res) => {
        // Client-side narrow by status-code first digit since the API takes an exact code.
        const items = statusFilter
          ? res.items.filter((l) => String(l.response_status).startsWith(statusFilter))
          : res.items;
        setLogs(items);
        setTotal(res.total);
        setTotalPages(res.total_pages);
      })
      .catch((err) => notify(extractErrorMessage(err), "error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, mockApiFilter, methodFilter, statusFilter]);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontFamily: fontHeading, mb: 0.5 }}>
        Request History
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {total.toLocaleString()} requests logged across all mock endpoints.
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2.5 }} flexWrap="wrap" useFlexGap>
        <TextField
          select
          size="small"
          label="Mock API"
          value={mockApiFilter}
          onChange={(e) => {
            setPage(1);
            setMockApiFilter(e.target.value ? Number(e.target.value) : "");
          }}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All endpoints</MenuItem>
          {mockApis.map((api) => (
            <MenuItem key={api.id} value={api.id}>
              {api.method} {api.path}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Method"
          value={methodFilter}
          onChange={(e) => {
            setPage(1);
            setMethodFilter(e.target.value);
          }}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All methods</MenuItem>
          {METHODS.map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          sx={{ minWidth: 170 }}
        >
          <MenuItem value="">All statuses</MenuItem>
          {STATUS_GROUPS.map((g) => (
            <MenuItem key={g.value} value={g.value}>
              {g.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}

      {!loading && logs.length === 0 ? (
        <EmptyState icon={<HistoryRoundedIcon />} title="No requests found" description="Try adjusting your filters, or call a mock endpoint." />
      ) : (
        <>
          <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Method</TableCell>
                  <TableCell>Path</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Response Time</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} hover sx={{ cursor: "pointer" }} onClick={() => setSelected(log)}>
                    <TableCell>
                      <MethodBadge method={log.method} />
                    </TableCell>
                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.8rem" }}>{log.path}</TableCell>
                    <TableCell>
                      <StatusBadge status={log.response_status} />
                    </TableCell>
                    <TableCell sx={{ fontFamily: fontMono, fontSize: "0.8rem" }}>
                      {log.response_time_ms} ms
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
            </Box>
          )}
        </>
      )}

      <RequestLogDrawer log={selected} onClose={() => setSelected(null)} />
    </Box>
  );
}

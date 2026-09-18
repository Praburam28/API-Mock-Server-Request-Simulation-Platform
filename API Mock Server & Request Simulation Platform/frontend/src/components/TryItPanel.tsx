import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { apiClient, API_BASE_URL } from "../api/client";
import type { MockAPI } from "../types";
import { MethodBadge, StatusBadge } from "./Badges";
import JsonEditor from "./JsonEditor";
import { fontMono } from "../theme/tokens";

interface KeyValue {
  key: string;
  value: string;
}

interface ExecutionResult {
  status: number;
  timeMs: number;
  headers: Record<string, string>;
  body: unknown;
  error?: string;
}

const BODY_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function extractPathParams(path: string): string[] {
  const matches = path.match(/\{([^{}]+)\}/g) ?? [];
  return matches.map((m) => m.slice(1, -1));
}

function KeyValueEditor({
  label,
  rows,
  onChange,
}: {
  label: string;
  rows: KeyValue[];
  onChange: (rows: KeyValue[]) => void;
}) {
  const update = (idx: number, field: "key" | "value", val: string) => {
    const next = [...rows];
    next[idx] = { ...next[idx], [field]: val };
    onChange(next);
  };
  const remove = (idx: number) => onChange(rows.filter((_, i) => i !== idx));
  const add = () => onChange([...rows, { key: "", value: "" }]);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
        <Button size="small" startIcon={<AddRoundedIcon sx={{ fontSize: 16 }} />} onClick={add}>
          Add
        </Button>
      </Box>
      {rows.length === 0 ? (
        <Typography variant="caption" color="text.secondary">
          None
        </Typography>
      ) : (
        <Stack spacing={1}>
          {rows.map((row, idx) => (
            <Stack direction="row" spacing={1} key={idx} alignItems="center">
              <TextField
                placeholder="key"
                value={row.key}
                onChange={(e) => update(idx, "key", e.target.value)}
                size="small"
                sx={{ flex: 1, "& input": { fontFamily: fontMono, fontSize: "0.8rem" } }}
              />
              <TextField
                placeholder="value"
                value={row.value}
                onChange={(e) => update(idx, "value", e.target.value)}
                size="small"
                sx={{ flex: 1, "& input": { fontFamily: fontMono, fontSize: "0.8rem" } }}
              />
              <IconButton size="small" onClick={() => remove(idx)}>
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default function TryItPanel({ api }: { api: MockAPI }) {
  const pathParamNames = useMemo(() => extractPathParams(api.path), [api.path]);

  const [pathValues, setPathValues] = useState<Record<string, string>>({});
  const [queryRows, setQueryRows] = useState<KeyValue[]>([]);
  const [headerRows, setHeaderRows] = useState<KeyValue[]>(
    api.requires_auth ? [] : []
  );
  const [body, setBody] = useState<Record<string, unknown> | null>(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);

  const resolvedPath = useMemo(() => {
    let p = api.path;
    for (const name of pathParamNames) {
      const val = pathValues[name];
      p = p.replace(`{${name}}`, val && val.length > 0 ? val : `{${name}}`);
    }
    return p;
  }, [api.path, pathParamNames, pathValues]);

  const fullUrl = `${API_BASE_URL}/mock${resolvedPath}`;

  const handleSend = async () => {
    setSending(true);
    setResult(null);
    const start = performance.now();
    try {
      const params: Record<string, string> = {};
      queryRows.forEach((r) => {
        if (r.key) params[r.key] = r.value;
      });
      const headers: Record<string, string> = {};
      headerRows.forEach((r) => {
        if (r.key) headers[r.key] = r.value;
      });

      const response = await apiClient.request({
        url: `/mock${resolvedPath}`,
        method: api.method,
        params,
        headers,
        data: BODY_METHODS.has(api.method.toUpperCase()) ? body ?? undefined : undefined,
        validateStatus: () => true, // handle every status ourselves, don't throw
      });

      setResult({
        status: response.status,
        timeMs: Math.round(performance.now() - start),
        headers: response.headers as Record<string, string>,
        body: response.data,
      });
    } catch (err: any) {
      setResult({
        status: 0,
        timeMs: Math.round(performance.now() - start),
        headers: {},
        body: null,
        error: err?.message ?? "Request failed — is the backend reachable?",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <MethodBadge method={api.method} />
              <Typography sx={{ fontFamily: fontMono, fontSize: "0.85rem", wordBreak: "break-all" }}>
                {fullUrl}
              </Typography>
            </Stack>

            <Stack spacing={2.5}>
              {pathParamNames.length > 0 && (
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Path Parameters
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 0.5 }}>
                    {pathParamNames.map((name) => (
                      <TextField
                        key={name}
                        label={name}
                        size="small"
                        value={pathValues[name] ?? ""}
                        onChange={(e) => setPathValues((prev) => ({ ...prev, [name]: e.target.value }))}
                        sx={{ "& input": { fontFamily: fontMono, fontSize: "0.8rem" } }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <KeyValueEditor label="Query Parameters" rows={queryRows} onChange={setQueryRows} />

              <Box>
                <KeyValueEditor label="Headers" rows={headerRows} onChange={setHeaderRows} />
                {api.requires_auth && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                    This endpoint requires auth — your logged-in session's Bearer token is sent
                    automatically, no need to add it here.
                  </Typography>
                )}
              </Box>

              {BODY_METHODS.has(api.method.toUpperCase()) && (
                <JsonEditor label="Request Body" value={body} onChange={setBody} minRows={5} />
              )}

              <Button
                variant="contained"
                startIcon={<SendRoundedIcon />}
                onClick={handleSend}
                disabled={sending}
                size="large"
              >
                {sending ? "Sending…" : "Send Request"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
              Response
            </Typography>

            {!result && !sending && (
              <Typography variant="body2" color="text.secondary">
                Send a request to see the mock response here.
              </Typography>
            )}

            {sending && (
              <Typography variant="body2" color="text.secondary">
                Waiting for response…
              </Typography>
            )}

            {result && (
              <Box>
                {result.error ? (
                  <Typography variant="body2" color="error.main">
                    {result.error}
                  </Typography>
                ) : (
                  <>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                      <StatusBadge status={result.status} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: fontMono }}>
                        {result.timeMs} ms
                      </Typography>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="caption" color="text.secondary">
                      Body
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
                        mt: 0.5,
                        mb: 2,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        maxHeight: 280,
                        overflow: "auto",
                      }}
                    >
                      {result.body ? JSON.stringify(result.body, null, 2) : "—"}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Response Headers
                    </Typography>
                    <Box
                      sx={{
                        fontFamily: fontMono,
                        fontSize: "0.75rem",
                        color: "text.secondary",
                        mt: 0.5,
                      }}
                    >
                      {Object.entries(result.headers).map(([k, v]) => (
                        <Box key={k}>
                          {k}: {v}
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
              </Box>
            )}

            <Tooltip title="Every call here is also written to Request History">
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 3 }}>
                Calls made from this panel are logged just like real traffic.
              </Typography>
            </Tooltip>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

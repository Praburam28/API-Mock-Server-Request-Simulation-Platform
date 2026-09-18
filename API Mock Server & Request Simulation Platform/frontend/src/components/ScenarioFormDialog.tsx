import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { SCENARIO_TYPES, type ResponseScenario, type ResponseScenarioPayload } from "../types";
import JsonEditor from "./JsonEditor";

const DEFAULT_STATUS_BY_TYPE: Record<string, number> = {
  success: 200,
  validation_error: 422,
  unauthorized: 401,
  not_found: 404,
  server_error: 500,
  custom: 200,
};

const SCENARIO_LABELS: Record<string, string> = {
  success: "Success Response",
  validation_error: "Validation Error",
  unauthorized: "Unauthorized",
  not_found: "Not Found",
  server_error: "Server Error",
  custom: "Custom Response",
};

interface ScenarioFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: ResponseScenarioPayload) => Promise<void>;
  initial?: ResponseScenario | null;
}

export default function ScenarioFormDialog({ open, onClose, onSubmit, initial }: ScenarioFormDialogProps) {
  const [name, setName] = useState("");
  const [scenarioType, setScenarioType] = useState<string>("success");
  const [statusCode, setStatusCode] = useState(200);
  const [delayMs, setDelayMs] = useState(0);
  const [isDefault, setIsDefault] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState("");
  const [responseBody, setResponseBody] = useState<Record<string, unknown> | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setScenarioType(initial?.scenario_type ?? "success");
      setStatusCode(initial?.status_code ?? 200);
      setDelayMs(initial?.delay_ms ?? 0);
      setIsDefault(initial?.is_default ?? false);
      setIsActive(initial?.is_active ?? true);
      setDescription(initial?.description ?? "");
      setResponseBody(initial?.response_body ?? null);
      setResponseHeaders(initial?.response_headers ?? null);
    }
  }, [open, initial]);

  const handleTypeChange = (type: string) => {
    setScenarioType(type);
    if (!initial) {
      setStatusCode(DEFAULT_STATUS_BY_TYPE[type] ?? 200);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSubmit({
        name,
        scenario_type: scenarioType,
        response_body: responseBody,
        response_headers: responseHeaders as Record<string, string> | null,
        status_code: statusCode,
        delay_ms: delayMs,
        is_default: isDefault,
        is_active: isActive,
        description: description || null,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? "Edit Response Scenario" : "New Response Scenario"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
            </Grid>
            <Grid item xs={5}>
              <TextField
                select
                label="Scenario Type"
                value={scenarioType}
                onChange={(e) => handleTypeChange(e.target.value)}
                fullWidth
              >
                {SCENARIO_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {SCENARIO_LABELS[t]}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="HTTP Status Code"
                type="number"
                value={statusCode}
                onChange={(e) => setStatusCode(Number(e.target.value))}
                fullWidth
                inputProps={{ min: 100, max: 599 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Response Delay (ms)"
                type="number"
                value={delayMs}
                onChange={(e) => setDelayMs(Number(e.target.value))}
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>

          <JsonEditor label="Response Body" value={responseBody} onChange={setResponseBody} minRows={5} />
          <JsonEditor label="Response Headers" value={responseHeaders} onChange={setResponseHeaders} minRows={2} />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={2}
            fullWidth
          />

          <Stack direction="row" spacing={3}>
            <FormControlLabel
              control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
              label="Active"
            />
            <FormControlLabel
              control={<Switch checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />}
              label="Serve as default"
            />
          </Stack>
          {isDefault && (
            <Typography variant="caption" color="text.secondary">
              Only one scenario per version is served live — marking this as default will replace the
              current default.
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving || !name}>
          {saving ? "Saving…" : initial ? "Save changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

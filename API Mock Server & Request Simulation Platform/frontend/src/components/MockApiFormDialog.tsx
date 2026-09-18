import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import type { CreateMockAPIPayload, MockAPI, UpdateMockAPIPayload } from "../types";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

interface MockApiFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateMockAPIPayload | UpdateMockAPIPayload) => Promise<void>;
  initial?: MockAPI | null;
}

export default function MockApiFormDialog({ open, onClose, onSubmit, initial }: MockApiFormDialogProps) {
  const [name, setName] = useState("");
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("");
  const [description, setDescription] = useState("");
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setMethod(initial?.method ?? "GET");
      setPath(initial?.path ?? "");
      setDescription(initial?.description ?? "");
      setRequiresAuth(initial?.requires_auth ?? false);
    }
  }, [open, initial]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSubmit({
        name,
        method,
        path,
        description: description || null,
        requires_auth: requiresAuth,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? "Edit Mock API" : "New Mock API"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              sx={{ width: 160 }}
            >
              {METHODS.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/users/{id}"
              fullWidth
              required
              helperText="Will be exposed at /mock<path>"
            />
          </Stack>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={2}
            fullWidth
          />
          <FormControlLabel
            control={<Switch checked={requiresAuth} onChange={(e) => setRequiresAuth(e.target.checked)} />}
            label="Requires authentication (Bearer token) when called"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={saving || !name || !path}
        >
          {saving ? "Saving…" : initial ? "Save changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

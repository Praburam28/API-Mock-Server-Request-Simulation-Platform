import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import type { APIVersion, CreateAPIVersionPayload, UpdateAPIVersionPayload } from "../types";

interface VersionFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAPIVersionPayload | UpdateAPIVersionPayload) => Promise<void>;
  initial?: APIVersion | null;
}

export default function VersionFormDialog({ open, onClose, onSubmit, initial }: VersionFormDialogProps) {
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setVersion(initial?.version ?? "");
      setDescription(initial?.description ?? "");
      setIsActive(initial?.is_active ?? true);
    }
  }, [open, initial]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload: CreateAPIVersionPayload | UpdateAPIVersionPayload = initial
        ? { version, description: description || null, is_active: isActive }
        : { version, description: description || null };
      await onSubmit(payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initial ? "Edit Version" : "New Version"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="v1"
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={2}
            fullWidth
          />
          {initial && (
            <FormControlLabel
              control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
              label="Active"
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving || !version}>
          {saving ? "Saving…" : initial ? "Save changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

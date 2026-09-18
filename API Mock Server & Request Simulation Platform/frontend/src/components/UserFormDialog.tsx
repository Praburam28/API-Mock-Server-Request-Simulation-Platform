import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import type { UserCreatePayload, UserResponse, UserUpdatePayload } from "../types";

const ROLES = [
  { id: 1, label: "Admin" },
  { id: 2, label: "User" },
];

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  // For edits, roleId is passed separately so the caller can decide whether
  // to hit PATCH /users/{id}/role (only when it actually changed).
  onSubmit: (
    payload: UserCreatePayload | UserUpdatePayload,
    roleId?: number
  ) => Promise<void>;
  initial?: UserResponse | null;
}

export default function UserFormDialog({ open, onClose, onSubmit, initial }: UserFormDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(2);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setFirstName(initial?.first_name ?? "");
      setLastName(initial?.last_name ?? "");
      setEmail(initial?.email ?? "");
      setPassword("");
      setRoleId(initial?.role_id ?? 2);
    }
  }, [open, initial]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (initial) {
        const roleChanged = roleId !== initial.role_id;
        await onSubmit(
          { first_name: firstName, last_name: lastName, email },
          roleChanged ? roleId : undefined
        );
      } else {
        await onSubmit({ first_name: firstName, last_name: lastName, email, password, role_id: roleId });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initial ? "Edit User" : "New User"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Stack direction="row" spacing={2}>
            <TextField label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth required />
            <TextField label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth required />
          </Stack>
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
          {!initial && (
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              helperText="At least 8 characters"
            />
          )}
          <TextField select label="Role" value={roleId} onChange={(e) => setRoleId(Number(e.target.value))} fullWidth>
            {ROLES.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving || !firstName || !lastName || !email}>
          {saving ? "Saving…" : initial ? "Save changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

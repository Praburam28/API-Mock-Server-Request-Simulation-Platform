import { useEffect, useState } from "react";
import { Box, TextField, Typography, Chip } from "@mui/material";
import { fontMono } from "../theme/tokens";

interface JsonEditorProps {
  label: string;
  value: Record<string, unknown> | null;
  onChange: (value: Record<string, unknown> | null) => void;
  helperText?: string;
  minRows?: number;
  placeholder?: string;
}

/**
 * A plain-text JSON editor (monospace textarea) that validates on the fly.
 * Kept dependency-free — no external code-editor library required.
 */
export default function JsonEditor({
  label,
  value,
  onChange,
  helperText,
  minRows = 6,
  placeholder,
}: JsonEditorProps) {
  const [text, setText] = useState(() => (value ? JSON.stringify(value, null, 2) : ""));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setText(value ? JSON.stringify(value, null, 2) : "");
  }, [value]);

  const handleChange = (raw: string) => {
    setText(raw);
    if (raw.trim() === "") {
      setError(null);
      onChange(null);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        setError("Must be a JSON object, e.g. { \"key\": \"value\" }");
        return;
      }
      setError(null);
      onChange(parsed);
    } catch {
      setError("Invalid JSON");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
        {error && <Chip label={error} size="small" color="error" variant="outlined" />}
      </Box>
      <TextField
        fullWidth
        multiline
        minRows={minRows}
        value={text}
        placeholder={placeholder ?? '{\n  "id": "integer",\n  "name": "string"\n}'}
        onChange={(e) => handleChange(e.target.value)}
        error={!!error}
        helperText={helperText}
        InputProps={{ sx: { fontFamily: fontMono, fontSize: "0.82rem" } }}
      />
    </Box>
  );
}

import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { responseTemplateApi } from "../api/versionResources";
import type { ResponseTemplate } from "../types";
import JsonEditor from "./JsonEditor";
import { useToast } from "../context/ToastContext";
import { extractErrorMessage } from "../api/client";

export default function ResponseTemplatePanel({
  mockApiId,
  versionId,
}: {
  mockApiId: number;
  versionId: number;
}) {
  const [existing, setExisting] = useState<ResponseTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [body, setBody] = useState<Record<string, unknown> | null>(null);
  const [headers, setHeaders] = useState<Record<string, unknown> | null>(null);
  const [statusCode, setStatusCode] = useState(200);

  const { notify } = useToast();

  useEffect(() => {
    setLoading(true);
    responseTemplateApi
      .get(mockApiId, versionId)
      .then((data) => {
        setExisting(data);
        setBody(data?.response_body ?? null);
        setHeaders(data?.response_headers ?? null);
        setStatusCode(data?.status_code ?? 200);
      })
      .catch((err) => notify(extractErrorMessage(err), "error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockApiId, versionId]);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      response_body: body,
      response_headers: headers as Record<string, string> | null,
      status_code: statusCode,
    };
    try {
      const saved = existing
        ? await responseTemplateApi.update(mockApiId, versionId, payload)
        : await responseTemplateApi.create(mockApiId, versionId, payload);
      setExisting(saved);
      notify("Response template saved", "success");
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box>
            <Typography variant="h6">Default Response Template</Typography>
            <Typography variant="body2" color="text.secondary">
              A baseline body/headers/status used as a starting point for scenarios.
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<SaveRoundedIcon />} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Status Code"
              type="number"
              value={statusCode}
              onChange={(e) => setStatusCode(Number(e.target.value))}
              fullWidth
              inputProps={{ min: 100, max: 599 }}
            />
          </Grid>
          <Grid item xs={12}>
            <JsonEditor label="Response Body" value={body} onChange={setBody} minRows={6} />
          </Grid>
          <Grid item xs={12}>
            <JsonEditor
              label="Response Headers"
              value={headers}
              onChange={setHeaders}
              minRows={3}
              placeholder='{\n  "X-Powered-By": "MockForge"\n}'
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

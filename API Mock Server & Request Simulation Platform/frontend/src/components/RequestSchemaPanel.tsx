import { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { requestSchemaApi } from "../api/versionResources";
import type { RequestSchema } from "../types";
import JsonEditor from "./JsonEditor";
import { useToast } from "../context/ToastContext";
import { extractErrorMessage } from "../api/client";
import { fontMono } from "../theme/tokens";

const SCHEMA_HINT =
  'Map each field name to a type: "string", "integer", "float", or "boolean".';

export default function RequestSchemaPanel({
  mockApiId,
  versionId,
}: {
  mockApiId: number;
  versionId: number;
}) {
  const [existing, setExisting] = useState<RequestSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [bodySchema, setBodySchema] = useState<Record<string, unknown> | null>(null);
  const [querySchema, setQuerySchema] = useState<Record<string, unknown> | null>(null);
  const [pathSchema, setPathSchema] = useState<Record<string, unknown> | null>(null);
  const [headerSchema, setHeaderSchema] = useState<Record<string, unknown> | null>(null);

  const { notify } = useToast();

  useEffect(() => {
    setLoading(true);
    requestSchemaApi
      .get(mockApiId, versionId)
      .then((data) => {
        setExisting(data);
        setBodySchema(data?.body_schema ?? null);
        setQuerySchema(data?.query_schema ?? null);
        setPathSchema(data?.path_schema ?? null);
        setHeaderSchema(data?.header_schema ?? null);
      })
      .catch((err) => notify(extractErrorMessage(err), "error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockApiId, versionId]);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      body_schema: bodySchema as Record<string, string> | null,
      query_schema: querySchema as Record<string, string> | null,
      path_schema: pathSchema as Record<string, string> | null,
      header_schema: headerSchema as Record<string, string> | null,
    };
    try {
      const saved = existing
        ? await requestSchemaApi.update(mockApiId, versionId, payload)
        : await requestSchemaApi.create(mockApiId, versionId, payload);
      setExisting(saved);
      notify("Request schema saved", "success");
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
            <Typography variant="h6">Request Schema</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: fontMono, fontSize: "0.78rem" }}>
              {SCHEMA_HINT}
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<SaveRoundedIcon />} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <JsonEditor label="Body Schema" value={bodySchema} onChange={setBodySchema} minRows={5} />
          </Grid>
          <Grid item xs={12} md={6}>
            <JsonEditor label="Query Parameter Schema" value={querySchema} onChange={setQuerySchema} minRows={5} />
          </Grid>
          <Grid item xs={12} md={6}>
            <JsonEditor label="Path Parameter Schema" value={pathSchema} onChange={setPathSchema} minRows={5} />
          </Grid>
          <Grid item xs={12} md={6}>
            <JsonEditor label="Header Schema" value={headerSchema} onChange={setHeaderSchema} minRows={5} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

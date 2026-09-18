import { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Link as MuiLink,
  MenuItem,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { mockApiApi } from "../api/mockApis";
import { apiVersionApi } from "../api/apiVersions";
import type { APIVersion, CreateAPIVersionPayload, MockAPI, UpdateAPIVersionPayload } from "../types";
import { MethodBadge, ActiveDot } from "../components/Badges";
import { EmptyState } from "../components/Common";
import VersionFormDialog from "../components/VersionFormDialog";
import RequestSchemaPanel from "../components/RequestSchemaPanel";
import ResponseTemplatePanel from "../components/ResponseTemplatePanel";
import ResponseScenariosPanel from "../components/ResponseScenariosPanel";
import TryItPanel from "../components/TryItPanel";
import { useToast } from "../context/ToastContext";
import { extractErrorMessage, API_BASE_URL } from "../api/client";
import { fontHeading, fontMono } from "../theme/tokens";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

type TabKey = "try-it" | "request-schema" | "response-template" | "scenarios";

export default function MockApiDetailPage() {
  const { id } = useParams();
  const mockApiId = Number(id);
  const navigate = useNavigate();
  const { notify } = useToast();

  const [api, setApi] = useState<MockAPI | null>(null);
  const [versions, setVersions] = useState<APIVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [versionFormOpen, setVersionFormOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState<APIVersion | null>(null);
  const [tab, setTab] = useState<TabKey>("try-it");

  const load = () => {
    setLoading(true);
    Promise.all([mockApiApi.get(mockApiId), apiVersionApi.list(mockApiId)])
      .then(([apiData, versionData]) => {
        setApi(apiData);
        setVersions(versionData);
        setSelectedVersionId((prev) => {
          if (prev && versionData.some((v) => v.id === prev)) return prev;
          const active = versionData.find((v) => v.is_active);
          return (active ?? versionData[0])?.id ?? "";
        });
      })
      .catch((err) => notify(extractErrorMessage(err), "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [mockApiId]);

  const handleVersionSubmit = async (payload: CreateAPIVersionPayload | UpdateAPIVersionPayload) => {
    try {
      if (editingVersion) {
        await apiVersionApi.update(mockApiId, editingVersion.id, payload as UpdateAPIVersionPayload);
        notify("Version updated", "success");
      } else {
        const created = await apiVersionApi.create(mockApiId, payload as CreateAPIVersionPayload);
        setSelectedVersionId(created.id);
        notify("Version created", "success");
      }
      load();
    } catch (err) {
      notify(extractErrorMessage(err), "error");
      throw err;
    }
  };

  const handleToggleActive = async () => {
    if (!api) return;
    try {
      const updated = await mockApiApi.update(api.id, { is_active: !api.is_active });
      setApi(updated);
      notify(updated.is_active ? "Mock API activated" : "Mock API deactivated", "success");
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    }
  };

  const copyUrl = () => {
    if (!api) return;
    navigator.clipboard.writeText(`${API_BASE_URL}/mock${api.path}`);
    notify("Endpoint URL copied", "info");
  };

  if (loading && !api) return <LinearProgress sx={{ borderRadius: 2 }} />;
  if (!api) return null;

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 1.5 }}>
        <MuiLink component={RouterLink} to="/mock-apis" underline="hover" color="text.secondary">
          Mock APIs
        </MuiLink>
        <Typography color="text.primary">{api.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
            <MethodBadge method={api.method} />
            <Typography variant="h4" sx={{ fontFamily: fontHeading }}>
              {api.name}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ fontFamily: fontMono, fontSize: "0.85rem", color: "text.secondary" }}>
              {API_BASE_URL}/mock{api.path}
            </Typography>
            <Tooltip title="Copy URL">
              <IconButton size="small" onClick={copyUrl}>
                <ContentCopyRoundedIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
            {api.requires_auth && <Chip size="small" label="Auth required" variant="outlined" />}
          </Stack>
          {api.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 560 }}>
              {api.description}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <ActiveDot active={api.is_active} />
          <Typography variant="body2" color="text.secondary">
            {api.is_active ? "Active" : "Inactive"}
          </Typography>
          <Switch checked={api.is_active} onChange={handleToggleActive} />
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PlayArrowRoundedIcon />}
            onClick={() => setTab("try-it")}
          >
            Try It
          </Button>
        </Stack>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Typography variant="overline" color="text.secondary">
          Version
        </Typography>
        {versions.length > 0 ? (
          <Select
            size="small"
            value={selectedVersionId}
            onChange={(e) => setSelectedVersionId(Number(e.target.value))}
            sx={{ minWidth: 160, fontFamily: fontMono }}
          >
            {versions.map((v) => (
              <MenuItem key={v.id} value={v.id} sx={{ fontFamily: fontMono }}>
                {v.version} {v.is_active ? "" : "(inactive)"}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No versions yet
          </Typography>
        )}
        <Button
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={() => {
            setEditingVersion(null);
            setVersionFormOpen(true);
          }}
        >
          Add version
        </Button>
        {selectedVersionId && (
          <Button
            size="small"
            color="inherit"
            onClick={() => {
              const v = versions.find((x) => x.id === selectedVersionId);
              if (v) {
                setEditingVersion(v);
                setVersionFormOpen(true);
              }
            }}
          >
            Edit version
          </Button>
        )}
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2.5, borderBottom: 1, borderColor: "divider" }}>
        <Tab
          label="Try It"
          value="try-it"
          icon={<PlayArrowRoundedIcon sx={{ fontSize: 17 }} />}
          iconPosition="start"
        />
        <Tab label="Response Scenarios" value="scenarios" disabled={versions.length === 0} />
        <Tab label="Request Schema" value="request-schema" disabled={versions.length === 0} />
        <Tab label="Response Template" value="response-template" disabled={versions.length === 0} />
      </Tabs>

      {tab === "try-it" && <TryItPanel api={api} />}

      {tab !== "try-it" && versions.length === 0 && (
        <EmptyState
          title="Create a version to continue"
          description="Every mock API needs at least one API version before you can configure its schema and responses."
          action={
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setVersionFormOpen(true)}>
              Add version
            </Button>
          }
        />
      )}

      {selectedVersionId && (
        <>
          {tab === "scenarios" && (
            <ResponseScenariosPanel mockApiId={mockApiId} versionId={selectedVersionId as number} />
          )}
          {tab === "request-schema" && (
            <RequestSchemaPanel mockApiId={mockApiId} versionId={selectedVersionId as number} />
          )}
          {tab === "response-template" && (
            <ResponseTemplatePanel mockApiId={mockApiId} versionId={selectedVersionId as number} />
          )}
        </>
      )}

      <VersionFormDialog
        open={versionFormOpen}
        onClose={() => setVersionFormOpen(false)}
        onSubmit={handleVersionSubmit}
        initial={editingVersion}
      />
    </Box>
  );
}

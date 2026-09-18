import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import { responseScenarioApi } from "../api/versionResources";
import type { ResponseScenario, ResponseScenarioPayload } from "../types";
import { StatusBadge, ActiveDot } from "./Badges";
import { EmptyState } from "./Common";
import ScenarioFormDialog from "./ScenarioFormDialog";
import ConfirmDialog from "./ConfirmDialog";
import { useToast } from "../context/ToastContext";
import { extractErrorMessage } from "../api/client";

const SCENARIO_LABELS: Record<string, string> = {
  success: "Success",
  validation_error: "Validation Error",
  unauthorized: "Unauthorized",
  not_found: "Not Found",
  server_error: "Server Error",
  custom: "Custom",
};

export default function ResponseScenariosPanel({
  mockApiId,
  versionId,
}: {
  mockApiId: number;
  versionId: number;
}) {
  const [scenarios, setScenarios] = useState<ResponseScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ResponseScenario | null>(null);
  const [deleting, setDeleting] = useState<ResponseScenario | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { notify } = useToast();

  const load = () => {
    setLoading(true);
    responseScenarioApi
      .list(mockApiId, versionId)
      .then(setScenarios)
      .catch((err) => notify(extractErrorMessage(err), "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [mockApiId, versionId]);

  const handleSubmit = async (payload: ResponseScenarioPayload) => {
    try {
      if (editing) {
        await responseScenarioApi.update(mockApiId, versionId, editing.id, payload);
        notify("Scenario updated", "success");
      } else {
        await responseScenarioApi.create(mockApiId, versionId, payload);
        notify("Scenario created", "success");
      }
      load();
    } catch (err) {
      notify(extractErrorMessage(err), "error");
      throw err;
    }
  };

  const handleSetDefault = async (scenario: ResponseScenario) => {
    try {
      await responseScenarioApi.update(mockApiId, versionId, scenario.id, { is_default: true });
      notify(`"${scenario.name}" is now the default response`, "success");
      load();
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await responseScenarioApi.remove(mockApiId, versionId, deleting.id);
      notify("Scenario deleted", "success");
      setDeleting(null);
      load();
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Box>
          <Typography variant="h6">Response Scenarios</Typography>
          <Typography variant="body2" color="text.secondary">
            The scenario marked "default" is what live calls to this endpoint return.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          New Scenario
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}

      {!loading && scenarios.length === 0 ? (
        <EmptyState
          title="No response scenarios"
          description="Add a success scenario and mark it default to start serving live responses."
        />
      ) : (
        <Stack spacing={1.5}>
          {scenarios.map((s) => (
            <Card key={s.id} variant="outlined" sx={{ borderColor: s.is_default ? "primary.main" : "divider" }}>
              <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <ActiveDot active={s.is_active} />
                      <Typography variant="subtitle1">{s.name}</Typography>
                      {s.is_default && (
                        <Chip
                          size="small"
                          icon={<StarRoundedIcon sx={{ fontSize: 14 }} />}
                          label="Default"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <Chip size="small" label={SCENARIO_LABELS[s.scenario_type] ?? s.scenario_type} variant="outlined" />
                      <StatusBadge status={s.status_code} />
                      {s.delay_ms > 0 && (
                        <Chip
                          size="small"
                          icon={<TimerOutlinedIcon sx={{ fontSize: 14 }} />}
                          label={`${s.delay_ms}ms delay`}
                          variant="outlined"
                        />
                      )}
                    </Stack>
                    {s.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {s.description}
                      </Typography>
                    )}
                  </Box>
                  <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                    {!s.is_default && (
                      <Tooltip title="Set as default">
                        <IconButton size="small" onClick={() => handleSetDefault(s)}>
                          <StarOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditing(s);
                          setFormOpen(true);
                        }}
                      >
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => setDeleting(s)}>
                        <DeleteOutlineRoundedIcon fontSize="small" color="error" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <ScenarioFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initial={editing} />

      <ConfirmDialog
        open={!!deleting}
        title="Delete this scenario?"
        description={`"${deleting?.name}" will be permanently removed.`}
        confirmLabel="Delete"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </Box>
  );
}

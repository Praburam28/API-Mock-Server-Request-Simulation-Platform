import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import { useNavigate } from "react-router-dom";
import { mockApiApi } from "../api/mockApis";
import type { CreateMockAPIPayload, MockAPI, UpdateMockAPIPayload } from "../types";
import { MethodBadge, ActiveDot } from "../components/Badges";
import { EmptyState } from "../components/Common";
import MockApiFormDialog from "../components/MockApiFormDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { extractErrorMessage } from "../api/client";
import { fontHeading, fontMono } from "../theme/tokens";

export default function MockApiListPage() {
  const [apis, setApis] = useState<MockAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MockAPI | null>(null);
  const [deleting, setDeleting] = useState<MockAPI | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { notify } = useToast();

  const load = () => {
    setLoading(true);
    mockApiApi
      .list()
      .then(setApis)
      .catch((err) => notify(extractErrorMessage(err), "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreateOrUpdate = async (payload: CreateMockAPIPayload | UpdateMockAPIPayload) => {
    try {
      if (editing) {
        await mockApiApi.update(editing.id, payload as UpdateMockAPIPayload);
        notify("Mock API updated", "success");
      } else {
        await mockApiApi.create(payload as CreateMockAPIPayload);
        notify("Mock API created", "success");
      }
      load();
    } catch (err) {
      notify(extractErrorMessage(err), "error");
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await mockApiApi.remove(deleting.id);
      notify("Mock API deleted", "success");
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: fontHeading, mb: 0.5 }}>
            Mock APIs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Define endpoints and their versions, schemas, and response scenarios.
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
          New Mock API
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}

      {!loading && apis.length === 0 ? (
        <EmptyState
          icon={<RouteRoundedIcon />}
          title="No mock APIs yet"
          description="Create your first mock endpoint to start simulating responses."
          action={
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setFormOpen(true)}>
              New Mock API
            </Button>
          }
        />
      ) : (
        <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Method</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Path</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Auth</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apis.map((api) => (
                <TableRow
                  key={api.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate(`/mock-apis/${api.id}`)}
                >
                  <TableCell>
                    <MethodBadge method={api.method} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{api.name}</TableCell>
                  <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem", color: "text.secondary" }}>
                    /mock{api.path}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ActiveDot active={api.is_active} />
                      <Typography variant="body2" color="text.secondary">
                        {api.is_active ? "Active" : "Inactive"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {api.requires_auth && (
                      <Tooltip title="Requires Bearer token">
                        <LockRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditing(api);
                          setFormOpen(true);
                        }}
                      >
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {isAdmin && (
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => setDeleting(api)}>
                          <DeleteOutlineRoundedIcon fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <MockApiFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initial={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete this Mock API?"
        description={`"${deleting?.name}" and all of its versions, schemas, and scenarios will be permanently removed. This requires admin access.`}
        confirmLabel="Delete"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </Box>
  );
}

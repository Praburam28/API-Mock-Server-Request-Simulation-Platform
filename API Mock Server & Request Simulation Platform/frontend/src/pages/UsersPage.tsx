import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Pagination,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import { userApi } from "../api/misc";
import type { UserCreatePayload, UserResponse, UserUpdatePayload } from "../types";
import { EmptyState } from "../components/Common";
import UserFormDialog from "../components/UserFormDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { extractErrorMessage } from "../api/client";
import { fontHeading } from "../theme/tokens";

const ROLE_LABELS: Record<number, string> = { 1: "Admin", 2: "User" };

export default function UsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<UserResponse | null>(null);
  const [deleting, setDeleting] = useState<UserResponse | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { user: currentUser } = useAuth();
  const { notify } = useToast();
  const pageSize = 20;

  const load = () => {
    setLoading(true);
    userApi
      .list({ page, page_size: pageSize, search: search || undefined })
      .then((res) => {
        setUsers(res.items);
        setTotal(res.total);
        setTotalPages(res.total_pages);
      })
      .catch((err) => notify(extractErrorMessage(err), "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, search]);

  const handleSubmit = async (payload: UserCreatePayload | UserUpdatePayload, roleId?: number) => {
    try {
      if (editing) {
        await userApi.update(editing.id, payload as UserUpdatePayload);
        if (roleId !== undefined) {
          await userApi.changeRole(editing.id, roleId);
        }
        notify("User updated", "success");
      } else {
        await userApi.create(payload as UserCreatePayload);
        notify("User created", "success");
      }
      load();
    } catch (err) {
      notify(extractErrorMessage(err), "error");
      throw err;
    }
  };

  const handleToggleActive = async (u: UserResponse) => {
    try {
      const updated = u.is_active ? await userApi.deactivate(u.id) : await userApi.activate(u.id);
      setUsers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      notify(updated.is_active ? "User activated" : "User deactivated", "success");
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await userApi.remove(deleting.id);
      notify("User deleted", "success");
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: fontHeading, mb: 0.5 }}>
            Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {total.toLocaleString()} accounts · admin access required
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
          New User
        </Button>
      </Box>

      <TextField
        size="small"
        placeholder="Search by name or email…"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        sx={{ mb: 2.5, minWidth: 280 }}
      />

      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}

      {!loading && users.length === 0 ? (
        <EmptyState icon={<GroupRoundedIcon />} title="No users found" description="Try a different search." />
      ) : (
        <>
          <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {u.first_name} {u.last_name}
                      {u.id === currentUser?.id && (
                        <Chip label="You" size="small" sx={{ ml: 1 }} variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{u.email}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={ROLE_LABELS[u.role_id] ?? `Role ${u.role_id}`}
                        color={u.role_id === 1 ? "secondary" : "default"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Switch
                          size="small"
                          checked={u.is_active}
                          disabled={u.id === currentUser?.id}
                          onChange={() => handleToggleActive(u)}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {u.is_active ? "Active" : "Inactive"}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditing(u);
                            setFormOpen(true);
                          }}
                        >
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <span>
                          <IconButton
                            size="small"
                            disabled={u.id === currentUser?.id}
                            onClick={() => setDeleting(u)}
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" color="error" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
            </Box>
          )}
        </>
      )}

      <UserFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initial={editing} />

      <ConfirmDialog
        open={!!deleting}
        title="Delete this user?"
        description={`${deleting?.first_name} ${deleting?.last_name} will lose access immediately.`}
        confirmLabel="Delete"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </Box>
  );
}

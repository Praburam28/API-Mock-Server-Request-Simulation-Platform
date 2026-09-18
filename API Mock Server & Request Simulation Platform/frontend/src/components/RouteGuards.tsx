import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";

function FullscreenLoader() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}

export function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullscreenLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function RequireAdmin() {
  const { isAdmin, loading } = useAuth();
  if (loading) return <FullscreenLoader />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}

export function RedirectIfAuthed() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullscreenLoader />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
}

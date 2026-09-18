import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { RequireAuth, RequireAdmin, RedirectIfAuthed } from "./components/RouteGuards";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MockApiListPage from "./pages/MockApiListPage";
import MockApiDetailPage from "./pages/MockApiDetailPage";
import RequestLogsPage from "./pages/RequestLogsPage";
import UsersPage from "./pages/UsersPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<RedirectIfAuthed />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/mock-apis" element={<MockApiListPage />} />
          <Route path="/mock-apis/:id" element={<MockApiDetailPage />} />
          <Route path="/request-logs" element={<RequestLogsPage />} />
          <Route element={<RequireAdmin />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

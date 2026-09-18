import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import { dashboardApi } from "../api/misc";
import type { DashboardResponse } from "../types";
import { StatCard, EmptyState } from "../components/Common";
import { MethodBadge } from "../components/Badges";
import { useToast } from "../context/ToastContext";
import { extractErrorMessage } from "../api/client";
import { fontHeading, fontMono } from "../theme/tokens";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { notify } = useToast();

  useEffect(() => {
    let active = true;
    dashboardApi
      .get()
      .then((res) => active && setData(res))
      .catch((err) => notify(extractErrorMessage(err), "error"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errorRate =
    data && data.total_requests > 0
      ? Math.round((data.error_requests / data.total_requests) * 1000) / 10
      : 0;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontFamily: fontHeading, mb: 0.5 }}>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        A snapshot of your mock APIs and traffic.
      </Typography>

      {loading && <LinearProgress sx={{ mb: 3, borderRadius: 2 }} />}

      {data && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard label="Total Mock APIs" value={data.total_mock_apis} icon={<RouteRoundedIcon />} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Active APIs"
                value={data.active_mock_apis}
                icon={<BoltRoundedIcon />}
                accent="linear-gradient(90deg, #5FD48C, #4FB8E8)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Total Requests"
                value={data.total_requests.toLocaleString()}
                icon={<SpeedRoundedIcon />}
                accent="linear-gradient(90deg, #4FB8E8, #8E7CF0)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Error Requests"
                value={`${data.error_requests.toLocaleString()} (${errorRate}%)`}
                icon={<ErrorOutlineRoundedIcon />}
                accent="linear-gradient(90deg, #F0687A, #F2A93B)"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Average Response Time
                  </Typography>
                  <Typography variant="h3" sx={{ fontFamily: fontHeading, mt: 1 }}>
                    {data.average_response_time_ms.toFixed(0)}
                    <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 0.75 }}>
                      ms
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Across all mock endpoint executions.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={7}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                    Most Used Endpoints
                  </Typography>
                  {data.most_used_endpoints.length === 0 ? (
                    <EmptyState title="No traffic yet" description="Call a mock endpoint to see it here." />
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Method</TableCell>
                            <TableCell>Path</TableCell>
                            <TableCell align="right">Requests</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.most_used_endpoints.map((ep, idx) => (
                            <TableRow key={idx}>
                              <TableCell>
                                <MethodBadge method={ep.method} />
                              </TableCell>
                              <TableCell sx={{ fontFamily: fontMono, fontSize: "0.82rem" }}>
                                {ep.path}
                              </TableCell>
                              <TableCell align="right" sx={{ fontFamily: fontMono }}>
                                {ep.request_count.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}

import AnalyticEcommerce from "@/components/adminCom/AnalyticEcommerce";
import MainCard from "@/components/adminCom/MainCard";
import UniqueVisitorCard from "@/components/adminCom/UniqueVisitorCard";
import { Avatar, AvatarGroup, Box, Button, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import WeeklyEventsChart from "@/components/adminCom/WeeklyEventsChart";
import BloodDonationTable from "@/components/adminCom/BloodDonationTable ";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchBloodStock, fetchNumberOfDonationsThunk, fetchNumberOfRequestsThunk, fetchNumberOfUsersThunk } from "@/redux/slices/dashboardSlice";
  

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch type
  const { bloodStockSummary, numberOfUsers, numberOfRequests, numberOfDonations, loading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  // Fetch all the data (blood stock, users, requests, donations)
  useEffect(() => {
    dispatch(fetchBloodStock()); // Dispatch blood stock async action
    dispatch(fetchNumberOfUsersThunk()); // Dispatch number of users async action
    dispatch(fetchNumberOfRequestsThunk()); // Dispatch number of requests async action
    dispatch(fetchNumberOfDonationsThunk()); // Dispatch number of donations async action
  }, [dispatch]);

  // Check loading state
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Calculate total blood volume (in liters)
  const totalVolume = Object.values(bloodStockSummary).reduce(
    (sum, bloodComponent: { total_volume: number }) => sum + bloodComponent.total_volume, // Type the bloodComponent
    0
  );

  const totalVolumeInLiters = totalVolume / 1000;

	return <>
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="Lượng máu trong kho" count={`${totalVolume} lít`} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="Số lượng người dùng" count={`${numberOfUsers}`}  />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="Tổng đơn đăng kí hiến" count={`${numberOfDonations}`} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="Tổng đơn đăng kí nhận" count={`${numberOfRequests}`}  />
      </Grid>
      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
      {/* row 2 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <UniqueVisitorCard />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">Tuần này</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack sx={{ gap: 2 }}>
              <Typography variant="h6" color="text.secondary">
                Số người đăng kí nhận máu tuần này 
              </Typography>
              <Typography variant="h3">Tổng 100</Typography>
            </Stack>
          </Box>
          <WeeklyEventsChart data={[80, 95, 70, 42, 65, 55, 78]} />
        </MainCard>
      </Grid>
      {/* row 3 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">Đơn gần đây</Typography>
          </Grid>
          <Grid />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <BloodDonationTable />
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">Tuần này</Typography>
          </Grid>
          <Grid />
        </Grid>
        
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack sx={{ gap: 2 }}>
              <Typography variant="h6" color="text.secondary">
                Số người đăng kí hiến máu tuần này 
              </Typography>
              <Typography variant="h3">Tổng 200</Typography>
            </Stack>
          </Box>
          <WeeklyEventsChart data={[35, 53, 34, 35, 12, 70, 98]} />
        </MainCard>
      </Grid>
      
    </Grid>
    </>;
}
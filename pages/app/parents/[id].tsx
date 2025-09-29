import React, { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import apiRequest from "../../../src/utils/axios";
import PageContainer from "../../../src/components/container/PageContainer";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import endPoints from "../../../src/constant/apiEndpoint";
import { useRouter } from "next/router";
import { LockOpen, Lock } from "@mui/icons-material";
import { initialSupervisorData, SupervisorType } from "../../../src/types/Supervisors";
import toast from "react-hot-toast";

const FbDefaultForm = ({ query }: { query: string }) => {  // Correctly type the query prop
  const [isLoader, setIsloader] = useState(false);
  const [state, setState] = useState<SupervisorType>(initialSupervisorData);
  const [mounted, setMounted] = useState(false);

  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Supervisor",
    },
  ];

  const router = useRouter();

  const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (mounted && !token) router.push('/'); }, [mounted, token, router]);

  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined as any;

  const fetchStudentDetails = () => {
    console.log("query ==> " + query); // This should log the student ID

    setIsloader(true);
    apiRequest
      .get(endPoints.SUPERVISORS_BY_ID + query, config)  // Use the supervisor ID for the request
      .then((response) => {
        const data = response?.data?.data ?? response?.data ?? initialSupervisorData;
        setState(data);
        setIsloader(false);
      })
      .catch((error) => {
        setIsloader(false);
      });
  };

  const toggleBlockUser = async () => {
    if (!state?.auth?._id) return;
    setIsloader(true);
    const endpoint = state?.auth?.isBlocked ? endPoints.UNBLOCK_USER : endPoints.BLOCK_USER;
    try {
      await apiRequest.put(endpoint, { id: state.auth._id }, config);
      setState((prevState: any) => ({
        ...prevState,
        auth: { ...prevState.auth, isBlocked: !prevState.auth.isBlocked },
      }));
      toast.success(state?.auth?.isBlocked ? 'User unblocked' : 'User blocked');
    } catch {
      toast.error('Action failed');
    } finally {
      setIsloader(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    if (!token) return;
    if (query) {  // Ensure query is defined before making the request
      fetchStudentDetails();
    }
  }, [mounted, token, query]);

  if (!mounted) return null;

  return (
    <PageContainer>
      <Breadcrumb title="Supervisor Details" items={BCrumb} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              avatar={<Avatar sx={{ width: 100, height: 100 }} src={state.auth?.image} alt={state.auth?.fullName} />}
              title={state.auth?.fullName}
              subheader={state.auth?.userName}
              action={
                <IconButton sx={{ fontSize: '2rem' }} onClick={toggleBlockUser} color={state.auth?.isBlocked ? 'error' : 'secondary'}>
                  {state.auth?.isBlocked ? <Lock /> : <LockOpen />}
                </IconButton>
              }
              sx={{
                '& .MuiCardHeader-title': { fontSize: '1.5rem', marginBottom: '0.4rem' }, // Customize title font size
                '& .MuiCardHeader-subheader': { fontSize: '0.8rem' }, // Customize subheader font size
              }}
            />
            <CardContent>
              <Typography variant="body1" sx={{ fontSize: '1rem', mb: 1 }}><strong>Email:</strong> {state.auth?.email}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{
                mb: 2, fontSize: '1.1rem'
              }}>Employees ({state?.employeeIds?.length ?? 0})</Typography>
              {state?.employeeIds?.map((employee: any, idx: number) => {
                const auth = employee?.auth;
                return (
                  <Grid container spacing={2} mb={2} key={employee?._id || auth?._id || idx} alignItems="center">
                    <Grid item>
                      <Avatar sx={{ width: 50, height: 50 }} src={auth?.image} alt={auth?.fullName} />
                    </Grid>
                    <Grid item xs>
                      <Typography sx={{ fontSize: '1rem' }} variant="body1">{auth?.fullName || 'N/A'}</Typography>
                    </Grid>
                  </Grid>
                );
              })}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default FbDefaultForm;

export async function getServerSideProps(context: any) {
  const query = context.query.id; // Extract the student ID from the URL
  return {
    props: {
      query,  // Pass the student ID to the props
    },
  };
}
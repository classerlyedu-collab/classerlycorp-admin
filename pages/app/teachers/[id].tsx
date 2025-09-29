import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Backdrop,
  Divider,
  CardHeader,
  IconButton,
} from "@mui/material";
import { CheckBox, Block, LockOpen, Lock } from "@mui/icons-material";
import apiRequest from "../../../src/utils/axios";
import PageContainer from "../../../src/components/container/PageContainer";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import endPoints from "../../../src/constant/apiEndpoint";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const FbDefaultForm = ({ query }: { query: string }) => {
  const [isLoader, setIsLoader] = useState(false);
  const [state, setState] = useState<any>({});
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const BCrumb = [
    { to: "/", title: "Home" },
    { title: "HR-Admin" },
  ];

  const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Redirect only on client after mount
    if (mounted && !token) {
      router.push("/");
    }
  }, [mounted, token, router]);

  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined as any;

  const fetchStudentDetails = () => {
    setIsLoader(true);
    apiRequest
      .get(endPoints.HR_ADMIN_BY_ID + query, config)
      .then((response) => {
        // Backend typically returns { success, data }. Fallback to raw in case it already is the object
        setState(response?.data?.data ?? response?.data ?? {});
        setIsLoader(false);
      })
      .catch(() => setIsLoader(false));
  };

  const toggleBlockUser = async () => {
    if (!state?.auth?._id) return;
    setIsLoader(true);
    const endpoint = state?.auth?.isBlocked ? endPoints.UNBLOCK_USER : endPoints.BLOCK_USER;
    try {
      await apiRequest.put(endpoint, { id: state.auth._id }, config);
      setState((prevState: any) => ({
        ...prevState,
        auth: { ...prevState.auth, isBlocked: !prevState.auth.isBlocked },
      }));
      toast.success(state?.auth?.isBlocked ? "User unblocked" : "User blocked");
    } catch (e) {
      toast.error("Action failed");
    } finally {
      setIsLoader(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    if (!token) return;
    if (query) {
      fetchStudentDetails();
    }
  }, [mounted, token, query]);

  if (isLoader) {
    return (
      <Backdrop open={isLoader} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!mounted) {
    return null;
  }

  return (
    <PageContainer>
      <Breadcrumb title="HR-Admin Details" items={BCrumb} />
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
              }}>Subjects ({state?.subjects?.length ?? 0})</Typography>
              {state?.subjects?.map((subject: any) => (
                <Grid container spacing={2} mb={2} key={subject._id} alignItems="center">
                  <Grid item>
                    <Avatar sx={{ width: 50, height: 50 }} src={subject.image} alt={subject.name} />
                  </Grid>
                  <Grid item xs>
                    <Typography sx={{ fontSize: '1rem' }} variant="body1">{subject.name}</Typography>
                  </Grid>
                </Grid>
              ))}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{
                mb: 2, fontSize: '1.1rem'
              }}>Employees ({state?.employees?.length ?? 0})</Typography>
              {state?.employees?.map((employee: any) => (
                <Grid container spacing={2} mb={2} key={employee._id} alignItems="center">
                  <Grid item>
                    <Avatar sx={{ width: 50, height: 50 }} src={employee.auth?.image} alt={employee.auth?.fullName} />
                  </Grid>
                  <Grid item xs>
                    <Typography sx={{ fontSize: '1rem' }} variant="body1">{employee.auth?.fullName}</Typography>
                  </Grid>
                </Grid>
              ))}

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default FbDefaultForm;

export async function getServerSideProps(context: any) {
  const query = context.query.id;
  return {
    props: {
      query,
    },
  };
}
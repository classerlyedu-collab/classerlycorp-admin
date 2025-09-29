import React, { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import apiRequest from "../../../src/utils/axios";
import PageContainer from "../../../src/components/container/PageContainer";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import CustomTextField from "../../../src/components/forms/theme-elements/CustomTextField";
import CustomCheckbox from "../../../src/components/forms/theme-elements/CustomCheckbox";
import CustomFormLabel from "../../../src/components/forms/theme-elements/CustomFormLabel";
import endPoints from "../../../src/constant/apiEndpoint";
import { initialStudentData, Students } from "../../../src/types/employees";
import { useRouter } from "next/router";
import { LockOpen, Lock } from "@mui/icons-material";
import toast from "react-hot-toast";

const FbDefaultForm = ({ query }: { query: string }) => {  // Correctly type the query prop
  const [isLoader, setIsloader] = useState(false);
  const [state, setState] = useState<Students>(initialStudentData);
  const [mounted, setMounted] = useState(false);

  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Employee",
    },
  ];

  const router = useRouter();

  const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push('/');
    }
  }, [mounted, token, router]);

  const config = token ? {
    headers: { Authorization: `Bearer ${token}` }
  } : undefined as any;

  const fetchStudentDetails = () => {
    console.log("query ==> " + query); // This should log the student ID

    setIsloader(true);
    apiRequest
      .get(endPoints.EMPLOYEES_BY_ID + query, config)  // Use the employee ID for the request
      .then((response) => {
        const data = response?.data?.data ?? response?.data ?? initialStudentData;
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
    } catch (e) {
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
      <Breadcrumb title="Employee Details" items={BCrumb} />
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
              <Typography variant="body1" sx={{ fontSize: '1rem', mb: 1 }}><strong>Code:</strong> {state.code || 'N/A'}</Typography>
              <Typography variant="body1" sx={{ fontSize: '1rem', mb: 1 }}><strong>Joined:</strong> {state.createdAt ? new Date(state.createdAt).toLocaleString() : 'N/A'}</Typography>
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
              {/* <Divider sx={{ my: 2 }} /> */}
              {/* <Typography variant="h6" sx={{
                mb: 2, fontSize: '1.1rem'
              }}>Teachers ({state?.students?.length ?? 0})</Typography>
              {state?.students?.map((student: any) => (
                <Grid container spacing={2} mb={2} key={student._id} alignItems="center">
                  <Grid item>
                    <Avatar sx={{ width: 50, height: 50 }} src={student.auth.image} alt={student.auth.fullName} />
                  </Grid>
                  <Grid item xs>
                    <Typography sx={{ fontSize: '1rem' }} variant="body1">{student.auth.fullName}</Typography>
                  </Grid>
                </Grid>
              ))} */}

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
import React, { useEffect, useState } from "react";
import { Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from "@mui/material";
import PageContainer from "../../../src/components/container/PageContainer";

import TopCards from "../../../src/components/dashboards/modern/TopCards";
import RevenueUpdates from "../../../src/components/dashboards/modern/RevenueUpdates";
import YearlyBreakup from "../../../src/components/dashboards/modern/YearlyBreakup";
import MonthlyEarnings from "../../../src/components/dashboards/modern/MonthlyEarnings";
import EmployeeSalary from "../../../src/components/dashboards/modern/EmployeeSalary";
import Projects from "../../../src/components/dashboards/modern/Projects";
import Social from "../../../src/components/dashboards/modern/Social";
import SellingProducts from "../../../src/components/dashboards/modern/SellingProducts";
import WeeklyStats from "../../../src/components/dashboards/modern/WeeklyStats";
import TopPerformers from "../../../src/components/dashboards/modern/TopPerformers";
import Welcome from "../../../src/layouts/full/shared/welcome/Welcome";
import apiRequest from "../../../src/utils/axios";
import endPoints from "../../../src/constant/apiEndpoint";
import { useRouter } from "next/router";
import ActiveUsers from "../../../src/components/dashboards/modern/ActiveUsers";
import StripeUsers from "../../../src/components/dashboards/modern/StripeUsers";

const Modern = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const [isLoader, setIsloader] = React.useState(false);
  const [analytics, setAnalytics] = useState({
    totalLessons: '-',
    totalParents: '-',
    totalQuizzes: '-',
    totalStudents: '-',
    totalSubjects: '-',
    totalTeachers: '-',
    totalTopics: '-'
  });

  const [quizStats, setQuizStats] = useState({
    totalQuizzes: 0,
    passCount: 0,
    failCount: 0,
    passPercentage: '0',
    failPercentage: '0',
    averageScore: '0'
  });
  const lastQuizStatsKeyRef = React.useRef<string>('');

  const [activeUsers, setActiveUsers] = useState([]);
  const [stripeUsers, setStripeUsers] = useState([]);

  const fetchQuizStats = (subjectId?: string) => {
    // Track last requested key to avoid race conditions (overall vs subject)
    const requestKey = subjectId ? `subject:${subjectId}` : 'overall';
    lastQuizStatsKeyRef.current = requestKey;
    setIsloader(true);

    const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
    if (!token) {
      router.push('/');
      setIsloader(false);
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    let url = endPoints.QUIZ_STATS;
    if (subjectId) {
      url = `${endPoints.QUIZ_STATS}/${subjectId}`;
    }

    apiRequest
      .get(url, config)
      .then((response: any) => {
        if (lastQuizStatsKeyRef.current !== requestKey) return; // stale response
        if (response && response.data) {
          const payload = response.data?.data || response.data;
          setQuizStats(payload);
        }
        setIsloader(false);
      })
      .catch((error: any) => {
        console.log("fetchQuizStats ==> " + error);
        setIsloader(false);
      });
  };

  const fetchAnalytics = () => {
    setIsloader(true);

    const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
    if (!token) {
      router.push('/');
      setIsloader(false);
      return; // Exit if no token is available
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    apiRequest
      .get(endPoints.DASHBOARD_ANALYTICS, config)
      .then((response: any) => {
        if (response && response.data) {
          setAnalytics(response.data);
        }
        setIsloader(false);
      })
      .catch((error: any) => {
        console.log("fetchAnalytics error ==> ", error);
        setIsloader(false);
      });
  };

  const fetchUserData = async () => {
    setIsloader(true);

    const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
    if (!token) {
      router.push('/');
      setIsloader(false);
      return; // Exit if no token is available
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    apiRequest
      .get(endPoints.GET_ACTIVE_USERS, config)
      .then((response: any) => {
        if (response && response.data) {
          setActiveUsers(response.data);
        }
        setIsloader(false);
      })
      .catch((error: any) => {
        console.log("fetchUserData error ==> ", error);
        setIsloader(false);
      });
  };




  useEffect(() => {
    // fetchStripeData();
    fetchAnalytics();
    fetchUserData();
    fetchQuizStats();
  }, []);

  return (
    <PageContainer>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box>
        <Grid container spacing={3}>
          {/* column */}
          <Grid item xs={12} lg={12}>
            <TopCards analytics={analytics} />
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={8}>
            <RevenueUpdates />
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} lg={12}>
                <YearlyBreakup quizStats={quizStats} onRefetch={fetchQuizStats} />
              </Grid>
              <Grid item xs={12} sm={6} lg={12}>
                {/* <MonthlyEarnings /> */}
              </Grid>
            </Grid>
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={18}>
            {/* <ActiveUsers/> */}

          </Grid>
          {/* column */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>


              </Grid>
              <Grid item xs={12} sm={6}>
                {/* <Projects /> */}
              </Grid>
              <Grid item xs={12}>
                {/* <Social /> */}
              </Grid>
            </Grid>
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={4}>
            {/* <SellingProducts /> */}
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={4}>
            {/* <WeeklyStats /> */}
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={8}>
            {/* <TopPerformers /> */}
          </Grid>
        </Grid>
        {/* column */}
        <Welcome />
      </Box>
    </PageContainer>
  );
};

export default Modern;

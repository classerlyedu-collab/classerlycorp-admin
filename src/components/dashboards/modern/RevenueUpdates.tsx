import React from 'react';
import dynamic from "next/dynamic";
import moment from "moment";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import DashboardCard from '../../shared/DashboardCard';
import apiRequest from '../../../utils/axios';
import endPoints from '../../../constant/apiEndpoint';

const RevenueUpdates = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const success = theme.palette.success.main;
  // Build last 12 months labels and keys
  const monthsBack = 12;
  const labels = React.useMemo(() => {
    const now = moment().startOf('month');
    const arr: string[] = [];
    for (let i = monthsBack - 1; i >= 0; i--) {
      arr.push(moment(now).subtract(i, 'months').format('MMM YYYY'));
    }
    return arr;
  }, []);

  const monthKeys = React.useMemo(() => {
    const now = moment().startOf('month');
    const arr: string[] = [];
    for (let i = monthsBack - 1; i >= 0; i--) {
      arr.push(moment(now).subtract(i, 'months').format('YYYY-MM'));
    }
    return arr;
  }, []);

  const [series, setSeries] = React.useState(
    [
      { name: 'HR-Admins', data: Array(monthsBack).fill(0) },
      { name: 'Employees', data: Array(monthsBack).fill(0) },
      { name: 'Supervisors', data: Array(monthsBack).fill(0) },
    ] as { name: string; data: number[] }[]
  );

  const extractCreatedAt = (item: any): string | undefined => {
    return item?.createdAt || item?.auth?.createdAt || item?.updatedAt || undefined;
  };

  const bucketByMonth = (items: any[], keys: string[]): number[] => {
    const counts: Record<string, number> = Object.fromEntries(keys.map((k) => [k, 0]));
    for (const it of items) {
      const created = extractCreatedAt(it);
      if (!created) continue;
      const key = moment(created).startOf('month').format('YYYY-MM');
      if (counts[key] !== undefined) counts[key] += 1;
    }
    return keys.map((k) => counts[k] || 0);
  };

  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? window.localStorage?.getItem('authToken') : null;
    if (!token) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchAll = async () => {
      try {
        const [hrRes, empRes, supRes] = await Promise.all([
          apiRequest.get(endPoints.HR_ADMINS, config),
          apiRequest.get(endPoints.EMPLOYEES, config),
          apiRequest.get(endPoints.SUPERVISORS, config),
        ]);

        const hrAdmins = Array.isArray(hrRes?.data) ? hrRes.data : hrRes?.data?.data || [];
        const employees = Array.isArray(empRes?.data) ? empRes.data : empRes?.data?.data || [];
        const supervisors = Array.isArray(supRes?.data) ? supRes.data : supRes?.data?.data || [];

        const toNums = (arr: number[]) => arr.map((v) => (Number.isFinite(v) ? Number(v) : 0));
        const hrAdminSeries = toNums(bucketByMonth(hrAdmins, monthKeys));
        const employeeSeries = toNums(bucketByMonth(employees, monthKeys));
        const supervisorSeries = toNums(bucketByMonth(supervisors, monthKeys));

        setSeries([
          { name: 'HR-Admins', data: hrAdminSeries },
          { name: 'Employees', data: employeeSeries },
          { name: 'Supervisors', data: supervisorSeries },
        ]);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Overview fetch error:', e);
      }
    };

    fetchAll();
  }, [monthKeys]);

  // chart options for the area chart
  const options = {
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        enabled: false,
      },
    },
    colors: [primary, secondary, success],
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#8e8da4',
        },
        offsetX: 0,
        formatter: function (val: any) {
          const n = Number(val);
          return Number.isFinite(n) ? `${n}` : '0';
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    xaxis: {
      type: 'category',
      categories: labels,
      labels: {
        rotate: -10,
        rotateAlways: true,
      },
    },
    title: {
      text: 'Overview',
      align: 'left',
      offsetX: 14,
    },
    tooltip: {
      shared: true,
    },
    legend: {
      position: 'top',
      offsetX: -10,
    },
  };

  return (
    <DashboardCard title="Overview">
      <Grid container spacing={3}>
        {/* area chart */}
        <Grid item xs={12}>
          <Chart
            options={options as any}
            series={series as any}
            type="area"
            height={350}
            width={"100%"}
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default RevenueUpdates;

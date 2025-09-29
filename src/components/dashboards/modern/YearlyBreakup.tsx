import dynamic from "next/dynamic";
import { Box, Grid, Typography, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, IconButton, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import apiRequest from "../../../utils/axios";
import endPoints from "../../../constant/apiEndpoint";
import { IconFilter } from "@tabler/icons-react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface QuizStats {
  totalQuizzes: number;
  passCount: number;
  failCount: number;
  passPercentage: string;
  failPercentage: string;
  averageScore: string;
}

interface YearlyBreakupProps {
  quizStats: QuizStats;
  onRefetch: (subjectId?: string) => void;
}

interface Subject {
  _id: string;
  name: string;
  image: string;
  topics: string[];
}

const YearlyBreakup = ({ quizStats, onRefetch }: YearlyBreakupProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [initialFetched, setInitialFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await apiRequest.get(endPoints.SUBJECTS, config);
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openDialog) {
      fetchSubjects();
    }
  }, [openDialog]);

  // On first mount, fetch overall stats once
  useEffect(() => {
    if (!initialFetched) {
      onRefetch(undefined);
      setInitialFetched(true);
    }
  }, [initialFetched, onRefetch]);

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    const subjectId = (subject as any)?._id || (subject as any)?.id || (subject as any)?.subjectId;
    if (subjectId) {
      onRefetch(subjectId as any);
    }
    setOpenDialog(false);
  };

  // Helpers to ensure valid numeric percentages for charts
  const clamp01 = (n: number) => (Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0);
  const parsePercent = (value?: string | number) => {
    if (typeof value === 'number') return clamp01(value);
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^0-9.\-]/g, '');
      const num = parseFloat(cleaned);
      return clamp01(num);
    }
    return 0;
  };
  const computeFromCounts = (count?: number, total?: number) => {
    if (!total || !Number.isFinite(total) || total <= 0) return 0;
    const c = Number(count) || 0;
    return clamp01((c / total) * 100);
  };

  const passValue = (() => {
    const parsed = parsePercent((quizStats as any)?.passPercentage);
    if (parsed > 0) return parsed;
    return computeFromCounts((quizStats as any)?.passCount, (quizStats as any)?.totalQuizzes);
  })();

  const failValue = (() => {
    const parsed = parsePercent((quizStats as any)?.failPercentage);
    if (parsed > 0) return parsed;
    return computeFromCounts((quizStats as any)?.failCount, (quizStats as any)?.totalQuizzes);
  })();

  const chartOptions = {
    chart: {
      height: 200,
      type: 'radialBar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: '#f2f2f2',
          strokeWidth: '40%',
          margin: 0,
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '13px',
          },
          value: {
            formatter: function (val: number) {
              return `${val}%`;
            },
            color: '#111',
            fontSize: '20px',
            show: true,
            offsetY: 5,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#ABE5A1'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: [''],
  };

  const passOptions = {
    ...chartOptions,
    colors: ['#4CAF50'],
    fill: {
      ...chartOptions.fill,
      gradient: {
        ...chartOptions.fill.gradient,
        gradientToColors: ['#4CAF50'],
      },
    },
  };

  const failOptions = {
    ...chartOptions,
    colors: ['#F44336'],
    fill: {
      ...chartOptions.fill,
      gradient: {
        ...chartOptions.fill.gradient,
        gradientToColors: ['#F44336'],
      },
    },
  };

  return (
    <Box sx={{
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      p: 2,
      height: '100%'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            Quiz Performance
          </Typography>
          {selectedSubject && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 0.5,
              backgroundColor: '#e8eaf6',
              borderRadius: '4px',
              px: 1.5,
              py: 0.5,
              width: 'fit-content'
            }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#3949ab',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>Subject:</span>
                {selectedSubject.name}
              </Typography>
            </Box>
          )}
        </Box>
        <IconButton
          onClick={() => setOpenDialog(true)}
          sx={{
            backgroundColor: '#f5f5f5',
            '&:hover': { backgroundColor: '#e0e0e0' }
          }}
        >
          <IconFilter size={20} />
        </IconButton>
      </Box>

      <>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#4CAF50' }}>
                Pass Rate
              </Typography>
              <Chart
                options={passOptions as any}
                series={[passValue]}
                type="radialBar"
                height={200}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#F44336' }}>
                Fail Rate
              </Typography>
              <Chart
                options={failOptions as any}
                series={[failValue]}
                type="radialBar"
                height={200}
              />
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Total Quizzes: {quizStats.totalQuizzes}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Average Score: {(quizStats as any)?.averageScore || 0}
          </Typography>
        </Box>
      </>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Select Subject
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <IconFilter size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Subjects</Typography>
              <List>
                {subjects.map((subject) => (
                  <ListItem
                    key={subject._id}
                    component="div"
                    sx={{
                      cursor: 'pointer',
                      bgcolor: selectedSubject?._id === subject._id ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' }
                    }}
                    onClick={() => handleSubjectClick(subject)}
                  >
                    <ListItemText primary={subject.name} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default YearlyBreakup;

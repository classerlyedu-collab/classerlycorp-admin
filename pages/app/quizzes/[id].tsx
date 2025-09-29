import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import apiRequest from "../../../src/utils/axios";
import PageContainer from "../../../src/components/container/PageContainer";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import endPoints from "../../../src/constant/apiEndpoint";
import { useRouter } from "next/router";
import { initialQuizData, QuizType } from "../../../src/types/Quiz";

const QuizDetails = ({ query }: { query: string }) => {
  const [isLoader, setIsloader] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<QuizType>(initialQuizData);

  const BCrumb = [
    {
      to: "/",
      title: "Home",
    },
    {
      title: "Quiz Details",
    },
  ];

  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = window.localStorage?.getItem('authToken');
    if (!token) {
      router.replace('/');
    }
    setMounted(true);
  }, [router]);

  const fetchQuizDetails = () => {
    setIsloader(true);
    const localToken = typeof window !== 'undefined' ? window.localStorage?.getItem('authToken') : null;
    const config = localToken ? { headers: { Authorization: `Bearer ${localToken}` } } : undefined as any;
    apiRequest
      .get(endPoints.QUIZ_BY_ID + query, config)
      .then((response: any) => {
        setState(response.data);
        setIsloader(false);
      })
      .catch((error: any) => {
        console.log("fetchQuizDetails Error: ", error);
        setIsloader(false);
      });
  };

  useEffect(() => {
    if (query) {
      fetchQuizDetails();
    }
  }, [query]);

  if (!mounted) {
    return null;
  }

  return (
    <PageContainer>
      <Breadcrumb title="Quiz Details" items={BCrumb} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {/* Lesson Section */}
              <Typography variant="h5" sx={{ fontSize: '1.2rem' }}>Lesson: {state?.lesson?.name ?? 'N/A'}</Typography>
              <Divider sx={{ my: 2 }} />

              {/* Questions Section */}
              <Typography variant="h5" sx={{ fontSize: '1.2rem' }}>Questions</Typography>
              <List dense>
                {Array.isArray(state?.questions) ? state.questions.map((q, index) => (
                  <ListItem key={q._id}>
                    <ListItemText
                      primary={<Typography variant="body1" sx={{ fontSize: '1rem' }}>Q{index + 1}: {q.question}</Typography>}
                      secondary={
                        <>
                          <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>Answer: {q.answer}</Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>Score: {q.score}</Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>Options: {q.options.join(', ')}</Typography>
                        </>
                      }
                    />
                  </ListItem>
                )) : null}
              </List>
              <Divider sx={{ my: 2 }} />

              {/* Created By Section */}
              <Typography variant="h5" sx={{ fontSize: '1.2rem' }}>Created By</Typography>
              <Typography variant="body1" sx={{ fontSize: '1rem' }}>{(state as any)?.createdBy?.auth?.fullName || (state as any)?.createdBy?.fullName || 'N/A'}</Typography>
              <Divider sx={{ my: 2 }} />

              {/* Topic Section */}
              <Typography variant="h5" sx={{ fontSize: '1.2rem' }}>Topic</Typography>
              <Typography variant="body1" sx={{ fontSize: '1rem' }}>Topic Name: {state?.topic?.name ?? 'N/A'}</Typography>
              <Divider sx={{ my: 2 }} />

              {/* Subject Section */}
              <Typography variant="h5" sx={{ fontSize: '1.2rem' }}>Subject</Typography>
              <Typography variant="body1" sx={{ fontSize: '1rem' }}>Subject Name: {state?.subject?.name ?? 'N/A'}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default QuizDetails;

export async function getServerSideProps(context: any) {
  const query = context.query.id;
  return {
    props: {
      query,
    },
  };
}
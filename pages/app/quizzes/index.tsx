import * as React from "react";

import { useTheme } from "@mui/material/styles";
import {
  Typography,
  TableHead,
  Box,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  TableFooter,
  IconButton,
  TableContainer
} from "@mui/material";
import { IconArrowRight } from "@tabler/icons-react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import ParentCard from "../../../src/components/shared/ParentCard";
import BlankCard from "../../../src/components/shared/BlankCard";
import { useRouter } from "next/router";
import endPoints from "../../../src/constant/apiEndpoint";
import apiRequest from "../../../src/utils/axios";
import { QuizType } from "../../../src/types/Quiz";
import TabSearchBar from "../../../src/components/common/TabSearchBar";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: any) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: any) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: any) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: any) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Quizzes",
  },
];

const PaginationTable = () => {
  const [isLoader, setIsloader] = React.useState(false);

  const [quizzess, setQuizzess] = React.useState<QuizType[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = React.useState<QuizType[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);


  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Update filtered quizzes when quizzes change
  React.useEffect(() => {
    setFilteredQuizzes(quizzess);
  }, [quizzess]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 && Array.isArray(filteredQuizzes) ? Math.max(0, (1 + page) * rowsPerPage - filteredQuizzes.length) : 0;

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchQuizzess = () => {
    // Prevent multiple simultaneous requests
    if (isFetching) {
      console.log('Already fetching quizzes, skipping...');
      return;
    }

    setIsFetching(true);
    setIsloader(true);

    const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
    if (!token) {
      router.push('/');
      setIsloader(false);
      setIsFetching(false);
      return; // Exit if no token is available
    };

    const config = {
      headers: { Authorization: `Bearer ${token}` }
      // Removed timeout to prevent premature failures
    };

    const startTime = Date.now();

    apiRequest
      .get(endPoints.QUIZZES, config)
      .then((response) => {
        const endTime = Date.now();
        console.log(`Quizzes fetched in ${endTime - startTime}ms`);

        if (response && response.data) {
          setQuizzess(response.data);
        }
        setIsloader(false);
        setIsFetching(false);
      })
      .catch((error) => {
        const endTime = Date.now();
        console.error(`fetchQuizzes error after ${endTime - startTime}ms:`, error);

        setIsloader(false);
        setIsFetching(false);
      });
  };

  React.useEffect(() => {
    fetchQuizzess();
  }, []); // Empty dependency array to run only once


  return (
    <PageContainer>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* breadcrumb */}
      <Breadcrumb
        title="Quizzes"
        items={BCrumb}
        addBtn="Add Quiz"
        isBtn={true}
        addBtnHREF="/app/quizzes/create"
      />
      {/* end breadcrumb */}
      <ParentCard title="Quizzes">
        {/* Search Bar */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <TabSearchBar
            placeholder="Search quizzes by subject or topic..."
            data={quizzess}
            searchFields={['subject.name', 'topic.name']}
            onResultClick={(result) => router.push(`/app/quizzes/${result.data._id}`)}
            onFilterChange={setFilteredQuizzes}
            maxResults={5}
          />
        </Box>

        <BlankCard>
          <TableContainer>
            <Table
              aria-label="custom pagination table"
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">Subject</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Topic</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Lesson</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Questions</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Created By</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Open</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!Array.isArray(filteredQuizzes) || filteredQuizzes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="textSecondary">
                        {!Array.isArray(filteredQuizzes) ? "Loading..." : "No quizzes found"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (rowsPerPage > 0
                  ? filteredQuizzes
                    .slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredQuizzes.sort((a, b) => (a?.type > b?.type ? -1 : 1))
                ).map((row, index) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {row?.subject?.name || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">
                        {row?.topic?.name ?? 'N/A'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">
                        {row?.lesson?.name ?? 'N/A'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">
                        {Array.isArray(row?.questions) ? row.questions.length : 0}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">
                        {(row as any)?.createdBy?.auth?.fullName || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <IconArrowRight
                          style={{ cursor: "pointer" }}
                          size="21"
                          onClick={() => {
                            router.push("/app/quizzes/" + row._id);
                          }}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={6}
                    count={Array.isArray(filteredQuizzes) ? filteredQuizzes.length : 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </BlankCard>
      </ParentCard>
    </PageContainer>
  );
};

export default PaginationTable;
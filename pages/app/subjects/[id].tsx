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
import { IconArrowRight, IconEdit } from "@tabler/icons-react";
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
import { TopicType } from "../../../src/types/topics";
import AddTopicModal from "../../../src/components/modal/AddTopicModal";
import TabSearchBar from "../../../src/components/common/TabSearchBar";
import toast from "react-hot-toast";

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
    to: "/app/subjects",
    title: "Subjects",
  },
  {
    title: "Topics",
  },
];

const PaginationTable = ({ query }: { query: string }) => {
  const [isLoader, setIsloader] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [subjects, setSubjects] = React.useState<TopicType[]>([]);
  const [filteredSubjects, setFilteredSubjects] = React.useState<TopicType[]>([]);
  const [selectedSubject, setSelectedSubject] = React.useState<TopicType | null>(null);

  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Update filtered subjects when subjects change
  React.useEffect(() => {
    setFilteredSubjects(subjects);
  }, [subjects]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredSubjects.length) : 0;

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchTopics = () => {
    setIsloader(true);

    const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
    if (!token) {
      router.push('/');
      setIsloader(false);
      return; // Exit if no token is available
    };

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    apiRequest
      .get(endPoints.TOPICS + query, config)
      .then((response) => {
        console.log("fetchTopics Response ====>", response);
        setSubjects(response.data);
        setIsloader(false);
      })
      .catch((error) => {
        console.log("fetchTopics ==> " + error);
        setIsloader(false);
      });
  };

  React.useEffect(() => {
    if (query) {
      fetchTopics();
    }
  }, [query, openModal]);

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSubject(null);
  };

  const handleAddTopic = () => {
    setSelectedSubject(null);
    setOpenModal(true);
  };


  const handleEdit = (topicId: string, name: string, difficulty: string, type: string) => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;
    if (!token) {
      toast.error("Unauthorized request. Please login.");
      return;
    }

    apiRequest
      .put(
        endPoints.EDIT_TOPIC,
        { topicId, name, difficulty, type },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("Topic updated successfully.");
        fetchTopics();
      })
      .catch((error) => {
        console.error("Edit Topic Error:", error);
        toast.error("Error updating topic.");
      });
  };

  const handleDelete = (topicId: string) => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;
    if (!token) {
      toast.error("Unauthorized request. Please login.");
      return;
    }

    apiRequest
      .put(endPoints.DELETE_TOPIC, { topicId }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Topic deleted successfully.");
        fetchTopics();
      })
      .catch((error) => {
        console.error("Delete Topic Error:", error);
        toast.error("Error deleting topic.");
      });
  };

  const handleSearchResultClick = (result: any) => {
    // Navigate to the topic's lessons page
    router.push(`/app/subjects/${query}/lessons/${result.data._id}`);
  };

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
        title="Topics"
        items={BCrumb}
        addBtn="Add Topic"
        isBtn={true}
        addBtnClick={handleAddTopic}
        triggerFunction={true}
      />
      {/* end breadcrumb */}
      <ParentCard title="Subjects">
        {/* Search Bar */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <TabSearchBar
            placeholder="Search topics by name..."
            data={subjects}
            searchFields={['name']}
            onResultClick={handleSearchResultClick}
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
                    <Typography variant="h6">Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Difficulty</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Type</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Edit</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Lessons</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="textSecondary">
                        No topics found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (rowsPerPage > 0
                  ? filteredSubjects
                    .slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredSubjects?.sort((a, b) => (a?.name > b?.name ? -1 : 1))
                ).map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="h6"
                        fontWeight="400"
                      >
                        {row?.name}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="h6"
                        fontWeight="400"
                      >
                        {row?.difficulty}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">
                        {row?.type}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box display="flex" gap={2} alignItems="center">
                        <IconEdit
                          style={{ cursor: "pointer" }}
                          size="21"
                          onClick={() => {
                            setSelectedSubject(row);
                            setOpenModal(true);
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={2} alignItems="center">
                        <Typography variant="subtitle2">
                          {row?.lessons?.length}
                        </Typography>
                        <IconArrowRight
                          style={{ cursor: "pointer" }}
                          size="21"
                          onClick={() => {
                            router.push("/app/subjects/" + query + "/lessons/" + row._id);
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
                    count={filteredSubjects.length}
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

      <AddTopicModal open={openModal} handleClose={handleCloseModal} subjectId={query} selectedSubject={selectedSubject} handleDelete={handleDelete} handleEdit={handleEdit} />

    </PageContainer>
  );
};

export default PaginationTable;

export async function getServerSideProps(context: any) {
  const query = context.query.id || ''; // Provide a default empty string if id is not present
  return {
    props: {
      query,
    },
  };
}
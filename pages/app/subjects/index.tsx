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
import { SubjectType } from "../../../src/types/Subjects";
import EditDeleteModal from "../../../src/components/modal/EditSubjectModal";
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
    to: "/",
    title: "Home",
  },
  {
    title: "Subjects",
  },
];

const PaginationTable = () => {
  const [isLoader, setIsloader] = React.useState(false);

  const [subjects, setSubjects] = React.useState<SubjectType[]>([]);
  const [filteredSubjects, setFilteredSubjects] = React.useState<SubjectType[]>([]);

  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedSubject, setSelectedSubject] = React.useState<SubjectType | null>(null);

  // Update filtered subjects when subjects change
  React.useEffect(() => {
    setFilteredSubjects(subjects);
  }, [subjects]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 && Array.isArray(filteredSubjects) ? Math.max(0, (1 + page) * rowsPerPage - filteredSubjects.length) : 0;

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchSubjects = () => {
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
      .get(endPoints.SUBJECTS, config)
      .then((response) => {
        if (response && response.data) {
          const arr = Array.isArray(response.data) ? response.data : response.data?.data;
          setSubjects(Array.isArray(arr) ? arr : []);
        } else {
          setSubjects([]);
        }
        setIsloader(false);
      })
      .catch((error) => {
        console.log("fetchSubjects error ==> ", error);
        setIsloader(false);
      });
  };

  React.useEffect(() => {
    fetchSubjects();
  }, []);

  const handleEdit = (id: any, name: any, image: any, file?: File | null) => {
    // Handle edit request
    const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
    if (!token) return;

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const doRequest = async () => {
      try {
        if (file) {
          const form = new FormData();
          form.append('id', id);
          form.append('name', name);
          form.append('file', file);
          await apiRequest.put(endPoints.EDIT_SUBJECT, form, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
          } as any);
        } else {
          await apiRequest.put(endPoints.EDIT_SUBJECT, { id, name, image }, config);
        }
        toast.success('Subject Saved Successfully!');
        fetchSubjects();
      } catch (e) {
        toast.error('Error Saving Subject!');
      }
    };
    doRequest();
    setSelectedSubject(null);

  };

  const handleDelete = (id: any) => {
    // Handle delete request
    const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
    if (!token) return;

    const config = { headers: { Authorization: `Bearer ${token}` } };

    apiRequest
      .delete(`${endPoints.DELETE_SUBJECT}/${id}`, config)
      .then(() => {
        toast.success('Subject Deleted Successfully!');
        fetchSubjects();
      })
      .catch((error) => {
        toast.error('Error Deleting Subject!');
      });

    setSelectedSubject(null);
  };

  const handleSearchResultClick = (result: any) => {
    // Navigate to the subject's topics page
    router.push(`/app/subjects/${result.data._id}`);
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
        title="Subjects"
        items={BCrumb}
        addBtn="Add Subject"
        isBtn={true}
        addBtnHREF="/app/subjects/create"
      />
      {/* end breadcrumb */}
      <ParentCard title="Subjects">
        {/* Search Bar */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <TabSearchBar
            placeholder="Search subjects by name..."
            data={subjects}
            searchFields={['name', 'createdBy.auth.fullName']}
            onResultClick={handleSearchResultClick}
            onFilterChange={setFilteredSubjects}
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
                    <Typography variant="h6">Created By</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Topics</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Edit</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Open</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!Array.isArray(filteredSubjects) || filteredSubjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="textSecondary">
                        {!Array.isArray(filteredSubjects) ? "Loading..." : "No subjects found"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (rowsPerPage > 0
                  ? filteredSubjects
                    .slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredSubjects.sort((a, b) => (a?.name > b?.name ? -1 : 1))
                ).map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="h6"
                        fontWeight="400"
                      >
                        {row.name}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="h6"
                        fontWeight="400"
                      >
                        {row?.createdBy?.auth?.fullName || '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">
                        {Array.isArray(row?.topics) ? row.topics.length : 0}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <IconEdit
                          style={{ cursor: "pointer" }}
                          size="21"
                          onClick={() => { setSelectedSubject(row); setOpenModal(true); }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <IconArrowRight
                          style={{ cursor: "pointer" }}
                          size="21"
                          onClick={() => {
                            router.push("/app/subjects/" + row._id);
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
                    count={Array.isArray(filteredSubjects) ? filteredSubjects.length : 0}
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

      {/* Edit/Delete Modal */}
      {selectedSubject && (
        <EditDeleteModal
          open={openModal}
          handleClose={() => {
            setOpenModal(false);
            setSelectedSubject(null);
          }}
          subject={selectedSubject}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      )}

    </PageContainer>
  );
};

export default PaginationTable;

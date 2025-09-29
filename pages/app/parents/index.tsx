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
  TableContainer,
} from "@mui/material";
import { IconEdit } from "@tabler/icons-react";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../src/components/container/PageContainer";
import ParentCard from "../../../src/components/shared/ParentCard";
import { Stack } from "@mui/system";
import BlankCard from "../../../src/components/shared/BlankCard";
import { useRouter } from "next/router";
import endPoints from "../../../src/constant/apiEndpoint";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import apiRequest from "../../../src/utils/axios";

import Image from "next/image";
import { ParentType } from "../../../src/types/Parents";
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
    title: "Supervisors",
  },
];

const PaginationTable = () => {
  const [isLoader, setIsloader] = React.useState(false);

  const [parentsData, setParentsData] = React.useState<ParentType[]>([]);
  const [filteredParents, setFilteredParents] = React.useState<ParentType[]>([]);

  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Update filtered parents when parents data changes
  React.useEffect(() => {
    setFilteredParents(parentsData);
  }, [parentsData]);

  // Avoid a layout jump when reaching the last page with empty data.
  const emptyRows =
    page > 0 && Array.isArray(filteredParents) ? Math.max(0, (1 + page) * rowsPerPage - filteredParents.length) : 0;

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchParents = () => {
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
      .get(endPoints.SUPERVISORS, config)
      .then((response) => {
        if (response && response.data) {
          setParentsData(response.data);
        }
        setIsloader(false);
      })
      .catch((error) => {
        console.log("fetchParents error ==> ", error);
        setIsloader(false);
      });
  };

  React.useEffect(() => {
    fetchParents();
  }, []);


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
        title="Supervisors"
        items={BCrumb}
        addBtn="Add Licensee"
      />
      {/* end breadcrumb */}
      <ParentCard title="Supervisors">
        {/* Search Bar */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <TabSearchBar
            placeholder="Search supervisors by name or email..."
            data={parentsData}
            searchFields={['auth.fullName', 'auth.email']}
            onResultClick={(result) => router.push(`/app/parents/${result.data._id}`)}
            onFilterChange={setFilteredParents}
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
                    <Typography variant="h6">ID</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Email</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Status</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Created At</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Details</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!Array.isArray(filteredParents) || filteredParents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="textSecondary">
                        {!Array.isArray(filteredParents) ? "Loading..." : "No supervisors found"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (rowsPerPage > 0
                  ? filteredParents
                    .sort((a, b) => (a.code > b.code ? -1 : 1))
                    .slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredParents.sort((a, b) => (a.code > b.code ? -1 : 1))
                ).map((row) => (
                  <TableRow key={row.code}>
                    <TableCell>
                      <Typography variant="subtitle2">{row.code}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="subtitle2" fontWeight="600">
                          {row?.auth?.fullName ?? 'N/A'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="h6"
                        fontWeight="400"
                      >
                        {row?.auth?.email ?? 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color={row?.auth?.isBlocked ? "red" : "blue"}
                        variant="h6"
                        fontWeight="400"
                      >
                        {row?.auth?.isBlocked ? 'Blocked' : 'Active'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="subtitle2" fontWeight="600">
                          {row.createdAt}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <IconEdit
                          style={{ cursor: "pointer" }}
                          size="21"
                          onClick={() => {
                            router.push("/app/parents/" + row._id);
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
                    count={Array.isArray(filteredParents) ? filteredParents.length : 0}
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

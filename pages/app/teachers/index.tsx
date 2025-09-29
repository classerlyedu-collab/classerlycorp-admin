import { Backdrop, Box, CircularProgress, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import PageContainer from "../../../src/components/container/PageContainer";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import ParentCard from "../../../src/components/shared/ParentCard";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import apiRequest from "../../../src/utils/axios";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import endPoints from "../../../src/constant/apiEndpoint";
import { useRouter } from "next/router";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { IconEdit } from "@tabler/icons-react";
import BlankCard from "../../../src/components/shared/BlankCard";
import students from "../students";
import { TeacherType } from "../../../src/types/teachers";
import TabSearchBar from "../../../src/components/common/TabSearchBar";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "HR-Admins",
  },
];

const Teachers = () => {
  const router = useRouter();

  const [isLoader, setIsloader] = React.useState(false);
  const [teachers, setTeachers] = useState<TeacherType[] | []>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<TeacherType[] | []>([]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Update filtered teachers when teachers change
  useEffect(() => {
    setFilteredTeachers(teachers);
  }, [teachers]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 && Array.isArray(filteredTeachers) ? Math.max(0, (1 + page) * rowsPerPage - filteredTeachers.length) : 0;

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const fetchTeachers = () => {
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
      .get(endPoints.HR_ADMINS, config)
      .then((response) => {
        if (response && response.data) {
          setTeachers(response.data);
        }
        setIsloader(false);
      })
      .catch((error) => {
        console.log("fetchTeachers error ==> ", error);
        setIsloader(false);
      });
  };

  useEffect(() => {
    fetchTeachers();
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
      <Breadcrumb title="HR-Admins" items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title="HR-Admins">
        {/* Search Bar */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <TabSearchBar
            placeholder="Search HR-Admins by name or email..."
            data={teachers}
            searchFields={['auth.fullName', 'auth.email']}
            onResultClick={(result) => router.push(`/app/teachers/${result.data._id}`)}
            onFilterChange={setFilteredTeachers}
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
                {!Array.isArray(filteredTeachers) || filteredTeachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="textSecondary">
                        {!Array.isArray(filteredTeachers) ? "Loading..." : "No HR-Admins found"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (rowsPerPage > 0
                  ? filteredTeachers.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  : filteredTeachers
                ).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="subtitle2">{index + 1}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="subtitle2" fontWeight="600">
                          {row?.auth?.fullName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="h6"
                        fontWeight="400"
                      >
                        {row?.auth?.email}
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
                      <Typography variant="subtitle2">
                        {row?.createdAt}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <IconEdit
                          style={{ cursor: "pointer" }}
                          size="21"
                          onClick={() => {
                            router?.push("/app/teachers/" + row._id);
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
                    count={Array.isArray(filteredTeachers) ? filteredTeachers.length : 0}
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
  )
};

export default Teachers;

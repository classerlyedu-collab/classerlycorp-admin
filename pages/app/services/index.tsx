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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { IconEdit, IconGitBranchDeleted } from "@tabler/icons-react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

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
import axios from "../../../src/utils/axios";
import endPoints from "../../../src/constant/apiEndpoint";

import Image from "next/image";

import Slide from "@mui/material/Slide";

import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
    title: "Services",
  },
];

const PaginationTable = () => {
  const [isLoader, setIsloader] = React.useState(false);
  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  interface Services {
    id: number;
    name: string;
    price: number;
    details: string;
    isAvailable: boolean;
  }

  const [data, setData] = React.useState<Services[]>([]);

  React.useEffect(() => {
    getServices();
  }, []);

  const getServices = () => {
    setIsloader(true);
    axios
      .get(endPoints.STUDENTS + "list", config)
      .then((res) => {

        setData(res.data.service);
        setIsloader(false);
      })
      .catch((err) => {
        console.log(err);
        setIsloader(false);
      });
  };

  // Avoid a layout jump when reaching the last page with empty data.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // getting user data
  interface UserData {
    [key: string]: any;
  }

  const getUserData = (): UserData => {
    if (typeof window !== "undefined") {
      const usrData = typeof window !== "undefined" ? window.localStorage.getItem("userData") : null;
      return usrData ? JSON.parse(usrData) : {};
    }
    return {};
  };

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const initialUserData: UserData = getUserData();
  const [userData, setUserData] = React.useState<UserData>(initialUserData);

  const config = {
    headers: {
      Authorization: "Bearer " + userData.token,
    },
  };

  const deleteServices = (id: number) => {

    setIsloader(true);
    axios
      .delete(endPoints.STUDENTS + id, config)
      .then((res) => {

        setOpen(true);
        getServices();
        setIsloader(false);
      })
      .catch((err) => {
        console.log(err);
        setIsloader(false);
      });
  };

  return (
    <PageContainer>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Services Deleted Successfully?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Successfull
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* breadcrumb */}
      <Breadcrumb
        title="Services"
        items={BCrumb}
        addBtn="Add Services"
        isBtn={true}
        addBtnHREF="/app/services/create"
      />
      {/* end breadcrumb */}
      <ParentCard title="Services">
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
                    <Typography variant="h6">Price</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Details</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">isAvalible</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? data
                    .sort((a, b) => (a.id > b.id ? -1 : 1))
                    .slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : data.sort((a, b) => (a.id > b.id ? -1 : 1))
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Typography variant="subtitle2">{row.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="subtitle2" fontWeight="600">
                          {row.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="h6"
                        fontWeight="400"
                      >
                        {row.price}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2">{row.details}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {row.isAvailable == true ? "True" : "False"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <IconEdit
                          style={{ cursor: "pointer" }}
                          size="21"
                          onClick={() => {
                            router.push("services/" + row.id);
                          }}
                        />
                        <Image
                          onClick={() => {
                            deleteServices(row.id);
                          }}
                          alt="img1"
                          src={"/images/trash.png"}
                          width={18}
                          height={20}
                          style={{ marginLeft: "10px", cursor: "pointer" }}
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
                    count={data.length}
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

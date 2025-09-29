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
import Breadcrumb from "../../../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../../../src/components/container/PageContainer";
import ParentCard from "../../../../../src/components/shared/ParentCard";
import BlankCard from "../../../../../src/components/shared/BlankCard";
import { useRouter } from "next/router";
import endPoints from "../../../../../src/constant/apiEndpoint";
import apiRequest from "../../../../../src/utils/axios";
import { LessonType } from "../../../../../src/types/Lesson";
import AddLessonModal from "../../../../../src/components/modal/AddLessonModal";
import toast from "react-hot-toast";
import { formatLessonTitle } from "../../../../../src/utils/textFormatter";

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


const PaginationTable = ({ id, lessonId }: { id: string, lessonId: string }) => {

    const BCrumb = [
        {
            to: "/app/subjects",
            title: "Subjects",
        },
        {
            to: "/app/subjects/" + id,
            title: "Topics",
        },
        {
            title: "Lessons",
        },
    ];

    const [isLoader, setIsloader] = React.useState(false);

    const [subjects, setSubjects] = React.useState<LessonType[]>([]);
    const [openModal, setOpenModal] = React.useState(false);
    const [selectedSubject, setSelectedSubject] = React.useState<LessonType | null>(null);

    const router = useRouter();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - subjects.length) : 0;

    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetchLessons = () => {
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
            .get(endPoints.LESSONS + lessonId, config)
            .then((response) => {
                console.log("fetchLessons Response ====>", response);
                setSubjects(response.data);
                setIsloader(false);
            })
            .catch((error) => {
                console.log("fetchLessons ==> " + error);
                setIsloader(false);
            });
    };

    React.useEffect(() => {
        if (lessonId) {
            fetchLessons();
        }
    }, [lessonId, openModal]);

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleAddTopic = () => {
        setSelectedSubject(null);
        setOpenModal(true);
    };

    const handleEdit = (lessonId: any, name: any, content: any, pages: any, lang: any) => {
        const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;
        if (!token) {
            toast.error("Unauthorized request. Please login.");
            return;
        }

        apiRequest
            .put(
                endPoints.EDIT_LESSON,
                { lessonId, name, content, pages, lang },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                toast.success("Topic updated successfully.");
                fetchLessons();
            })
            .catch((error) => {
                console.error("Edit Topic Error:", error);
                toast.error("Error updating topic.");
            });
    };

    const handleDelete = (lessonId: string) => {
        const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;
        if (!token) {
            toast.error("Unauthorized request. Please login.");
            return;
        }

        apiRequest
            .put(endPoints.DELETE_LESSON, { lessonId }, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                toast.success("Topic deleted successfully.");
                fetchLessons();
            })
            .catch((error) => {
                console.error("Delete Topic Error:", error);
                toast.error("Error deleting topic.");
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

            {/* breadcrumb */}
            <Breadcrumb
                title="Lessons"
                items={BCrumb}
                addBtn="Add Lesson"
                isBtn={true}
                addBtnClick={handleAddTopic}
                triggerFunction={true}
            />
            {/* end breadcrumb */}
            <ParentCard title="Subjects">
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
                                        <Typography variant="h6">Pages</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">Words</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">Edit</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">Material</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? subjects
                                        .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                        )
                                    : subjects?.sort((a, b) => (a?.name > b?.name ? -1 : 1))
                                ).map((row) => (
                                    <TableRow key={row._id}>
                                        <TableCell>
                                            <Typography
                                                color="textSecondary"
                                                variant="h6"
                                                fontWeight="400"
                                            >
                                                {formatLessonTitle(row?.name)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                color="textSecondary"
                                                variant="h6"
                                                fontWeight="400"
                                            >
                                                {row?.pages}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="subtitle2">
                                                {row?.words}
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
                                                <IconArrowRight
                                                    style={{ cursor: "pointer" }}
                                                    size="21"
                                                    onClick={() => {
                                                        router.push("/app/subjects/" + id + "/lessons/" + lessonId + "/reading/" + row._id);
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
                                        count={subjects.length}
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

            <AddLessonModal open={openModal} handleClose={handleCloseModal} topicId={lessonId} selectedSubject={selectedSubject} handleDelete={handleDelete} handleEdit={handleEdit} />


        </PageContainer>
    );
};

export default PaginationTable;

export async function getServerSideProps(context: any) {
    const { id, lessonId } = context.query; // Destructure both id and lessonId from context.query

    return {
        props: {
            id,        // Pass subject ID as a prop
            lessonId,  // Pass lesson ID as a prop
        },
    };
}

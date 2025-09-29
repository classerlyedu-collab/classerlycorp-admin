import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import Breadcrumb from "../../../../../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import PageContainer from "../../../../../../../src/components/container/PageContainer";
import ParentCard from "../../../../../../../src/components/shared/ParentCard";
import BlankCard from "../../../../../../../src/components/shared/BlankCard";
import { useRouter } from "next/router";
import endPoints from "../../../../../../../src/constant/apiEndpoint";
import apiRequest from "../../../../../../../src/utils/axios";
import { intialLessonData, LessonType } from "../../../../../../../src/types/Lesson";

const LessonContent = ({ id, lessonId, materialId }:{id: string, lessonId: string, materialId: string}) => {
    const BCrumb = [
        { to: "/app/subjects", title: "Subjects" },
        { to: `/app/subjects/${id}`, title: "Topics" },
        { to: `/app/subjects/${id}/lessons/${lessonId}`, title: "Lessons" },
        { title: "Material" },
    ];

    const [isLoader, setIsLoader] = React.useState(false);
    const [lesson, setLesson] = React.useState<LessonType>(intialLessonData);

    const router = useRouter();

    const fetchLesson = () => {
        setIsLoader(true);
        const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;

        if (!token) {
            router.push("/");
            setIsLoader(false);
            return;
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };

        apiRequest
            .get(endPoints.LESSONS_BY_ID + materialId, config)
            .then((response) => {
                setLesson(response.data);
                setIsLoader(false);
            })
            .catch((error) => {
                console.error("fetchLesson error:", error);
                setIsLoader(false);
            });
    };

    React.useEffect(() => {
        if (materialId) {
            fetchLesson();
        }
    }, [materialId]);

    return (
        <PageContainer>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoader}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* Breadcrumb */}
            <Breadcrumb title="Material" items={BCrumb} />
            
            <ParentCard title="Lesson Material">
                <BlankCard>
                    <TableContainer>
                        <Table aria-label="lesson table" sx={{ whiteSpace: "nowrap" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell><Typography variant="h6">Name</Typography></TableCell>
                                    <TableCell><Typography variant="h6">Pages</Typography></TableCell>
                                    <TableCell><Typography variant="h6">Words</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow key={lesson._id}>
                                    <TableCell>
                                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                                            {lesson?.name || "N/A"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography color="textSecondary" variant="h6" fontWeight="400">
                                            {lesson?.pages || 0}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2">
                                            {lesson?.words || 0}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Display content in iframe */}
                    {lesson?.content ? (
                        <Box mt={3}>
                            <iframe
                                src={lesson.content}
                                style={{ width: "100%", height: "600px", border: "none" }}
                                title="Lesson Content"
                            ></iframe>
                        </Box>
                    ) : (
                        <Typography variant="h6" mt={2} color="textSecondary">
                            Content not available
                        </Typography>
                    )}
                </BlankCard>
            </ParentCard>
        </PageContainer>
    );
};

export default LessonContent;

export async function getServerSideProps(context:any) {
    const { id, lessonId, materialId } = context.query;

    return {
        props: {
            id,
            lessonId,
            materialId,
        },
    };
}
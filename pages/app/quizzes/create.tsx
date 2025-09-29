import React, { useEffect, useState } from "react";
import { Select, MenuItem, Button, CircularProgress, Backdrop, TextField, Box } from "@mui/material";
import apiRequest from "../../../src/utils/axios";
import endPoints from "../../../src/constant/apiEndpoint";
import PageContainer from "../../../src/components/container/PageContainer";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
// import pdfToText from 'react-pdftotext';

const BCrumb = [
    { to: "/", title: "Quizzes" },
    { title: "Add Quiz" },
];

const AddQuizForm = () => {
    const router = useRouter();
    const [subjects, setSubjects] = useState<any[]>([]);
    const [topics, setTopics] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);
    const [type, setQuizType] = useState("");
    const [selectedSubject, setSelectedSubject] = useState<any>({});
    const [selectedTopic, setSelectedTopic] = useState<any>({});
    const [selectedLesson, setSelectedLesson] = useState<any>({});
    const [questions, setQuestions] = useState<any[]>([]);
    const [isLoader, setIsLoader] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;

    useEffect(() => {
        if (!token) {
            router.push('/');  // Ensure this happens only in the client-side
            return; // Exit if no token is available
        }
    }, [token, router]);

    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Fetch Subjects
    useEffect(() => {
        const fetchSubjects = async () => {
            setIsLoader(true);
            try {
                const { data } = await apiRequest.get(endPoints.SUBJECTS, config);
                setSubjects(data.data || []);
            } catch (error) {
                toast.error("Error fetching subjects!");
            } finally {
                setIsLoader(false);
            }
        };
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (selectedSubject._id) fetchDependentData(endPoints.GET_TOPICS_BY_SUBJECT, selectedSubject._id, setTopics);
    }, [selectedSubject]);

    useEffect(() => {
        if (selectedTopic._id) fetchDependentData(endPoints.GET_LESSON_BY_TOPIC, selectedTopic._id, setLessons);
    }, [selectedTopic]);

    const fetchDependentData = async (endpoint: string, id: string, setter: Function) => {
        setIsLoader(true);
        try {
            const { data } = await apiRequest.get(`${endpoint}${id}`, config);
            setter(data);
        } catch (error) {
            toast.error("Error fetching data!");
        } finally {
            setIsLoader(false);
        }
    };

    const extractTextFromPDF = async (event: any) => {
        setIsLoader(true);
        try {
            const file = event.target.files[0];
            console.log("File", file);

            const pdfToText = typeof window !== "undefined"
                ? (await import('react-pdftotext')).default
                : null;



            // Dynamically import pdfjs-dist on the client side only
            if (typeof window !== 'undefined' && pdfToText !== null) {
                const { default: pdfjsLib } = await import('pdfjs-dist');
                const text = await pdfToText(file);
                console.log("text", text);

                const normalizedText = text.replace(/\s+/g, ' ').trim(); // Normalize the text
                const parsedQuestions = await parseQuestionsFromPdf(normalizedText);

                if (parsedQuestions.length === 0) {
                    toast.error("No valid questions found. Check the format.");
                    console.log('No valid questions found. Check the format.');
                    return;
                }

                setQuestions(parsedQuestions);
                toast.success("Questions extracted successfully!");
            }
        } catch (error) {
            toast.error("Failed to process the PDF.");
            console.error(error);
        } finally {
            setIsLoader(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = e.target; // Reference to the file input element
        const fileURL = e.target.value; // Assuming you have a URL as input
        if (fileURL && fileURL.endsWith(".pdf")) {
            await extractTextFromPDF(e); // Call extractTextFromPDF with the URL

            fileInput.value = "";

        } else {
            toast.error("Please provide a valid PDF URL.");
        }
    };

    const parseQuestionsFromPdf = async (text: string) => {
        console.log('Text Received: ', text);

        const questions: any[] = [];
        // Split text by question identifiers like "Q1.", "Q2.", etc.
        const questionBlocks = text.split(/Q\d+\.\s+/); // Split by "Q1. ", "Q2. ", etc.
        questionBlocks.shift(); // Remove any text before the first question

        questionBlocks.forEach((block) => {
            // Regex to capture specific parts of each question block
            const questionMatch = block.match(/^(.*?)(?=\s+A\))/s); // Capture question text until "A)"
            const optionsMatch = block.match(/A\)\s+(.*?)\s+B\)\s+(.*?)\s+C\)\s+(.*?)\s+D\)\s+(.*?)(?=\s+Correct Answer:|\s+$)/s);
            const correctAnswerMatch = block.match(/Correct Answer:\s+([A-D])/);
            const timeMatch = block.match(/Time:\s+(\d+)/);
            const scoreMatch = block.match(/Score:\s+(\d+)/);

            if (
                questionMatch &&
                optionsMatch &&
                correctAnswerMatch &&
                timeMatch &&
                scoreMatch
            ) {
                questions.push({
                    question: questionMatch[1].trim(),
                    options: [
                        optionsMatch[1].trim(),
                        optionsMatch[2].trim(),
                        optionsMatch[3].trim(),
                        optionsMatch[4].trim(),
                    ],
                    answer: correctAnswerMatch[1].trim(),
                    time: parseInt(timeMatch[1], 10),
                    score: parseInt(scoreMatch[1], 10),
                });
            }
        });

        console.log('Text Returned: ', questions);
        return questions;
    };


    const handleQuestionChange = (index: number, field: string, value: any) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (index: number, optionIndex: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].options[optionIndex] = value;
        setQuestions(updatedQuestions);
    };

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: "",
                options: ["", "", "", ""],
                answer: "",
                time: 60,
                score: 0
            }
        ]);
    };

    const handleSubmit = async () => {
        if (!type || !selectedSubject || !selectedTopic || !selectedLesson || !startDate || !endDate || questions.length === 0) {
            toast.error('Please fill in all fields!');
            return;
        }

        setIsLoader(true);
        try {
            const payload = {
                subject: selectedSubject._id,
                topic: selectedTopic._id,
                lesson: selectedLesson._id,
                startsAt: startDate,
                endsAt: endDate,
                type: type,
                score: questions.reduce((total: number, question: any) => total + question.score, 0),
                questions: questions.map((q: any) => ({
                    question: q.question,
                    options: q.options,
                    answer: q.answer,
                    time: q.time,
                    score: q.score
                }))
            };

            await apiRequest.post(endPoints.ADD_QUIZ, payload, config);
            toast.success('Quiz Added Successfully!');
            router.back();
        } catch (error: any) {
            console.log(error);
            toast.error('Error saving quiz!');
        } finally {
            setIsLoader(false);
        }
    };

    const handleDeleteQuestion = (index: number) => {
        const updatedQuestions = questions.filter((_, qIndex) => qIndex !== index);
        setQuestions(updatedQuestions);
    };


    return (
        <PageContainer>
            <Breadcrumb
                title="Quizzes"
                items={BCrumb}
            />

            <Backdrop open={isLoader}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* File Input */}
            <Button variant="contained" component="label" sx={{ marginBottom: 2 }}>
                Upload Bulk Questions
                <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
            </Button>

            <Select
                sx={{ marginBottom: 2 }}
                value={type || ""}
                onChange={(e) => setQuizType(e.target.value)}  // Use state to handle quizType selection
                fullWidth
                displayEmpty
                renderValue={(selected) => (selected ? selected : "Select Quiz Type")}
            >
                <MenuItem value="universal">Universal</MenuItem>
                <MenuItem value="private">Private</MenuItem>
            </Select>

            <Select
                sx={{ marginBottom: 2 }}
                value={selectedSubject?._id || ""}
                onChange={(e) => setSelectedSubject(subjects.find((subject: any) => subject._id === e.target.value))}
                fullWidth
                displayEmpty
                renderValue={(selected) => (selected ? selectedSubject.name : "Select Subject")}
            >
                {subjects.map((subject: any) => (
                    <MenuItem key={subject._id} value={subject._id}>
                        {subject.name}
                    </MenuItem>
                ))}
            </Select>

            <Select
                sx={{ marginBottom: 2 }}
                value={selectedTopic?._id || ""}
                onChange={(e) => setSelectedTopic(topics.find((topic: any) => topic._id === e.target.value))}
                fullWidth
                displayEmpty
                renderValue={(selected) => (selected ? selectedTopic.name : "Select Topic")}
            >
                {topics.map((topic: any) => (
                    <MenuItem key={topic._id} value={topic._id}>
                        {topic.name}
                    </MenuItem>
                ))}
            </Select>

            <Select
                value={selectedLesson?._id || ""}
                onChange={(e) => setSelectedLesson(lessons.find((lesson: any) => lesson._id === e.target.value))}
                fullWidth
                displayEmpty
                renderValue={(selected) => (selected ? selectedLesson.name : "Select Lesson")}
            >
                {lessons.map((lesson: any) => (
                    <MenuItem key={lesson._id} value={lesson._id}>
                        {lesson.name}
                    </MenuItem>
                ))}
            </Select>

            <TextField
                label="Start Date"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />

            <TextField
                label="End Date"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />

            {questions.map((question: any, index: any) => (
                <Box key={index} sx={{ marginBottom: 3 }}>
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center'
                    }}>
                        <TextField
                            label={`Question ${index + 1}`}
                            value={question.question}
                            onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteQuestion(index)}
                            sx={{
                                height: 45
                            }}
                        >
                            Delete
                        </Button>
                    </Box>

                    {question.options.map((option: any, optionIndex: any) => (
                        <TextField
                            key={optionIndex}
                            label={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    ))}
                    <TextField
                        label="Answer"
                        value={question.answer}
                        onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Time (in seconds)"
                        type="number"
                        value={question.time}
                        onChange={(e) => handleQuestionChange(index, 'time', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Score"
                        type="number"
                        value={question.score}
                        onChange={(e) => handleQuestionChange(index, 'score', e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                </Box>
            ))}

            <Button sx={{ marginBottom: 4, marginTop: 2 }} variant="contained" onClick={handleAddQuestion} fullWidth>
                {questions?.length === 0 ? 'Add A Question' : 'Add More Questions'}
            </Button>

            <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                Upload Quiz
            </Button>
        </PageContainer>
    );
};

export default AddQuizForm;
import React, { useEffect, useState } from "react";
import {
    Modal,
    Box,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Typography,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { TopicType } from "../../types/topics";
import apiRequest from "../../utils/axios";
import endpoints from '../../constant/apiEndpoint';

interface AddTopicModalProps {
    open: boolean;
    handleClose: () => void;
    subjectId: string;
    selectedSubject: TopicType | null;
    handleDelete: (id: string) => void;
    handleEdit: (id: string, name: string, difficulty: string, type: string) => void;
}

const AddTopicModal: React.FC<AddTopicModalProps> = ({
    open,
    handleClose,
    subjectId,
    selectedSubject,
    handleDelete,
    handleEdit,
}) => {
    const [name, setName] = useState("");
    const [difficulty, setDifficulty] = useState("Beginner");
    const [type, setType] = useState("Standard");

    useEffect(() => {
        if (selectedSubject) {
            setName(selectedSubject.name);
            setDifficulty(selectedSubject.difficulty);
            setType(selectedSubject.type);
        } else {
            setName("");
            setDifficulty("Beginner");
            setType("Standard");
        }
    }, [selectedSubject]);

    const handleSubmit = async () => {
        if (!name || !difficulty || !type) {
            toast.error("All fields are required.");
            return;
        }

        if (selectedSubject) {
            await handleEdit(selectedSubject._id, name, difficulty, type);
        } else {
            // Add functionality
            const payload = {
                name,
                subject: subjectId,
                difficulty,
                type,
            };

            try {
                const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;
                if (!token) {
                    toast.error("Unauthorized. Please login.");
                    handleClose();
                    return;
                }

                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };

                await apiRequest.post(endpoints.ADD_TOPIC, payload, config);
                toast.success("Topic added successfully!");
                handleClose(); // Close the modal after adding the topic
            } catch (error) {
                console.error(error);
            }
        }

        handleClose();
    };

    const handleDeleteClick = () => {
        if (selectedSubject) {
            handleDelete(selectedSubject._id);
        } else {
            toast.error("No topic selected to delete.");
        }
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: 400,
                    padding: 3,
                    backgroundColor: "white",
                    margin: "auto",
                    marginTop: "100px",
                }}
            >
                <Typography variant="h6" gutterBottom>
                    {selectedSubject ? "Edit Topic" : "Add New Topic"}
                </Typography>
                <TextField
                    label="Topic Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Difficulty</InputLabel>
                    <Select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                    >
                        <MenuItem value="Beginner">Beginner</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Advanced">Advanced</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <MenuItem value="Standard">Standard</MenuItem>
                        <MenuItem value="Premium">Premium</MenuItem>
                    </Select>
                </FormControl>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Save Changes
                    </Button>
                    {selectedSubject && (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteClick}
                        >
                            Delete
                        </Button>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default AddTopicModal;
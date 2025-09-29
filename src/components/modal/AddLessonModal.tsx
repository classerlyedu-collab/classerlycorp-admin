import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Button, MenuItem, FormControl, InputLabel, Select, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { toast } from "react-hot-toast";
import apiRequest from "../../../src/utils/axios"; // Assuming axios is set up for API calls
import endPoints from "../../../src/constant/apiEndpoint";
import { LessonType } from "../../types/Lesson";
import { formatLessonTitle } from "../../utils/textFormatter";

const AddLessonModal = ({ open, handleClose, topicId, selectedSubject,
    handleDelete,
    handleEdit, }: { open: boolean; handleClose: () => void; topicId: string, selectedSubject: LessonType | null, handleDelete: any, handleEdit: any }) => {
    const [name, setName] = useState(selectedSubject?.name ?? "");
    const [content, setContent] = useState(selectedSubject?.content ?? "");
    const [pages, setPages] = useState(selectedSubject?.pages ?? 0);
    const [lang] = useState(selectedSubject?.lang ?? "Eng");  // Fixed language as "Eng"
    const [hrAdmins, setHrAdmins] = useState<any[]>([]);
    const [selectedHrAdminIds, setSelectedHrAdminIds] = useState<string[]>([]);
    const [createForAll, setCreateForAll] = useState(false);

    // Fetch HR-Admins when modal opens
    useEffect(() => {
        if (open && !selectedSubject) {
            fetchHrAdmins();
        }
    }, [open, selectedSubject]);

    // Update state when `selectedSubject` changes
    useEffect(() => {
        if (selectedSubject) {
            setName(formatLessonTitle(selectedSubject.name || ""));
            setContent(selectedSubject.content || "");
            setPages(selectedSubject.pages || 0);
        } else {
            // Clear the fields if no subject is selected (for adding a new lesson)
            setName("");
            setContent("");
            setPages(0);
            setSelectedHrAdminIds([]);
            setCreateForAll(false);
        }
    }, [selectedSubject]);

    const fetchHrAdmins = async () => {
        try {
            const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;
            if (!token) return;

            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const response = await apiRequest.get(endPoints.HR_ADMINS, config);
            if (response.data.success) {
                setHrAdmins(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching HR-Admins:", error);
        }
    };

    const handleSubmit = async () => {
        if (!name || !content || !topicId) {
            toast.error("Please fill all the required fields.");
            return;
        }

        if (!selectedSubject && !createForAll && selectedHrAdminIds.length === 0) {
            toast.error("Please select HR-Admins or choose 'All HR-Admins'.");
            return;
        }

        if (selectedSubject) {
            await handleEdit(topicId, name, content, pages, lang);
            handleClose();
        } else {
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

                const payload = {
                    name,
                    content,
                    pages,
                    lang,
                    topic: topicId,
                    createForAll,
                    hrAdminIds: createForAll ? [] : selectedHrAdminIds,
                };

                const response = await apiRequest.post(endPoints.ADD_LESSON, payload, config);
                toast.success("Lesson added successfully!");
                handleClose();
            } catch (error) {
                console.log(error);
                toast.error("Error adding lesson. Please try again.");
                handleClose();
            }
        }
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
            <Box sx={{ display: "flex", flexDirection: "column", width: 400, padding: 3, backgroundColor: "white", margin: "auto", marginTop: "100px" }}>
                <Typography variant="h6" mb={2}>
                    {selectedSubject ? "Edit Lesson" : "Add New Lesson"}
                </Typography>

                <TextField
                    label="Lesson Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={(e) => setName(formatLessonTitle(e.target.value))}
                    fullWidth
                    margin="normal"
                    placeholder="Enter lesson name in sentence case"
                />

                <TextField
                    label="Content Url"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                />

                <TextField
                    label="Pages"
                    value={pages}
                    onChange={(e) => setPages(Number(e.target.value))}
                    fullWidth
                    type="number"
                    margin="normal"
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Language</InputLabel>
                    <Select
                        value={lang}
                    >
                        <MenuItem value="Eng">English</MenuItem>
                    </Select>
                </FormControl>

                {!selectedSubject && (
                    <>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={createForAll}
                                    onChange={(e) => {
                                        setCreateForAll(e.target.checked);
                                        if (e.target.checked) {
                                            setSelectedHrAdminIds([]);
                                        }
                                    }}
                                />
                            }
                            label="All HR-Admins"
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>HR-Admins</InputLabel>
                            <Select
                                multiple
                                value={selectedHrAdminIds}
                                onChange={(e) => setSelectedHrAdminIds(e.target.value as string[])}
                                disabled={createForAll}
                            >
                                {hrAdmins.map((hrAdmin) => (
                                    <MenuItem key={hrAdmin._id} value={hrAdmin._id}>
                                        {hrAdmin.auth?.fullName || hrAdmin.auth?.userName || 'Unknown'}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                )}

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

export default AddLessonModal;

import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box, FormControl, RadioGroup, FormControlLabel, Radio, CircularProgress, Typography, Paper, Divider } from "@mui/material";
import apiRequest from "../../../src/utils/axios";
import endPoints from "../../../src/constant/apiEndpoint";
import { IconRowRemove, IconUpload, IconLink } from "@tabler/icons-react";

const EditDeleteModal = ({ open, handleClose, subject, handleDelete, handleEdit }: any) => {
    const [name, setName] = useState(subject?.name || "");
    const [image, setImage] = useState(subject?.image || "");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(subject?.image || "");
    const [mode, setMode] = useState<'upload' | 'url'>(subject?.image ? 'url' : 'upload');
    const [isSaving, setIsSaving] = useState(false);


    const onSave = async () => {
        setIsSaving(true);
        try {
            await handleEdit(subject._id, name, image, mode === 'upload' ? selectedFile : null);
            handleClose();
        } finally {
            setIsSaving(false);
        }
    };

    const onDelete = () => {
        handleDelete(subject._id);
        handleClose();
    };

    const handleUploadClick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0] || null;
            if (file) {
                setSelectedFile(file);
                setPreview(URL.createObjectURL(file)); // show local preview only; do not change URL field
            }
        };
        input.click();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    Edit Subject
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ px: 3, py: 2 }}>
                <TextField
                    fullWidth
                    label="Subject Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    sx={{ mb: 3 }}
                />

                <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                        Icon Selection
                    </Typography>
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <RadioGroup
                            row
                            value={mode}
                            onChange={(_, v) => setMode(v as any)}
                            sx={{ justifyContent: 'center', gap: 3 }}
                        >
                            <FormControlLabel
                                value="upload"
                                control={<Radio size="small" />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <IconUpload size={16} />
                                        <Typography variant="body2">Upload Image</Typography>
                                    </Box>
                                }
                            />
                            <FormControlLabel
                                value="url"
                                control={<Radio size="small" />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <IconLink size={16} />
                                        <Typography variant="body2">Use Image URL</Typography>
                                    </Box>
                                }
                            />
                        </RadioGroup>
                    </FormControl>

                    {mode === 'url' ? (
                        <TextField
                            fullWidth
                            label="Image URL"
                            value={image}
                            onChange={(e) => { setImage(e.target.value); setPreview(e.target.value); }}
                            variant="outlined"
                            placeholder="https://example.com/image.png"
                        />
                    ) : (
                        <Button
                            variant="outlined"
                            onClick={handleUploadClick}
                            startIcon={<IconUpload size={18} />}
                            sx={{
                                width: '100%',
                                py: 1.5,
                                borderStyle: 'dashed',
                                borderWidth: 2,
                                '&:hover': {
                                    borderStyle: 'dashed',
                                    borderWidth: 2,
                                }
                            }}
                        >
                            Select Icon File
                        </Button>
                    )}
                </Paper>

                {preview && (
                    <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                            Preview
                        </Typography>
                        <Box
                            sx={{
                                display: 'inline-block',
                                p: 1,
                                border: '2px solid',
                                borderColor: 'primary.main',
                                borderRadius: 2,
                                bgcolor: 'white'
                            }}
                        >
                            <img
                                src={preview}
                                alt="subject preview"
                                style={{
                                    width: 80,
                                    height: 80,
                                    objectFit: "cover",
                                    borderRadius: 8
                                }}
                            />
                        </Box>
                    </Paper>
                )}
            </DialogContent>
            <Divider />
            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button
                    onClick={onDelete}
                    color='error'
                    variant="outlined"
                    startIcon={<IconRowRemove size={16} />}
                >
                    Delete
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button onClick={handleClose} variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={onSave}
                    color="primary"
                    variant="contained"
                    disabled={isSaving}
                    startIcon={isSaving ? <CircularProgress size={16} /> : null}
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDeleteModal;
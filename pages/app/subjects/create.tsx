import React, { useEffect, useState } from "react";
import { Select, MenuItem, TextField, Button, CircularProgress, Backdrop, Box, FormControl, RadioGroup, FormControlLabel, Radio, Typography, Paper, Divider, Card, CardContent } from "@mui/material";
import apiRequest from "../../../src/utils/axios";
import endPoints from "../../../src/constant/apiEndpoint";
import PageContainer from "../../../src/components/container/PageContainer";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { IconUpload, IconLink, IconPlus } from "@tabler/icons-react";

const BCrumb = [
    {
        to: "/",
        title: "Subjects",
    },
    {
        title: "Add Subject",
    },
];

const AddSubjectForm = () => {
    const router = useRouter();
    const [hrAdmins, setHrAdmins] = useState<any[]>([]);
    const [subjectName, setSubjectName] = useState("");
    const [selectedHrAdminIds, setSelectedHrAdminIds] = useState<string[]>([]);
    const [createForAll, setCreateForAll] = useState<boolean>(false);
    const [subjectImage, setSubjectImage] = useState<any>(null); // File
    const [subjectImageUrl, setSubjectImageUrl] = useState<string>(""); // URL
    const [isLoader, setIsLoader] = useState(false);
    const [mode, setMode] = useState<'upload' | 'url'>('upload');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
    useEffect(() => {
        if (!token) {
            router.push('/');  // Ensure this happens only in the client-side
            setIsLoader(false);
            return; // Exit if no token is available
        }
    }, [token, router]);

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        const fetchHrAdmins = async () => {
            setIsLoader(true);
            try {
                const response = await apiRequest.get(endPoints.HR_ADMINS, config);
                const list = Array.isArray(response.data) ? response.data : response.data?.data || [];
                setHrAdmins(list);
            } catch (error) {
                console.log("Error fetching HR-Admins:", error);
            } finally {
                setIsLoader(false);
            }
        };
        fetchHrAdmins();
    }, []);

    const handleUploadClick = () => {
        try {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (event) => {
                const target = event.target as HTMLInputElement;
                const file: any = target.files?.[0];
                if (file) {
                    // Only set local state/preview; actual upload will occur on submit via backend
                    setSubjectImage(file);
                    setSubjectImageUrl("");
                }
            };
            input.click();
        } catch (error: any) {
            toast.error('error selecting file');
        }
    };


    const handleSubmit = async () => {
        if (!subjectName || (!createForAll && selectedHrAdminIds.length === 0)) {
            toast.error('Please fill in all fields!');
            return;
        }

        setIsLoader(true);
        try {
            setIsSubmitting(true);
            let resp;
            if (mode === 'upload') {
                if (!subjectImage) {
                    toast.error('Please select an icon file to upload');
                    setIsSubmitting(false);
                    return;
                }
                const formData = new FormData();
                formData.append('name', subjectName);
                if (createForAll) {
                    formData.append('createForAll', 'true');
                } else {
                    selectedHrAdminIds.forEach(id => formData.append('hrAdminIds[]', id));
                }
                formData.append('file', subjectImage);
                resp = await apiRequest.post(endPoints.ADD_SUBJECT, formData, {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
            } else {
                if (!subjectImageUrl) {
                    toast.error('Please enter an icon image URL');
                    setIsSubmitting(false);
                    return;
                }
                const payload: any = {
                    name: subjectName,
                    image: subjectImageUrl || "",
                    createForAll,
                    hrAdminIds: createForAll ? [] : selectedHrAdminIds,
                };
                resp = await apiRequest.post(endPoints.ADD_SUBJECT, payload, config);
            }
            // Ensure we clear form so edit modal picks latest from backend list
            setSubjectName("");
            setSelectedHrAdminIds([]);
            setCreateForAll(false);
            setSubjectImage(null);
            setSubjectImageUrl("");
            toast.success('Subject Added Successfully!')
            router.back();
        } catch (error: any) {
            console.log(error);
        } finally {
            setIsLoader(false);
            setIsSubmitting(false);
        }
    };

    return (
        <PageContainer>
            <Breadcrumb
                title="Subject"
                items={BCrumb}
            />

            <Backdrop open={isLoader}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Card elevation={2} sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" component="h1" sx={{ mb: 3, fontWeight: 600, textAlign: 'center', color: 'primary.main' }}>
                        Create New Subject
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                        <TextField
                            label="Subject Name"
                            value={subjectName}
                            onChange={(e) => setSubjectName(e.target.value)}
                            fullWidth
                            variant="outlined"
                            placeholder="Enter subject name"
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                            <Select
                                multiple={!createForAll}
                                value={createForAll ? 'ALL' : selectedHrAdminIds}
                                onChange={(e: any) => {
                                    const val = e.target.value;
                                    if (Array.isArray(val)) {
                                        if (val.includes('ALL')) {
                                            setCreateForAll(true);
                                            setSelectedHrAdminIds([]);
                                        } else {
                                            setCreateForAll(false);
                                            setSelectedHrAdminIds(val as string[]);
                                        }
                                    } else {
                                        if (val === 'ALL') {
                                            setCreateForAll(true);
                                            setSelectedHrAdminIds([]);
                                        } else if (val) {
                                            setCreateForAll(false);
                                            setSelectedHrAdminIds([val as string]);
                                        }
                                    }
                                }}
                                displayEmpty
                                renderValue={(selected) => {
                                    if (createForAll) return 'All HR-Admins';
                                    const sel = selected as any[];
                                    if (!sel || sel.length === 0) return 'Select HR-Admins';
                                    const names = hrAdmins.filter((h: any) => sel.includes(h._id)).map((h: any) => h?.auth?.fullName || h?._id);
                                    return names.join(', ');
                                }}
                            >
                                <MenuItem value={'ALL'}>All HR-Admins</MenuItem>
                                {hrAdmins.map((h: any) => (
                                    <MenuItem key={h._id} value={h._id}>
                                        {h?.auth?.fullName || h._id}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                            Icon Selection
                        </Typography>
                        <FormControl component="fieldset" sx={{ mb: 3 }}>
                            <RadioGroup
                                row
                                value={mode}
                                onChange={(_, v) => setMode(v as any)}
                                sx={{ justifyContent: 'center', gap: 4 }}
                            >
                                <FormControlLabel
                                    value="upload"
                                    control={<Radio size="small" />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <IconUpload size={18} />
                                            <Typography variant="body2">Upload Image</Typography>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    value="url"
                                    control={<Radio size="small" />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <IconLink size={18} />
                                            <Typography variant="body2">Use Image URL</Typography>
                                        </Box>
                                    }
                                />
                            </RadioGroup>
                        </FormControl>

                        {mode === 'url' ? (
                            <TextField
                                label="Icon Image URL"
                                value={subjectImageUrl}
                                onChange={(e) => { setSubjectImageUrl(e.target.value); setSubjectImage(null); }}
                                fullWidth
                                variant="outlined"
                                placeholder="https://example.com/image.png"
                            />
                        ) : (
                            <Button
                                variant="outlined"
                                onClick={handleUploadClick}
                                startIcon={<IconUpload size={20} />}
                                sx={{
                                    width: '100%',
                                    py: 2,
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

                    {(subjectImageUrl || subjectImage) && (
                        <Paper elevation={1} sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50', mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                                Preview
                            </Typography>
                            <Box
                                sx={{
                                    display: 'inline-block',
                                    p: 2,
                                    border: '2px solid',
                                    borderColor: 'primary.main',
                                    borderRadius: 2,
                                    bgcolor: 'white'
                                }}
                            >
                                <img
                                    src={subjectImageUrl || (subjectImage ? URL.createObjectURL(subjectImage) : "")}
                                    alt="Subject Icon Preview"
                                    style={{
                                        width: 100,
                                        height: 100,
                                        objectFit: "cover",
                                        borderRadius: 12
                                    }}
                                />
                            </Box>
                        </Paper>
                    )}

                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        fullWidth
                        disabled={isSubmitting}
                        size="large"
                        startIcon={isSubmitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <IconPlus size={20} />}
                        sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600
                        }}
                    >
                        {isSubmitting ? 'Creating Subject...' : 'Create Subject'}
                    </Button>
                </CardContent>
            </Card>
        </PageContainer>
    );
};

export default AddSubjectForm;

// Kid-friendly default icons available in the app bundle
const KID_ICONS = [
    '/images/logos/icon.png',
    '/images/landingpage/frameworks/logo-js.svg',
    '/images/landingpage/frameworks/logo-react.svg',
    '/images/landingpage/frameworks/logo-figma.svg',
    '/images/landingpage/frameworks/logo-apex.svg',
    '/images/svgs/icon-speech-bubble.svg',
    '/images/svgs/icon-pie.svg',
    '/images/svgs/icon-account.svg'
];
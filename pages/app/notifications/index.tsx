import {
    Backdrop,
    Box,
    CircularProgress,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    IconButton,
    Alert,
    Snackbar,
    Checkbox,
    Tooltip
} from "@mui/material";
import PageContainer from "../../../src/components/container/PageContainer";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import apiRequest from "../../../src/utils/axios";
import endPoints from "../../../src/constant/apiEndpoint";
import { IconEdit, IconTrash, IconPlus, IconBell, IconTrashX } from "@tabler/icons-react";
import BlankCard from "../../../src/components/shared/BlankCard";
import { useRouter } from "next/router";

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Notifications",
    },
];

interface Notification {
    _id: string;
    title: string;
    forType: string;
    forAll: boolean;
    for?: {
        _id: string;
        fullName: string;
        email: string;
        userType: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface User {
    _id: string;
    fullName: string;
    email: string;
    userType: string;
}

const Notifications = () => {
    const router = useRouter();
    const [isLoader, setIsLoader] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
    const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        forType: "All",
        specificUserIds: [] as string[]
    });

    const fetchNotifications = () => {
        setIsLoader(true);

        const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
        if (!token) {
            router.push('/');
            setIsLoader(false);
            return;
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        apiRequest
            .get(endPoints.NOTIFICATIONS, config)
            .then((response) => {
                if (response && response.data) {
                    setNotifications(response.data);
                }
                setIsLoader(false);
            })
            .catch((error) => {
                console.error("Error fetching notifications:", error);
                showSnackbar("Error fetching notifications", "error");
                setIsLoader(false);
            });
    };

    const fetchUsers = React.useCallback((userType?: string) => {
        const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
        if (!token) {
            return;
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        const params = userType ? { userType } : {};
        apiRequest
            .get(endPoints.USERS_FOR_NOTIFICATION, { ...config, params })
            .then((response) => {
                if (response && response.data) {
                    setUsers(response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }, []);

    useEffect(() => {
        fetchNotifications();
        fetchUsers();
    }, []);

    const showSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleOpenDialog = (notification?: Notification) => {
        if (notification) {
            setEditingNotification(notification);

            // For specific user notifications, populate the specific user
            const specificUserIds = notification.for && !notification.forAll ? [notification.for._id] : [];

            setFormData({
                title: notification.title,
                forType: notification.forType,
                specificUserIds: specificUserIds
            });

            // Fetch users for the notification's type to populate the dropdown
            if (notification.forType && notification.forType !== "All") {
                fetchUsers(notification.forType);
            }
        } else {
            setEditingNotification(null);
            setFormData({
                title: "",
                forType: "All",
                specificUserIds: []
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingNotification(null);
        setFormData({
            title: "",
            forType: "All",
            specificUserIds: []
        });
    };

    const handleInputChange = React.useCallback((field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleSubmit = () => {
        if (!formData.title) {
            showSnackbar("Title is required", "error");
            return;
        }

        const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
        if (!token) {
            router.push('/');
            return;
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        setIsLoader(true);

        if (editingNotification) {
            // For editing, we need to delete the old notification and create a new one with updated targeting
            // First delete the old notification
            apiRequest
                .delete(`${endPoints.NOTIFICATIONS}/${editingNotification._id}`, config)
                .then(() => {
                    // Then create new notification with updated data
                    const newNotificationData = {
                        title: formData.title,
                        forType: formData.forType,
                        specificUserIds: formData.specificUserIds
                    };

                    return apiRequest.post(endPoints.NOTIFICATIONS, newNotificationData, config);
                })
                .then((response) => {
                    if (response && response.data) {
                        showSnackbar("Notification updated successfully", "success");
                        fetchNotifications();
                        handleCloseDialog();
                    }
                    setIsLoader(false);
                })
                .catch((error) => {
                    console.error("Error updating notification:", error);
                    showSnackbar("Error updating notification", "error");
                    setIsLoader(false);
                });
        } else {
            // Create new notification
            const newNotificationData = {
                title: formData.title,
                forType: formData.forType,
                specificUserIds: formData.specificUserIds
            };

            apiRequest
                .post(endPoints.NOTIFICATIONS, newNotificationData, config)
                .then((response) => {
                    if (response && response.data) {
                        showSnackbar("Notification created successfully", "success");
                        fetchNotifications();
                        handleCloseDialog();
                    }
                    setIsLoader(false);
                })
                .catch((error) => {
                    console.error("Error creating notification:", error);
                    showSnackbar("Error creating notification", "error");
                    setIsLoader(false);
                });
        }
    };

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to delete this notification?")) return;

        const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
        if (!token) {
            router.push('/');
            return;
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        setIsLoader(true);
        apiRequest
            .delete(`${endPoints.NOTIFICATIONS}/${id}`, config)
            .then((response) => {
                // Delete operations might not return data, just check if response exists
                showSnackbar("Notification deleted successfully", "success");
                fetchNotifications();
                setIsLoader(false);
            })
            .catch((error) => {
                console.error("Error deleting notification:", error);
                showSnackbar("Error deleting notification", "error");
                setIsLoader(false);
            });
    };

    // Multi-select functions
    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedNotifications(notifications.map(notification => notification._id));
        } else {
            setSelectedNotifications([]);
        }
    };

    const handleSelectNotification = (id: string) => {
        setSelectedNotifications(prev =>
            prev.includes(id)
                ? prev.filter(notificationId => notificationId !== id)
                : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        if (selectedNotifications.length === 0) {
            showSnackbar("Please select notifications to delete", "error");
            return;
        }

        if (!confirm(`Are you sure you want to delete ${selectedNotifications.length} notification(s)?`)) return;

        const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
        if (!token) {
            router.push('/');
            return;
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        setIsLoader(true);

        // Delete all selected notifications
        const deletePromises = selectedNotifications.map(id =>
            apiRequest.delete(`${endPoints.NOTIFICATIONS}/${id}`, config)
        );

        Promise.all(deletePromises)
            .then(() => {
                showSnackbar(`${selectedNotifications.length} notification(s) deleted successfully`, "success");
                setSelectedNotifications([]);
                fetchNotifications();
                setIsLoader(false);
            })
            .catch((error) => {
                console.error("Error deleting notifications:", error);
                showSnackbar("Error deleting notifications", "error");
                setIsLoader(false);
            });
    };

    const getTargetDisplay = (notification: Notification) => {
        if (notification.forAll) {
            const label = notification.forType === "All" ? "All Users" : `All ${notification.forType}s`;
            return <Chip label={label} color="primary" size="small" />;
        }
        if (notification.for) {
            return (
                <Box>
                    <Typography variant="body2" fontWeight="medium">
                        {notification.for.fullName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        {notification.for.userType} • {notification.for.email}
                    </Typography>
                </Box>
            );
        }
        return <Chip label={notification.forType} color="secondary" size="small" />;
    };

    return (
        <PageContainer>
            <Breadcrumb title="Notifications" items={BCrumb} />

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <BlankCard>
                        <Box p={3}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h4" fontWeight="600">
                                    Notifications Management
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    {selectedNotifications.length > 0 && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<IconTrashX />}
                                            onClick={handleBulkDelete}
                                        >
                                            Delete Selected ({selectedNotifications.length})
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        startIcon={<IconPlus />}
                                        onClick={() => handleOpenDialog()}
                                    >
                                        Create Notification
                                    </Button>
                                </Stack>
                            </Stack>

                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    indeterminate={selectedNotifications.length > 0 && selectedNotifications.length < notifications.length}
                                                    checked={notifications.length > 0 && selectedNotifications.length === notifications.length}
                                                    onChange={handleSelectAll}
                                                />
                                            </TableCell>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Target</TableCell>
                                            <TableCell>Created</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {notifications.map((notification) => (
                                            <TableRow
                                                key={notification._id}
                                                selected={selectedNotifications.includes(notification._id)}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedNotifications.includes(notification._id)}
                                                        onChange={() => handleSelectNotification(notification._id)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="subtitle2" fontWeight="600">
                                                        {notification.title}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {getTargetDisplay(notification)}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {new Date(notification.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1}>
                                                        <Tooltip title="Edit">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenDialog(notification)}
                                                                color="primary"
                                                            >
                                                                <IconEdit size={16} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDelete(notification._id)}
                                                                color="error"
                                                            >
                                                                <IconTrash size={16} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {notifications.length === 0 && (
                                <Box textAlign="center" py={4}>
                                    <IconBell size={48} color="#ccc" />
                                    <Typography variant="h6" color="textSecondary" mt={2}>
                                        No notifications found
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Create your first notification to get started
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </BlankCard>
                </Grid>
            </Grid>

            {/* Create/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingNotification ? "Edit Notification" : "Create New Notification"}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            required
                        />


                        {(
                            <>
                                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                    Target Audience
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    {editingNotification
                                        ? "Update the target audience for this notification"
                                        : "Leave empty to send to all users, or select specific users below"
                                    }
                                </Typography>

                                <FormControl fullWidth>
                                    <InputLabel>User Type (Optional)</InputLabel>
                                    <Select
                                        value={formData.forType}
                                        onChange={(e) => {
                                            handleInputChange("forType", e.target.value);
                                            fetchUsers(e.target.value);
                                        }}
                                    >
                                        <MenuItem value="HR-Admin">HR-Admins</MenuItem>
                                        <MenuItem value="Employee">Employees</MenuItem>
                                        <MenuItem value="Supervisor">Supervisors</MenuItem>
                                        <MenuItem value="All">All</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Select Specific Users (Optional)</InputLabel>
                                    <Select
                                        multiple
                                        value={formData.specificUserIds}
                                        onChange={(e) => handleInputChange("specificUserIds", e.target.value)}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.length === 0 ? (
                                                    <Typography variant="body2" color="textSecondary">
                                                        No users selected - will send to all users
                                                    </Typography>
                                                ) : (
                                                    selected.map((value) => {
                                                        const user = users.find(u => u._id === value);
                                                        return (
                                                            <Chip
                                                                key={value}
                                                                label={user?.fullName || value}
                                                                size="small"
                                                            />
                                                        );
                                                    })
                                                )}
                                            </Box>
                                        )}
                                    >
                                        {users.map((user) => (
                                            <MenuItem key={user._id} value={user._id}>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {user.fullName}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {user.userType} • {user.email}
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingNotification ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Loading Backdrop */}
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoader}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </PageContainer>
    );
};

export default Notifications;

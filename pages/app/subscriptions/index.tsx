import React, { useState, useEffect } from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    CircularProgress,
    Backdrop,
    IconButton,
    Tooltip,
    Box,
    TextField,
    InputAdornment,
} from "@mui/material";
import { Star, StarBorder, Search, Refresh } from "@mui/icons-material";
import apiRequest from "../../../src/utils/axios";
import PageContainer from "../../../src/components/container/PageContainer";
import Breadcrumb from "../../../src/layouts/full/shared/breadcrumb/Breadcrumb";
import endPoints from "../../../src/constant/apiEndpoint";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const SubscriptionsPage = () => {
    const [isLoader, setIsLoader] = useState(false);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [mounted, setMounted] = useState(false);
    const [searchText, setSearchText] = useState("");
    const router = useRouter();

    const BCrumb = [
        { to: "/", title: "Home" },
        { title: "Subscriptions" },
    ];

    const token = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !token) {
            router.push("/");
        }
    }, [mounted, token, router]);

    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined as any;

    const fetchSubscriptions = async () => {
        setIsLoader(true);
        try {
            console.log('Fetching HR-Admins from:', endPoints.HR_ADMINS);
            console.log('Full URL:', endPoints.BASE_URL + endPoints.HR_ADMINS);
            console.log('Config:', config);
            // Get all HR-Admins first
            const hrAdminsResponse = await apiRequest.get(endPoints.HR_ADMINS, config);
            console.log('HR-Admins response:', hrAdminsResponse);

            if (hrAdminsResponse?.success) {
                const hrAdmins = hrAdminsResponse.data;
                console.log('HR-Admins data:', hrAdmins);

                // Fetch subscription status for each HR-Admin
                const subscriptionPromises = hrAdmins.map(async (hrAdmin: any) => {
                    try {
                        const statusResponse = await apiRequest.get(
                            endPoints.HR_ADMIN_SUBSCRIPTION_STATUS + hrAdmin._id + '/subscription-status',
                            config
                        );
                        return {
                            ...hrAdmin,
                            subscriptionStatus: statusResponse?.success ? statusResponse.data : null
                        };
                    } catch (error) {
                        return {
                            ...hrAdmin,
                            subscriptionStatus: null
                        };
                    }
                });

                const hrAdminsWithSubscriptions = await Promise.all(subscriptionPromises);
                console.log('Final subscriptions data:', hrAdminsWithSubscriptions);
                setSubscriptions(hrAdminsWithSubscriptions);
            } else {
                console.log('HR-Admins response not successful:', hrAdminsResponse);
                toast.error("Failed to load HR-Admins");
            }
        } catch (error) {
            console.error('Failed to fetch subscriptions:', error);
            toast.error("Failed to load subscriptions: " + (error as any)?.message);
        } finally {
            setIsLoader(false);
        }
    };

    const toggleSubscriptionAccess = async (hrAdminId: string) => {
        setIsLoader(true);
        try {
            const response = await apiRequest.post(
                endPoints.TOGGLE_SUBSCRIPTION_ACCESS,
                { hrAdminId },
                config
            );
            if (response?.success) {
                toast.success(response.message);
                await fetchSubscriptions(); // Refresh the list
            } else {
                toast.error(response?.message || "Action failed");
            }
        } catch (e) {
            toast.error("Action failed");
        } finally {
            setIsLoader(false);
        }
    };

    useEffect(() => {
        if (mounted && token) {
            console.log('Token found, fetching subscriptions...');
            fetchSubscriptions();
        } else if (mounted && !token) {
            console.log('No token found');
        }
    }, [mounted, token]);

    const filteredSubscriptions = subscriptions.filter((sub) => {
        const searchLower = searchText.toLowerCase();
        return (
            sub.auth?.fullName?.toLowerCase().includes(searchLower) ||
            sub.auth?.email?.toLowerCase().includes(searchLower) ||
            sub.auth?.userName?.toLowerCase().includes(searchLower)
        );
    });

    const getStatusChip = (subscriptionStatus: any) => {
        if (!subscriptionStatus) {
            return <Chip label="No Subscription" color="default" size="small" />;
        }

        if (subscriptionStatus.accessGrantedBySuperAdmin) {
            return <Chip label="Free Access" color="success" size="small" />;
        }

        if (subscriptionStatus.status === 'active') {
            return <Chip label="Active" color="primary" size="small" />;
        }

        return <Chip label="Inactive" color="error" size="small" />;
    };

    if (isLoader && subscriptions.length === 0) {
        return (
            <Backdrop open={isLoader} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    if (!mounted) {
        return null;
    }

    return (
        <PageContainer>
            <Breadcrumb title="Subscription Management" items={BCrumb} />

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h5" component="h1">
                                    HR-Admin Subscriptions
                                </Typography>
                                <Box display="flex" gap={2} alignItems="center">
                                    <TextField
                                        size="small"
                                        placeholder="Search HR-Admins..."
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Tooltip title="Refresh">
                                        <IconButton onClick={fetchSubscriptions} disabled={isLoader}>
                                            <Refresh />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>HR-Admin</strong></TableCell>
                                            <TableCell><strong>Email</strong></TableCell>
                                            <TableCell><strong>Status</strong></TableCell>
                                            <TableCell><strong>Access Type</strong></TableCell>
                                            <TableCell><strong>Actions</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredSubscriptions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">
                                                    <Typography variant="body2" color="textSecondary">
                                                        {searchText
                                                            ? "No HR-Admins found matching your search"
                                                            : subscriptions.length === 0
                                                                ? "No HR-Admins found in the system. HR-Admins will appear here once they register."
                                                                : "No HR-Admins found"
                                                        }
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredSubscriptions.map((hrAdmin) => (
                                                <TableRow key={hrAdmin._id}>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center" gap={2}>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {hrAdmin.auth?.fullName || "N/A"}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {hrAdmin.auth?.email || "N/A"}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusChip(hrAdmin.subscriptionStatus)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {hrAdmin.subscriptionStatus?.accessGrantedBySuperAdmin
                                                                ? "Super Admin Granted"
                                                                : hrAdmin.subscriptionStatus?.status === 'active'
                                                                    ? "Stripe Subscription"
                                                                    : "No Access"
                                                            }
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Tooltip
                                                            title={
                                                                hrAdmin.subscriptionStatus?.hasAccess
                                                                    ? "Revoke free access"
                                                                    : "Grant free access"
                                                            }
                                                        >
                                                            <IconButton
                                                                onClick={() => toggleSubscriptionAccess(hrAdmin._id)}
                                                                disabled={isLoader}
                                                                color={hrAdmin.subscriptionStatus?.hasAccess ? "success" : "default"}
                                                            >
                                                                {hrAdmin.subscriptionStatus?.hasAccess ? <Star /> : <StarBorder />}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default SubscriptionsPage;

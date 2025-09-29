// 'use client'
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react'
// import apiRequest from '../../../utils/axios';
// import endPoints from "../../../../src/constant/apiEndpoint";
// import { Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

// const ActiveUsers = () => {
// //   if (!data) return <Typography variant="h6">No data available</Typography>;

//     const [isLoader, setIsloader] = React.useState(false);

//     const [activeUsers, setActiveUsers] = useState<any>([]);
//     const router = useRouter();

//     const fetchUserData = () => {
//       setIsloader(true);

//       const token = typeof window !== "undefined" ? window.localStorage?.getItem('authToken') : null;
//       if (!token) {
//         router.push('/');
//         setIsloader(false);
//         return; // Exit if no token is available
//       }

//       const config = {
//         headers: { Authorization: `Bearer ${token}` }
//       };

//       apiRequest
//         .get(endPoints.GET_ACTIVE_USERS, config)
//         .then((response: any) => {
//           console.log("Response of active users =======>", response);
//           setActiveUsers(response.data);
//           setIsloader(false);
//         })
//         .catch((error: any) => {
//           console.log("fetchAnalytics ==> " + error);
//           setIsloader(false);
//         });
//     };

//     useEffect(() => {
//         fetchUserData();
//     }, []);

//   const { totalActiveStudents, totalActiveTeachers, totalActiveParents, users } = activeUsers;

//   return (
//     <Grid container spacing={3}>
//       {/* Summary Cards */}
//       <Grid item xs={12} sm={4}>
//         <Card>
//           <CardContent>
//             <Typography variant="h6">Total Active Students</Typography>
//             <Typography variant="h4">{totalActiveStudents}</Typography>
//           </CardContent>
//         </Card>
//       </Grid>
//       <Grid item xs={12} sm={4}>
//         <Card>
//           <CardContent>
//             <Typography variant="h6">Total Active Teachers</Typography>
//             <Typography variant="h4">{totalActiveTeachers}</Typography>
//           </CardContent>
//         </Card>
//       </Grid>
//       <Grid item xs={12} sm={4}>
//         <Card>
//           <CardContent>
//             <Typography variant="h6">Total Active Parents</Typography>
//             <Typography variant="h4">{totalActiveParents}</Typography>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* Users Table */}
//       <Grid item xs={12}>
//   {users && Object.keys(users).length > 0 ? (
//     Object.keys(users).map((userType) => (
//       <TableContainer component={Paper} key={userType} sx={{ mb: 3 }}>
//         <Typography variant="h6" sx={{ p: 2 }}>{userType}s</Typography>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Full Name</TableCell>
//               <TableCell>Email</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {users[userType]?.map((user:any) => (
//               <TableRow key={user._id}>
//                 <TableCell>{user._id}</TableCell>
//                 <TableCell>{user.fullName}</TableCell>
//                 <TableCell>{user.email}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     ))
//   ) : (
//     <Typography variant="h6" sx={{ p: 2 }}>No active users available</Typography>
//   )}
// </Grid>
//     </Grid>
//   );
// };

// export default ActiveUsers;


// 'use client'
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import apiRequest from '../../../utils/axios';
// import endPoints from '../../../../src/constant/apiEndpoint';
// import { Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

// const ActiveUsers = () => {
//     const [isLoader, setIsloader] = useState(false);
//     const [activeUsers, setActiveUsers] = useState<any>({});
//     const router = useRouter();

//     const fetchUserData = () => {
//         setIsloader(true);
//         const token = typeof window !== 'undefined' ? window.localStorage?.getItem('authToken') : null;

//         if (!token) {
//             router.push('/');
//             setIsloader(false);
//             return;
//         }

//         apiRequest.get(endPoints.GET_ACTIVE_USERS, { headers: { Authorization: `Bearer ${token}` } })
//             .then((response: any) => {
//                 setActiveUsers(response.data);
//                 setIsloader(false);
//             })
//             .catch((error: any) => {
//                 console.error("Error fetching active users:", error);
//                 setIsloader(false);
//             });
//     };

//     useEffect(() => {
//         fetchUserData();
//     }, []);

//     const { totalActiveStudents, totalActiveTeachers, totalActiveParents, users } = activeUsers;

//     return (
//         <Box sx={{ p: 3, backgroundColor: '#ffff', minHeight: '100vh' }}>
//             {isLoader ? (
//                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//                     <CircularProgress />
//                 </Box>
//             ) : (
//                 <Grid container spacing={3}>
//                     {/* Summary Cards */}
//                     {[{
//                         title: "Total Active Students", value: totalActiveStudents, color: "#42a5f5"
//                     }, {
//                         title: "Total Active Teachers", value: totalActiveTeachers, color: "#66bb6a"
//                     }, {
//                         title: "Total Active Parents", value: totalActiveParents, color: "#ffa726"
//                     }].map((stat, index) => (
//                         <Grid item xs={12} sm={4} key={index}>
//                             <Card sx={{ boxShadow: 3, borderRadius: 2, textAlign: 'center', bgcolor: stat.color, color: 'white' }}>
//                                 <CardContent>
//                                     <Typography variant="h6" sx={{ fontWeight: 500 }}>{stat.title}</Typography>
//                                     <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{stat.value || 0}</Typography>
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//                     ))}

//                     {/* Users Table */}
//                     <Grid item xs={12}>
//                         {users && Object.keys(users).length > 0 ? (
//                             Object.keys(users).map((userType) => (
//                                 <TableContainer component={Paper} key={userType} sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
//                                     <Typography variant="h6" sx={{ p: 2, backgroundColor: '#eeeeee', fontWeight: 600, borderBottom: '2px solid #ddd' }}>
//                                         {userType}s
//                                     </Typography>
//                                     <Table>
//                                         <TableHead>
//                                             <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                                                 <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
//                                                 <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
//                                                 <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
//                                             </TableRow>
//                                         </TableHead>
//                                         <TableBody>
//                                             {users[userType]?.map((user: any) => (
//                                                 <TableRow key={user._id} hover>
//                                                     <TableCell>{user._id}</TableCell>
//                                                     <TableCell>{user.fullName}</TableCell>
//                                                     <TableCell>{user.email}</TableCell>
//                                                 </TableRow>
//                                             ))}
//                                         </TableBody>
//                                     </Table>
//                                 </TableContainer>
//                             ))
//                         ) : (
//                             <Typography variant="h6" sx={{ p: 2, textAlign: 'center', fontStyle: 'italic' }}>No active users available</Typography>
//                         )}
//                     </Grid>
//                 </Grid>
//             )}
//         </Box>
//     );
// };

// export default ActiveUsers;


'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import apiRequest from '../../../utils/axios';
import endPoints from '../../../../src/constant/apiEndpoint';
import {
    Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, CircularProgress, TablePagination
} from '@mui/material';

const ActiveUsers = () => {
    const [isLoader, setIsloader] = useState(false);
    const [activeUsers, setActiveUsers] = useState<any>({});
    const router = useRouter();

    // Pagination state for each user type
    const [page, setPage] = useState<{ [key: string]: number }>({});
    const [rowsPerPage, setRowsPerPage] = useState<{ [key: string]: number }>({});

    const fetchUserData = () => {
        setIsloader(true);
        const token = typeof window !== 'undefined' ? window.localStorage?.getItem('authToken') : null;

        if (!token) {
            router.push('/');
            setIsloader(false);
            return;
        }

        apiRequest.get(endPoints.GET_ACTIVE_USERS, { headers: { Authorization: `Bearer ${token}` } })
            .then((response: any) => {
                // setActiveUsers(response.data);
                setIsloader(false);
            })
            .catch((error: any) => {
                console.error("Error fetching active users:", error);
                setIsloader(false);
            });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const { totalActiveEmployees, totalActiveHRAdmins, totalActiveSupervisors, users } = activeUsers;

    // Handle page change
    const handleChangePage = (userType: string, newPage: number) => {
        setPage((prev) => ({ ...prev, [userType]: newPage }));
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (userType: string, event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage((prev) => ({ ...prev, [userType]: parseInt(event.target.value, 10) }));
        setPage((prev) => ({ ...prev, [userType]: 0 })); // Reset to first page
    };

    return (
        <Box sx={{ p: 3, backgroundColor: '#ffff', minHeight: '100vh' }}>
            {isLoader ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {/* Summary Cards */}
                    {[
                        { title: "Total Active Employees", value: totalActiveEmployees, color: "#42a5f5" },
                        { title: "Total Active HR-Admins", value: totalActiveHRAdmins, color: "#66bb6a" },
                        { title: "Total Active Supervisors", value: totalActiveSupervisors, color: "#ffa726" }
                    ].map((stat, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2, textAlign: 'center', bgcolor: stat.color, color: 'white' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 500 }}>{stat.title}</Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{stat.value || 0}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}

                    {/* Users Table with Pagination */}
                    <Grid item xs={12}>
                        {users && Object.keys(users).length > 0 ? (
                            Object.keys(users).map((userType) => {
                                const currentPage = page[userType] || 0;
                                const currentRowsPerPage = rowsPerPage[userType] || 5; // Default rows per page
                                const paginatedUsers = users[userType]?.slice(
                                    currentPage * currentRowsPerPage,
                                    currentPage * currentRowsPerPage + currentRowsPerPage
                                );

                                return (
                                    <TableContainer component={Paper} key={userType} sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
                                        <Typography variant="h6" sx={{ p: 2, backgroundColor: '#eeeeee', fontWeight: 600, borderBottom: '2px solid #ddd' }}>
                                            {userType}s
                                        </Typography>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Full Name</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {paginatedUsers?.map((user: any) => (
                                                    <TableRow key={user._id} hover>
                                                        <TableCell>{user._id}</TableCell>
                                                        <TableCell>{user.fullName}</TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            component="div"
                                            count={users[userType]?.length || 0}
                                            rowsPerPage={currentRowsPerPage}
                                            page={currentPage}
                                            onPageChange={(_, newPage) => handleChangePage(userType, newPage)}
                                            onRowsPerPageChange={(event) => handleChangeRowsPerPage(userType, event)}
                                        />
                                    </TableContainer>
                                );
                            })
                        ) : (
                            <Typography variant="h6" sx={{ p: 2, textAlign: 'center', fontStyle: 'italic' }}>
                                No active users available
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default ActiveUsers;

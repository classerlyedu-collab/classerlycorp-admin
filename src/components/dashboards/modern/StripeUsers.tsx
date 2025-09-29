// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
// } from "@mui/material";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import endPoints from "../../../../src/constant/apiEndpoint";

// const StripeUsers = ({ isloader, setIsloader }: any) => {
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//   const router = useRouter();
//   const [stripeUsers, setStripeUsers] = useState<any>({});
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const usersPerPage = 10;

//   const fetchUserData = async (retryCount = 0) => {
//     setIsloader(true);
//     setErrorMessage(null);
//     const token =
//       typeof window !== "undefined"
//         ? window.localStorage?.getItem("authToken")
//         : null;

//     if (!token) {
//       router.push("/");
//       setIsloader(false);
//       return;
//     }

//     try {
//       const response = await axios.get(
//         `${baseUrl}${endPoints.GET_STRIPE_DATA}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setStripeUsers(response.data);
//       localStorage.setItem("stripeData", JSON.stringify(response.data)); // Cache data
//       setIsloader(false);
//     } catch (error: any) {
//       if (error?.response?.status === 429 && retryCount < 3) {
//         const delay = Math.pow(2, retryCount) * 1000;
//         console.warn(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);
//         setTimeout(() => fetchUserData(retryCount + 1), delay);
//         return;
//       }

//       setIsloader(false);
//       setErrorMessage("Failed to load Stripe data. Please try again later.");
//       console.error("fetchUserData error:", error);
//     }
//   };

//   useEffect(() => {
//     const cachedData = localStorage.getItem("stripeData");
//     if (cachedData) {
//       setStripeUsers(JSON.parse(cachedData));
//     }
//     fetchUserData();
//   }, []);

//   const { total_customers, total_subscriptions, total_revenue, subscriptions } =
//     stripeUsers || {};

//   // Pagination logic
//   const startIndex = (currentPage - 1) * usersPerPage;
//   const endIndex = startIndex + usersPerPage;
//   const currentUsers = subscriptions?.slice(startIndex, endIndex) || [];

//   return (
//     <div>
//       {errorMessage ? (
//         <Typography color="error">{errorMessage}</Typography>
//       ) : (
//         <>
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={4}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6">Total Customers</Typography>
//                   <Typography variant="h4">{total_customers ?? "N/A"}</Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6">Total Subscriptions</Typography>
//                   <Typography variant="h4">{total_subscriptions ?? "N/A"}</Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6">Total Revenue</Typography>
//                   <Typography variant="h4">${total_revenue ?? "N/A"}</Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>

//           <TableContainer component={Paper} sx={{ marginTop: 3 }}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Customer</TableCell>
//                   <TableCell>Email</TableCell>
//                   <TableCell>Subscription ID</TableCell>
//                   <TableCell>Plan</TableCell>
//                   <TableCell>Amount</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell>Invoice</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {currentUsers.length > 0 ? (
//                   currentUsers.map((sub: any) => (
//                     <TableRow key={sub.subscription_id}>
//                       <TableCell>{sub.customer_id}</TableCell>
//                       <TableCell>{sub.customer_email}</TableCell>
//                       <TableCell>{sub.subscription_id}</TableCell>
//                       <TableCell>{sub.plan_name}</TableCell>
//                       <TableCell>${sub.price}</TableCell>
//                       <TableCell>{sub.status}</TableCell>
//                       <TableCell>
//                         {sub.invoice_pdf ? (
//                           <a
//                             href={sub.invoice_pdf}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             View Invoice
//                           </a>
//                         ) : (
//                           "No Invoice"
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={7} align="center">
//                       No subscriptions found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Pagination Controls */}
//           <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
//             <Button
//               variant="contained"
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((prev) => prev - 1)}
//               sx={{ marginRight: 2 }}
//             >
//               Previous
//             </Button>
//             <Typography variant="h6" sx={{ marginX: 2 }}>
//               Page {currentPage}
//             </Typography>
//             <Button
//               variant="contained"
//               disabled={endIndex >= (subscriptions?.length || 0)}
//               onClick={() => setCurrentPage((prev) => prev + 1)}
//             >
//               Next
//             </Button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default StripeUsers;

"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import endPoints from "../../../../src/constant/apiEndpoint";

const StripeUsers = ({ isloader, setIsloader }: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const [stripeData, setStripeData] = useState<any>({});
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const fetchUserData = async () => {
    setIsloader(true);
    setErrorMessage(null);
    const token =
      typeof window !== "undefined"
        ? window.localStorage?.getItem("authToken")
        : null;

    if (!token) {
      router.push("/");
      setIsloader(false);
      return;
    }

    try {
      const response = await axios.get(
        `${baseUrl}${endPoints.GET_STRIPE_DATA}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStripeData(response.data);
      setSubscribers(response.data.paginated_subscribers);
      setNextCursor(response.data.next_starting_after || null);
      setPrevCursor(null);
      setHistory([]);
      setIsloader(false);
    } catch (error: any) {
      setIsloader(false);
      setErrorMessage("Failed to load Stripe data. Please try again later.");
      console.error("fetchUserData error:", error);
    }
  };

  const fetchNextPage = async () => {
    if (!nextCursor) return;
    setIsloader(true);
    const token = window.localStorage?.getItem("authToken");
    try {
      const response = await axios.get(
        `${baseUrl}${endPoints.GET_STRIPE_DATA}?starting_after=${nextCursor}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubscribers(response.data.paginated_subscribers);
      setHistory([...history, nextCursor]);
      setPrevCursor(nextCursor);
      setNextCursor(response.data.next_starting_after || null);
      setIsloader(false);
    } catch (error) {
      setIsloader(false);
      setErrorMessage("Failed to load more subscribers.");
    }
  };

  // const fetchPreviousPage = async () => {
  //   if (history.length === 0) return;
  //   setIsloader(true);
  //   const token = window.localStorage?.getItem("authToken");
  //   try {
  //     const lastCursor = history[history.length - 1];
  //     const response = await axios.get(
  //       `${baseUrl}${endPoints.GET_STRIPE_DATA}?starting_after=${lastCursor}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     setSubscribers(response.data.paginated_subscribers);
  //     setHistory(history.slice(0, -1));
  //     setNextCursor(lastCursor);
  //     setPrevCursor(history.length > 1 ? history[history.length - 2] : null);
  //     setIsloader(false);
  //   } catch (error) {
  //     setIsloader(false);
  //     setErrorMessage("Failed to load previous subscribers.");
  //   }
  // };


  const fetchPreviousPage = async () => {
    if (history.length === 0) return;
    setIsloader(true);
    const token = window.localStorage?.getItem("authToken");
    try {
      const lastCursor = history[history.length - 1]; // Get last visited cursor
      const newHistory = history.slice(0, -1); // Remove last item from history

      const response = await axios.get(
        `${baseUrl}${endPoints.GET_STRIPE_DATA}?ending_before=${lastCursor}`, // Use ending_before
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSubscribers(response.data.paginated_subscribers);
      setHistory(newHistory); // Update history
      setNextCursor(lastCursor); // Restore nextCursor for forward navigation
      setPrevCursor(newHistory.length > 0 ? newHistory[newHistory.length - 1] : null); // Adjust prevCursor

      setIsloader(false);
    } catch (error) {
      setIsloader(false);
      setErrorMessage("Failed to load previous subscribers.");
    }
  };


  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
      {errorMessage ? (
        <Typography color="error">{errorMessage}</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Monthly Revenue</Typography>
                  <Typography variant="h4">${stripeData.total_monthly_revenue ?? "N/A"}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Yearly Revenue</Typography>
                  <Typography variant="h4">${stripeData.total_yearly_revenue ?? "N/A"}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Monthly Subscribers</Typography>
                  <Typography variant="h4">{stripeData.total_monthly_subscribers ?? "N/A"}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Yearly Subscribers</Typography>
                  <Typography variant="h4">{stripeData.total_yearly_subscribers ?? "N/A"}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <TableContainer component={Paper} sx={{ marginTop: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Period End</TableCell>
                  <TableCell>Invoice</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscribers.length > 0 ? (
                  subscribers.map((sub) => (
                    <TableRow key={sub.subscription_id}>
                      <TableCell>{sub.customer_id}</TableCell>
                      <TableCell>{sub.customer_email}</TableCell>
                      <TableCell>{sub.plan_name}</TableCell>
                      <TableCell>{sub.amount}</TableCell>
                      <TableCell>{sub.status}</TableCell>
                      <TableCell>{new Date(sub.start_date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(sub.current_period_end).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {sub.invoice_pdf ? (
                          <a
                            href={sub.invoice_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Invoice
                          </a>
                        ) : (
                          "No Invoice"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No subscribers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <Button variant="contained" disabled={!prevCursor} onClick={fetchPreviousPage}>
              Previous
            </Button>
            <Button variant="contained" disabled={!nextCursor} onClick={fetchNextPage} style={{ marginLeft: 10 }}>
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StripeUsers;

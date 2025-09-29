import * as React from "react";
import Link from "next/link";
import {
  Grid,
  Box,
  Typography,
  Stack,
  FormGroup,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControlLabel,
} from "@mui/material";

import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

import PageContainer from "../../../src/components/container/PageContainer";
import Logo from "../../../src/layouts/full/shared/logo/Logo";
import AuthLogin from "../authForms/AuthLogin";
import CustomTextField from "../../../src/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../../src/components/forms/theme-elements/CustomFormLabel";
import CustomCheckbox from "../../../src/components/forms/theme-elements/CustomCheckbox";
import endPoints from "../../../src/constant/apiEndpoint";
import { useState } from "react";
import { useRouter } from "next/router";
import TypingAnimation from "../../../src/components/typingAnimation/TypingAnimation";
import apiRequest from "../../../src/utils/axios";

const Login = () => {
  const [isLoader, setIsloader] = React.useState(false);
  const router = useRouter();
  interface ILoginState {
    userName: string;
    password: string;
  }

  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const [state, setState] = useState<ILoginState>({ userName: "", password: "" });

  const _handleLogin = () => {
    setIsloader(true);
    apiRequest
      .post(endPoints.LOGIN, state)
      .then((response) => {
        console.log("Response ====>", response.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("userData", JSON.stringify(response.data));
          localStorage.setItem("authToken", response.data.token);
        }
        apiRequest.defaults.headers["Authorization"] = `Bearer ${response.data.token}`;
        router.replace("/app/dashboard");
        setIsloader(false);
      })
      .catch((error) => {
        console.error("Login error:", error);
        // Extract error message - error could be a string or an object
        const errorMessage = typeof error === 'string' ? error : error?.message || 'Login failed. Please try again.';
        setError(errorMessage);
        setOpen(true);
        setIsloader(false);
      });
  };

  return (
    <PageContainer>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Sorry, your login credentials were incorrect. Please try again.`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {error ?? 'Something went wrong! Try again later.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Grid
        container
        spacing={0}
        justifyContent="center"
        sx={{ height: "100vh" }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          lg={7}
          xl={8}
          sx={{
            position: "relative",
            backgroundColor: "#e0f7ff", // light green background color
            "&:before": {
              content: '""',
              background: "radial-gradient(circle, #b3e0ff, #cce7ff, #e6f7ff)",
              backgroundSize: "400% 400%",
              animation: "gradient 15s ease infinite",
              position: "absolute",
              height: "100%",
              width: "100%",
              opacity: "0.3",
            },
            display: { xs: "none", md: "block" },
          }}
        >
          <Box position="relative">
            <Box position="relative" display={{ xs: "none", md: "block" }} px={3}>
              <Logo />
            </Box>

            <TypingAnimation />

            <Box
              alignItems="center"
              justifyContent="center"
              height={"calc(100vh - 75px)"}
              sx={{
                display: {
                  xs: "none",
                  lg: "flex",
                },
              }}
            >
              <img
                src={"/images/backgrounds/welcome-bg2.png"}
                alt="bg"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                }}
              />
            </Box>


          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          lg={5}
          xl={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            background: "#fffffa", // Half white background
            height: "100vh", // Full height of the viewport
          }}
        >
          <Box
            p={4}
            sx={{
              background: "#ffff",
              borderRadius: "8px", // Rounded corners
              boxShadow: 6, // Shadow effect
            }}
          >
            <Box display="flex" justifyContent="center" mb={2}>
              <AdminPanelSettingsIcon
                sx={{ fontSize: 110, color: "primary.main" }}
              />
            </Box>

            <AuthLogin
              title=""
              subtext={
                <Typography variant="subtitle1" color="textSecondary" mb={1}>
                </Typography>
              }
              childern={
                <>
                  <Box>
                    <CustomFormLabel htmlFor="username">Username</CustomFormLabel>
                    <CustomTextField
                      id="username"
                      variant="outlined"
                      fullWidth
                      placeholder={"Enter Username"}
                      value={state.userName}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setState({ ...state, userName: event.target.value })
                      }
                    />
                  </Box>
                  <Box>
                    <CustomFormLabel htmlFor="password">
                      Password
                    </CustomFormLabel>
                    <CustomTextField
                      id="password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      placeholder={"Enter Password"}
                      value={state.password}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setState({ ...state, password: event.target.value })
                      }
                    />
                  </Box>
                  <Stack
                    justifyContent="space-between"
                    direction="row"
                    alignItems="center"
                    my={2}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={<CustomCheckbox defaultChecked />}
                        label="Remember this Device"
                      />
                    </FormGroup>
                    <Typography
                      component={Link}
                      href="/auth/forgot-password"
                      fontWeight="500"
                      sx={{
                        textDecoration: "none",
                        color: "primary.main",
                      }}
                    >
                      Forgot Password ?
                    </Typography>
                  </Stack>
                  <Box>
                    <Button
                      color="primary"
                      variant="contained"
                      size="large"
                      fullWidth
                      component={Link}
                      onClick={() => _handleLogin()}
                      href=""
                      type="submit"
                    >
                      Sign In
                    </Button>
                  </Box>
                </>
              }
            />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

Login.layout = "Blank";
export default Login;

import {
  Grid,
  Box,
  Typography,
  Button,
  Avatar,
  Stack,
  CardMedia,
  styled,
  Fab,
} from "@mui/material";

import BlankCard from "../../../shared/BlankCard";
import React from "react";

const ProfileBanner = () => {
  const ProfileImage = styled(Box)(() => ({
    backgroundImage: "linear-gradient(#50b2fc,#f44c66)",
    borderRadius: "50%",
    width: "110px",
    height: "110px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  // getting user data
  interface UserData {
    [key: string]: any;
  }

  const getUserData = (): UserData => {
    if (typeof window !== "undefined") {
      const usrData = typeof window !== "undefined" ? window.localStorage.getItem("userData") : null;
      return usrData ? JSON.parse(usrData) : {};
    }
    return {};
  };

  const initialUserData: UserData = getUserData();
  const [userData, setUserData] = React.useState<UserData>(initialUserData);
  console.log(userData);

  return (
    <>
      <BlankCard>
        <CardMedia
          component="img"
          image={"/images/backgrounds/profilebg.jpg"}
          alt={"profilecover"}
          width="100%"
        />
        <Grid container spacing={0} justifyContent="center" alignItems="center">
          {/* Post | Followers | Following */}
          <Grid
            item
            lg={4}
            sm={12}
            md={5}
            xs={12}
            sx={{
              order: {
                xs: "2",
                sm: "2",
                lg: "1",
              },
            }}
          ></Grid>
          <Grid
            item
            lg={4}
            sm={12}
            xs={12}
            sx={{
              order: {
                xs: "1",
                sm: "1",
                lg: "2",
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              textAlign="center"
              justifyContent="center"
              sx={{
                mt: "-85px",
              }}
            >
              <Box>
                <ProfileImage>
                  <Avatar
                    src={"/images/profile/user-2.jpg"}
                    alt="profileImage"
                    sx={{
                      borderRadius: "50%",
                      width: "100px",
                      height: "100px",
                      border: "4px solid #fff",
                    }}
                  />
                </ProfileImage>
                <Box mt={1}>
                  <Typography fontWeight={600} variant="h5">
                    {userData.name}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          {/* friends following buttons */}
          <Grid
            item
            lg={4}
            sm={12}
            xs={12}
            sx={{
              order: {
                xs: "3",
                sm: "3",
                lg: "3",
              },
            }}
          ></Grid>
        </Grid>
        {/**TabbingPart**/}
        <Box sx={{ height: "15px" }}></Box>
      </BlankCard>
    </>
  );
};

export default ProfileBanner;

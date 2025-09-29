import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
} from "@mui/material";

import { IconMail } from "@tabler/icons-react";
import { Stack } from "@mui/system";
import { useRouter } from "next/router";

const Profile = () => {
  const router = useRouter();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  // getting user data
  interface UserData {
    [key: string]: any;
  }

  const getUserData = (): UserData => {
    if (typeof window !== "undefined") {
      const usrData = localStorage.getItem("userData");
      return usrData ? JSON.parse(usrData) : {};
    }
    return {};
  };

  const initialUserData: UserData = getUserData();
  const [userData, setUserData] = useState<UserData>(initialUserData);

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={"/images/profile/user-1.jpg"}
          alt={"ProfileImg"}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "360px",
            p: 4,
          },
        }}
      >
        <Typography variant="h5">Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center"></Stack>
        <Box>
          <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
            {userData?.fullName}
          </Typography>

          <Typography
            variant="subtitle2"
            color="textSecondary"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <IconMail width={15} height={15} />
            {userData?.email}
          </Typography>
        </Box>
        <Divider />

        <Box mt={2}>
          <Button
            href=""
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('userData');
              }
              router.replace('/')
            }}
            variant="outlined"
            color="primary"
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;

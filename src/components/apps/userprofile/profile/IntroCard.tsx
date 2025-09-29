import { Stack, Typography } from "@mui/material";
import * as React from "react";
import ChildCard from "../../../../components/shared/ChildCard";
import {
  IconBriefcase,
  IconDeviceDesktop,
  IconMail,
  IconMapPin,
} from "@tabler/icons-react";

const IntroCard = () => {
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
  return (
    <ChildCard>
      <Typography fontWeight={600} variant="h4" mb={2}>
        Introduction
      </Typography>

      <Stack direction="row" gap={2} alignItems="center" mb={3}>
        <IconMail size="21" />
        <Typography variant="h6">{userData.email}</Typography>
      </Stack>

      <Stack direction="row" gap={2} alignItems="center" mb={1}>
        <IconMapPin size="21" />
        <Typography variant="h6">Newyork, USA - 100001</Typography>
      </Stack>
    </ChildCard>
  );
};

export default IntroCard;

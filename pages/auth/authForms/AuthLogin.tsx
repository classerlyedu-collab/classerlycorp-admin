import { Box, Typography, Stack, Divider } from "@mui/material";
import Link from "next/link";
import { loginType } from "../../../src/types/auth/auth";

const AuthLogin = ({ title, subtitle, subtext, childern }: loginType) => (
  <>
    {title ? (
      <Typography fontWeight="700" variant="h3" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}

    <Stack>{childern}</Stack>

    {subtitle}
  </>
);

export default AuthLogin;

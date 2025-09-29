import * as React from "react";
import { Snackbar, Alert, AlertTitle } from "@mui/material";

const Welcome = () => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (reason: any) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleClick();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <React.Fragment>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={Number(process.env.NEXT_PUBLIC_AUTO_HIDE_DURATION) || 5000}
        onClose={handleClose}
        sx={{
          mt: 5, // Adjust this value as needed to position below the profile
          mr: 2, // Optional: Adjust to align with the right margin of your profile section
        }}
      >
        <Alert
          onClose={handleClose}
          severity="info"
          variant="filled"
          sx={{ width: "100%", color: "white" }}
        >
          <AlertTitle>Welcome To Classerly Admin Panel.</AlertTitle>
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Welcome;

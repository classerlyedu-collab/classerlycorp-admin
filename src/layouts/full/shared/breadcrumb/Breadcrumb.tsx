import React from "react";
import { Grid, Typography, Box, Breadcrumbs, Theme } from "@mui/material";
import NextLink from "next/link";

import { IconCircle, IconPlus } from "@tabler/icons-react";
import Image from "next/image";

interface BreadCrumbType {
  subtitle?: string;
  items?: any[];
  title: string;
  addBtn?: string;
  addBtnHREF?: string;
  isBtn?: boolean;
  addBtnClick?: () => void;  // addBtnClick function
  triggerFunction?: boolean;
}

const Breadcrumb = ({
  subtitle,
  items,
  title,
  addBtn,
  addBtnHREF,
  isBtn,
  addBtnClick,
  triggerFunction
}: BreadCrumbType) => (
  <Grid
    container
    sx={{
      backgroundColor: "primary.light",
      borderRadius: (theme: Theme) => theme.shape.borderRadius / 4,
      p: "30px 25px 20px",
      marginBottom: "30px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <Grid item xs={12} sm={6} lg={8} mb={1}>
      <Typography variant="h4">{title}</Typography>
      <Typography
        color="textSecondary"
        variant="h6"
        fontWeight={400}
        mt={0.8}
        mb={0}
      >
        {subtitle}
      </Typography>
      <Breadcrumbs
        separator={
          <IconCircle
            size="5"
            fill="textSecondary"
            fillOpacity={"0.6"}
            style={{ margin: "0 5px" }}
          />
        }
        sx={{ alignItems: "center", mt: items ? "10px" : "" }}
        aria-label="breadcrumb"
      >
        {items
          ? items.map((item) => (
              <div key={item.title}>
                {item.to ? (
                  <NextLink href={item.to} passHref>
                    <Typography color="textSecondary">{item.title}</Typography>
                  </NextLink>
                ) : (
                  <Typography color="textPrimary">{item.title}</Typography>
                )}
              </div>
            ))
          : ""}
      </Breadcrumbs>
    </Grid>
    <Grid item xs={12} sm={6} lg={4} display="flex" alignItems="flex-end">
      <Box
        sx={{
          display: { xs: "none", md: "block", lg: "flex" },
          alignItems: "center",
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        {isBtn && (
          <Box sx={{ top: "0px" }}>
            {/* Conditional rendering: if addBtnClick is provided, use it; else use NextLink */}
            {triggerFunction ? (
              <Box
                onClick={addBtnClick}
                sx={{
                  backgroundColor: "blue",
                  padding: "10px",
                  cursor: "pointer",
                }}
              >
                <Typography color={"white"}>{addBtn}</Typography>
              </Box>
            ) : (
              <NextLink href={addBtnHREF || "#"} passHref>
                <Box
                  sx={{
                    backgroundColor: "blue",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                >
                  <Typography color={"white"}>{addBtn}</Typography>
                </Box>
              </NextLink>
            )}
          </Box>
        )}
      </Box>
    </Grid>
  </Grid>
);

export default Breadcrumb;
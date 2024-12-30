// src/components/DashboardPage.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import MultiSelectWithSelectAll from "../components/MultiSelectWithSelectAll";
  

const AllPointPage: React.FC = () => {

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dust Measurements
      </Typography>
      <MultiSelectWithSelectAll />
    </Box>
  );
};

export default AllPointPage;

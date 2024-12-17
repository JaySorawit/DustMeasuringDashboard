import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ListPage from "./pages/ListPage";
import { Box, Button } from "@mui/material";

const App: React.FC = () => {
  return (
    <Router>
      <Box display="flex" justifyContent="center" mb={2}>
        <Button component={Link} to="/" variant="contained" sx={{ mx: 1 }}>
          Dashboard
        </Button>
        <Button component={Link} to="/list" variant="contained" sx={{ mx: 1 }}>
          Data List
        </Button>
      </Box>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/list" element={<ListPage />} />
      </Routes>
    </Router>
  );
};

export default App;

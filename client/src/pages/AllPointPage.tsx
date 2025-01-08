import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import FilterBar from "../components/FilterBar";
import dayjs from "dayjs";
import { DustMeasurement } from "../types/types";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AllPointPage: React.FC = () => {
  const dustTypes = [0.3, 0.5]; // Only 0.3 and 0.5
  const [filteredData, setFilteredData] = useState<DustMeasurement[]>([]);
  const startDate = dayjs().subtract(1, "day").startOf("day"); // 1 day ago
  const endDate = dayjs().endOf("day"); // End of the current day  
  const [currentPage, setCurrentPage] = useState(0); // Page state for pagination
  const locationsPerPage = 10;

  // Group data by dust type (0.3 and 0.5)
  const dustTypeData = dustTypes.map((dustType) => {
    return filteredData
      .filter((data) => data.dust_type === dustType)
      .map((data) => data.dust_value);
  });

  // Get unique location IDs
  const locationIds = Array.from(new Set(filteredData.map((data) => data.location_id)));

  // Get the current set of locations for the page
  const paginatedLocationIds = locationIds.slice(currentPage * locationsPerPage, (currentPage + 1) * locationsPerPage);

  // Prepare chart data for the current page
  const chartData = {
    labels: paginatedLocationIds, // x-axis: Location IDs for current page
    datasets: dustTypes.map((dustType, index) => ({
      label: `Dust Type ${dustType}`,
      data: dustTypeData[index].slice(currentPage * locationsPerPage, (currentPage + 1) * locationsPerPage), // Dust value for each location
      backgroundColor: dustType === 0.3 ? "rgba(255, 99, 132, 0.5)" : "rgba(75, 192, 192, 0.5)", // Red for 0.3, Green for 0.5
      borderColor: dustType === 0.3 ? "rgba(255, 99, 132, 1)" : "rgba(75, 192, 192, 1)", // Red for 0.3, Green for 0.5
      borderWidth: 1,
    })),
  };

  // Handle next and previous page clicks
  const handleNextPage = () => {
    if ((currentPage + 1) * locationsPerPage < locationIds.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dust Measurements
      </Typography>
      <FilterBar
        dustTypes={dustTypes}
        onFilter={(filteredData) => setFilteredData(filteredData)}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />

      <Box sx={{ height: "400px", width: "100%" }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Dust Value by Location and Dust Type" },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Location ID", // Label for x-axis
                },
                stacked: false,
              },
              y: {
                title: {
                  display: true,
                  text: "Dust Value", // Label for y-axis
                },
                beginAtZero: true,
              },
            },
          }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button onClick={handlePrevPage} disabled={currentPage === 0}>
          Previous
        </Button>
        <Button onClick={handleNextPage} disabled={(currentPage + 1) * locationsPerPage >= locationIds.length}>
          Next
        </Button>
      </Box>

{/* <Typography variant="h6" gutterBottom>
  filteredData = {JSON.stringify(filteredData)}
</Typography> */}
    </Box>
  );
};

export default AllPointPage;

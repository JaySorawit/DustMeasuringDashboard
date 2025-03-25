import { Box, Typography } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import API_BASE_URL from "../configs/apiConfig";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem: any) {
          const dataset = tooltipItem.dataset;
          const count = dataset.data[tooltipItem.dataIndex];
          const label = dataset.labels[tooltipItem.dataIndex];
          const locationCount = dataset.locationCounts[tooltipItem.dataIndex];
          const percentage = ((count / dataset.totalLocations) * 100).toFixed(2);

          return `${label}: ${percentage}% (${locationCount} locations)`;
        },
      },
    },
  },
};

export default function PieChart() {
  const [pieChartData, setPieChartData] = useState<any>(null);

  const fetchDustMeasurementData = async () => {
    try {
      const startDate = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
      const endDate = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");

      const response = await axios.post(`${API_BASE_URL}/api/dust-measurements/date-range`, {
        startDate,
        endDate,
      });

      const data = response.data;

      // Create an object to store the maximum count per location
      const locationCounts: { [key: string]: number } = {};

      // Loop through the data and determine the max count per location
      data.forEach((measurement: any) => {
        const locationKey = `${measurement.room}-${measurement.area}-${measurement.location_name}`;
        if (!locationCounts[locationKey] || measurement.count > locationCounts[locationKey]) {
          locationCounts[locationKey] = measurement.count;
        }
      });

      // Now calculate the number of times each count occurred across all locations
      const count1 = Object.values(locationCounts).filter((count) => count === 1).length;
      const count2 = Object.values(locationCounts).filter((count) => count === 2).length;
      const count3 = Object.values(locationCounts).filter((count) => count === 3).length;

      const totalLocations = count1 + count2 + count3; // Total locations measured

      // Calculate percentages for each category
      const percentage1 = (count1 / totalLocations) * 100;
      const percentage2 = (count2 / totalLocations) * 100;
      const percentage3 = (count3 / totalLocations) * 100;

      // Create the chart data with both percentages and location counts
      setPieChartData({
        labels: ["Count 1", "Count 2", "Count 3"],
        datasets: [
          {
            label: "Dust Measurement Count",
            data: [percentage1, percentage2, percentage3],
            backgroundColor: ["#4CAF50", "#FF9800", "#F44336"],
            hoverOffset: 4,
            locationCounts: [count1, count2, count3], // Store actual count of locations for each segment
            totalLocations: totalLocations, // Store the total number of locations
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch dust measurement data:", error);
    }
  };

  useEffect(() => {
    fetchDustMeasurementData(); // Fetch data when the component is mounted

    // Auto-refresh every 10 seconds to keep the data updated
    const interval = setInterval(fetchDustMeasurementData, 10000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <Box sx={{ width: "400px", height: "300px", backgroundColor: "white", borderRadius: "8px", padding: "1rem", alignItems: "center", display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" align="center">
        Dust measurement count of today
      </Typography>
      {pieChartData ? <Pie data={pieChartData} options={options} width={200} /> : <Typography>Loading...</Typography>}
    </Box>
  );
}

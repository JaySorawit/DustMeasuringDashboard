// src/components/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import Filters from "../components/FilterPanel";
import { Box, CircularProgress, Typography } from "@mui/material";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
import Test from "../components/test";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  

interface DustMeasurement {
  measurement_date: string;
  measurement_time: string;
  location_id: string;
  dust_value: number;
  dust_type: string;
}

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DustMeasurement[]>([]);
  const [filteredData, setFilteredData] = useState<DustMeasurement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  interface Filters {
    selectedLocations?: string[];
    selectedDustTypes?: string[];
    startDate?: string;
    endDate?: string;
  }

  const [filters, setFilters] = useState<Filters>({});

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/dust-measurements/");
        setData(response.data as DustMeasurement[]);
        setFilteredData(response.data as DustMeasurement[]); // Initialize filtered data with all data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    const applyFilters = () => {
      const { selectedLocations, selectedDustTypes, startDate, endDate } = filters;

      const filtered = data.filter((item) => {
        const matchesLocation =
          !selectedLocations || selectedLocations.length === 0 || selectedLocations.includes(item.location_id);
        const matchesDustType =
          !selectedDustTypes || selectedDustTypes.length === 0 || selectedDustTypes.includes(item.dust_type);
        const matchesDate =
          (!startDate || new Date(item.measurement_date) >= new Date(startDate)) &&
          (!endDate || new Date(item.measurement_date) <= new Date(endDate));
        return matchesLocation && matchesDustType && matchesDate;
      });

      setFilteredData(filtered);
    };

    applyFilters();
  }, [filters, data]);

  const chartData = {
    labels: filteredData.map((d) => `${d.measurement_date} ${d.measurement_time}`),
    datasets: [
      {
        label: "Dust Values",
        data: filteredData.map((d) => d.dust_value),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Test />
      <Filters
        locations={[...new Set(data.map((item) => item.location_id))]}
        dustTypes={[...new Set(data.map((item) => item.dust_type))]}
        onFilterChange={(newFilters) => setFilters(newFilters)}
      />
      {filteredData.length > 0 ? (
        <Bar data={chartData} />
      ) : (
        <Typography variant="h6" align="center" mt={4}>
          No data available for the selected filters.
        </Typography>
      )}
    </Box>
  );
};

export default DashboardPage;

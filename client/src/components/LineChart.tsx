import { Box, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import API_BASE_URL from "../configs/apiConfig";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Trend of UCL Exceedances Over the Last 7 Days",
    },
  },
};

export default function LineChart() {
  const [chartData, setChartData] = useState<any>(null);

  const fetchExceedancesData = async () => {
    try {
      const startDate = dayjs().subtract(7, 'days').startOf('day').format("YYYY-MM-DD HH:mm:ss");
      const endDate = dayjs().endOf('day').format("YYYY-MM-DD HH:mm:ss");

      const response = await axios.post(`${API_BASE_URL}/api/dust-measurements/date-range`, {
        startDate,
        endDate,
      });

      const data = response.data;
      
      // Calculate exceedances per day
      const exceedancesPerDay: number[] = Array(7).fill(0); // Array for 7 days
      const labels = Array(7).fill('').map((_, index) => {
        return dayjs().subtract(6 - index, 'days').format("YYYY-MM-DD"); // Format dates for labels
      });

      data.forEach((dust: any) => {
        const dustDate = dayjs(dust.timestamp).startOf('day').format("YYYY-MM-DD");
        const today = dayjs().format("YYYY-MM-DD");

        if (dust.alarm_high === 1) {
          // Find the difference in days
          const dayDifference = dayjs(today).diff(dustDate, 'day');
          if (dayDifference >= 0 && dayDifference < 7) {
            exceedancesPerDay[6 - dayDifference] += 1; // Increment the count for the specific day
          }
        }
      });

      // Prepare the chart data
      setChartData({
        labels: labels, // Display actual dates
        datasets: [
          {
            label: "UCL Exceedances",
            data: exceedancesPerDay,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.4,
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch exceedance data:", error);
    }
  };

  useEffect(() => {
    fetchExceedancesData(); // Fetch data when the component is mounted

    // Auto-refresh every 10 seconds to keep the data updated
    const interval = setInterval(fetchExceedancesData, 10000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <Box sx={{ width: "630px", height: "400px", backgroundColor: "white", borderRadius: "8px", padding: "2rem", marginX: "1rem" }}>
      <Typography variant="h5">Trend of UCL Exceedances Over the Last 7 Days</Typography>
      {chartData ? <Line data={chartData} options={options} /> : <Typography>Loading...</Typography>}
    </Box>
  );
}

import { Card, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Mock Data for Dust Trend
const mockData = {
  today: [
    { location: 'Location 1', dust: 50 },
    { location: 'Location 2', dust: 70 },
    { location: 'Location 3', dust: 40 },
    { location: 'Location 4', dust: 80 },
    { location: 'Location 5', dust: 60 },
  ],
  pastWeek: [
    { location: 'Location 1', dust: 55 },
    { location: 'Location 2', dust: 65 },
    { location: 'Location 3', dust: 50 },
    { location: 'Location 4', dust: 75 },
    { location: 'Location 5', dust: 65 },
  ],
};

// Chart.js Data Structure
const chartData = {
  labels: mockData.today.map((entry) => entry.location), // Locations as labels on the X-axis
  datasets: [
    {
      label: 'Today',
      data: mockData.today.map((entry) => entry.dust), // Dust values for today
      borderColor: '#00aaff', // Line color for today
      backgroundColor: 'rgba(0, 170, 255, 0.2)', // Fill color for today
      fill: true, // Fill under the line
      tension: 0.3, // Smoothness of the line
    },
    {
      label: 'Past Week Trend',
      data: mockData.pastWeek.map((entry) => entry.dust), // Dust values for past week
      borderColor: '#ff6600', // Line color for past week
      backgroundColor: 'rgba(255, 102, 0, 0.2)', // Fill color for past week
      fill: true, // Fill under the line
      tension: 0.3, // Smoothness of the line
    },
  ],
};

function DustTrend() {
  return (
    <Card sx={{ backgroundColor: '#f9f9f9', p: 3 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Dust Trend
      </Typography>

      {/* Chart */}
      <Line data={chartData} options={{ responsive: true }} />
    </Card>
  );
}

export default DustTrend;

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DustChartProps {
    data: {
        measurement_date: string;
        measurement_time: string;
        location_id: string;
        dust_value: number;
        dust_type: string 
    }[];
    loading: boolean;
}

const DustChart: React.FC<DustChartProps> = ({ data }) => {
    const chartData = {
        labels: data.map((item) => `${item.measurement_date} ${item.measurement_time}`),
        datasets: [
            {
                label: 'Dust Value',
                data: data.map((item) => item.dust_value),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    return (
        <div>
            <h3>Dust Value Over Time</h3>
            <Line 
                data={chartData} 
                options={{ responsive: true }} 
                height={400}
                width={600}
                redraw={false}
                onPointerOverCapture={() => {}}
                onPointerOutCapture={() => {}}
            />
        </div>
    );
};

export default DustChart;

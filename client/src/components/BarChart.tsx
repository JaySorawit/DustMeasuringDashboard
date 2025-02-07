import React, { useRef } from "react";
import { Chart } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    fetchData: any[];
    dustType: number;
}

const BarChart: React.FC<BarChartProps> = ({ fetchData, dustType }) => {
    const chartRef = useRef<any>(null);
    const dustTypeKey = `um${(dustType * 10).toFixed(0).padStart(2, "0")}`;

    const filteredData = fetchData
    .map((data) => ({
        count: data.count,
        value: data[dustTypeKey] ?? 0,
    }));

    filteredData.sort((a, b) => a.count - b.count);

    const chartData = {
        labels: filteredData.map((d) => d.count),
        datasets: [
            {
                label: `Dust Value (${dustTypeKey})`,
                data: filteredData.map((d) => d.value),
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

 

    return (
        <div style={{ display: "flex", justifyContent: "center", height: "400px" }}>
            <Chart
                ref={chartRef}
                type="bar"
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        legend: { position: "top" },
                        title: { display: true, text: "Dust value for each count" },
                    },
                    scales: {
                        x: {
                            title: { display: true, text: "Count" },
                            ticks: { stepSize: 1 },
                        },
                        y: {
                            title: { display: true, text: "Dust Value" },
                            beginAtZero: true,
                        },
                    },
                }}
            />
        </div>
    );
};

export default BarChart;

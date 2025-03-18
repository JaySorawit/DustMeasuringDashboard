import React, { useRef, useState } from "react";
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
import annotationPlugin from "chartjs-plugin-annotation";
import { Button } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

interface BarChartProps {
    fetchData: any[];
    dustType: number;
    room: string;
    roomLimits: { [key: string]: { [key: string]: number } };
}

const BarChart: React.FC<BarChartProps> = ({ fetchData, dustType, room, roomLimits }) => {
    const chartRef = useRef<any>(null);
    const [showUSL, setShowUSL] = useState(true);
    const [showUCL, setShowUCL] = useState(true);
    
    const dustTypeKey = `um${(dustType * 10).toFixed(0).padStart(2, "0")}`;
    const dustTypeLabel = (dustType * 10).toFixed(0).padStart(2, "0");

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

    const annotations: any = [];

    if (showUSL && roomLimits[room]) {
        const uslKey = `usl${dustTypeLabel}`;
        if (roomLimits[room][uslKey] !== undefined) {
            annotations.push({
                type: "line",
                mode: "horizontal",
                scaleID: "y",
                value: roomLimits[room][uslKey],
                borderColor: "red",
                borderWidth: 2,
                label: {
                    content: `USL (${room})`,
                    enabled: true,
                    position: "end",
                    backgroundColor: "red",
                    font: { size: 12 },
                },
            });
        }
    }

    if (showUCL && roomLimits[room]) {
        const uclKey = `ucl${dustTypeLabel}`;
        if (roomLimits[room][uclKey] !== undefined) {
            annotations.push({
                type: "line",
                mode: "horizontal",
                scaleID: "y",
                value: roomLimits[room][uclKey],
                borderColor: "blue",
                borderWidth: 2,
                label: {
                    content: `UCL (${room})`,
                    enabled: true,
                    position: "end",
                    backgroundColor: "blue",
                    font: { size: 12 },
                },
            });
        }
    }

    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", height: "250px" }}>
                <Chart
                    ref={chartRef}
                    type="bar"
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: "top" },
                            title: { display: true, text: "Dust Value for each count" },
                            annotation: {
                                annotations,
                            },
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
            <div style={{ justifyContent: "center", display: "flex" }}>
                <Button
                    variant="outlined"
                    startIcon={<CircleIcon />}
                    color={showUSL ? "error" : "inherit"}
                    onClick={() => setShowUSL(!showUSL)}
                    style={{ marginRight: "10px" }}
                >
                    USL
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<CircleIcon />}
                    color={showUCL ? "primary" : "inherit"}
                    onClick={() => setShowUCL(!showUCL)}
                >
                    UCL
                </Button>
            </div>
        </>
    );
};

export default BarChart;

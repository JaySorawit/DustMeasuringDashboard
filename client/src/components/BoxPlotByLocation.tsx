import React, { useState } from "react";
import { Chart } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    ChartConfiguration,
} from "chart.js";
import { BoxPlotController, BoxAndWiskers } from "@sgratzl/chartjs-chart-boxplot";
import annotationPlugin from "chartjs-plugin-annotation";
import { Button } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';

// Register necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BoxPlotController, BoxAndWiskers, Title, Tooltip, Legend, annotationPlugin);

interface BoxPlotProps {
    fetchData: any[];
    room: string[];
    dustType: number;
    roomLimits: { [key: string]: { [key: string]: number } };
}

const ITEMS_PER_PAGE = 20;

const BoxPlotByLocation: React.FC<BoxPlotProps> = ({ fetchData, room, dustType, roomLimits }) => {
    const [showUSL, setShowUSL] = useState(true);
    const [showUCL, setShowUCL] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    const dustTypeKey = `um${(dustType * 10).toFixed(0).padStart(2, "0")}`;
    const dustTypeLabel = `${(dustType * 10).toFixed(0).padStart(2, "0")}`;

    // Filter and group data based on the provided rooms and dust type
    const filteredData = fetchData
        .filter(
            (data) =>
                room.map((r) => r.toLowerCase().trim()).includes(data.room.toLowerCase().trim()) &&
                data[dustTypeKey] !== undefined
        )
        .map((data) => ({
            location: data.location_name,
            value: data[dustTypeKey],
        }));

    const groupedData = filteredData.reduce((acc: { [key: string]: number[] }, curr) => {
        if (!acc[curr.location]) acc[curr.location] = [];
        acc[curr.location].push(curr.value);
        return acc;
    }, {});

    const locations = Object.keys(groupedData).sort((a, b) => a.padStart(3, '0').localeCompare(b.padStart(3, '0')));
    const paginatedLocations = locations.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
    const paginatedValues = paginatedLocations.map((location) => groupedData[location]);

    const chartData: ChartConfiguration<"boxplot">["data"] = {
        labels: paginatedLocations,
        datasets: [
            {
                label: `Dust Type ${dustType} (${room.join(", ")})`,
                data: paginatedValues,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    // Define annotations for USL and UCL dynamically based on the selected rooms
    const annotations: any = [];

    if (showUSL) {
        room.forEach((r) => {
            if (roomLimits[r] && roomLimits[r][`usl${dustTypeLabel}`] !== undefined) {
                annotations.push({
                    type: "line",
                    mode: "horizontal",
                    scaleID: "y",
                    value: roomLimits[r][`usl${dustTypeLabel}`],
                    borderColor: "red",
                    borderWidth: 2,
                    label: {
                        content: `USL (${r})`,
                        enabled: true,
                        position: "end",
                        backgroundColor: "red",
                        font: { size: 12 },
                    },
                });
            }
        });
    }

    if (showUCL) {
        room.forEach((r) => {
            if (roomLimits[r] && roomLimits[r][`ucl${dustTypeLabel}`] !== undefined) {
                annotations.push({
                    type: "line",
                    mode: "horizontal",
                    scaleID: "y",
                    value: roomLimits[r][`ucl${dustTypeLabel}`],
                    borderColor: "blue",
                    borderWidth: 2,
                    label: {
                        // content: `UCL (${r})`,
                        enabled: true,
                        position: "end",
                        backgroundColor: "blue",
                        font: { size: 12 },
                        content: ['This is my text', 'This is my text, second line'],
                    },
                });
            }
        });
    }

    const totalPages = Math.ceil(locations.length / ITEMS_PER_PAGE);

    return (
        <div>
            <div style={{ margin: "10px" }}>
                <Button
                    variant="outlined"
                    startIcon={<CircleIcon />}
                    color={showUSL ? "error" : "error"}
                    onClick={() => setShowUSL(!showUSL)}
                    style={{ marginRight: "10px" }}
                >
                    {showUSL ? "Hide USL" : "Show USL"}
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<CircleIcon />}
                    color={showUCL ? "primary" : "primary"}
                    onClick={() => setShowUCL(!showUCL)}
                >
                    {showUCL ? "Hide UCL" : "Show UCL"}
                </Button>
            </div>

            <div style={{display:"flex",justifyContent:"center", height: "400px" }}>
                <Chart
                    type="boxplot"
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: "top" },
                            title: { display: true, text: `Box Plot for Dust Type ${dustType} in ${room.join(", ")}` },
                            annotation: {
                                annotations,
                            },
                        },
                        scales: {
                            x: { title: { display: true, text: "Locations" } },
                            y: { title: { display: true, text: "Dust Value" }, beginAtZero: true },
                        },
                    }}
                />
            </div>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <Button
                    variant="contained"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                    disabled={currentPage === 0}
                    style={{ marginRight: "10px", width: "100px" }}
                >
                    Previous
                </Button>

                <span>
                    Page {currentPage + 1} of {totalPages}
                </span>

                <Button
                    variant="contained"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={currentPage === totalPages - 1}
                    style={{ marginLeft: "10px", width: "100px" }}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default BoxPlotByLocation;

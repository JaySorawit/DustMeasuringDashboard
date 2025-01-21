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

// Register necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BoxPlotController, BoxAndWiskers, Title, Tooltip, Legend, annotationPlugin);

interface BoxPlotProps {
    fetchData: any[];
    room: string[];
    dustType: number;
    roomLimits: { [key: string]: { [key: string]: number } };
}

const ITEMS_PER_PAGE = 1;

const BoxPlotByDate: React.FC<BoxPlotProps> = ({ fetchData, room, dustType, roomLimits }) => {
    const [showUSL, setShowUSL] = useState(false);
    const [showUCL, setShowUCL] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const dustTypeKey = `um${(dustType * 10).toFixed(0).padStart(2, "0")}`;
    const dustTypeLabel = `${(dustType * 10).toFixed(0).padStart(2, "0")}`;

    // Filter and group data based on the provided rooms and date
    const filteredData = fetchData
        .filter(
            (data) =>
                room.map((r) => r.toLowerCase().trim()).includes(data.room.toLowerCase().trim()) &&
                data[dustTypeKey] !== undefined
        )
        .map((data) => ({
            date: data.measurement_datetime,
            value: data[dustTypeKey],
        }));

        const groupedData = filteredData.reduce((acc: { [key: string]: number[] }, curr) => {
            if (typeof curr.date === "string" && curr.date.includes("T")) {
                const dateOnly = curr.date.split("T")[0];
                if (!acc[dateOnly]) acc[dateOnly] = [];
                acc[dateOnly].push(curr.value);
            } else {
                console.warn(`Invalid date format: ${curr.date}`);
            }
            return acc;
        }, {});
        

    // Group data by month and year
    const groupedByMonth: { [key: string]: { [key: string]: number[] } } = {};
    Object.keys(groupedData).forEach((date) => {
        const monthYear = date.substring(0, 7); // Extract Year-Month (e.g., "2025-01")
        if (!groupedByMonth[monthYear]) groupedByMonth[monthYear] = {};
        groupedByMonth[monthYear][date] = groupedData[date];
    });

    // Ensure all dates in the month are included, even if there's no data for that day
    // const completeGroupedByMonth: { [key: string]: { [key: string]: number[] } } = {};
    // Object.keys(groupedByMonth).forEach((monthYear) => {
    //     const startDate = new Date(`${monthYear}-01`);
    //     const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // Last day of the month
    //     const allDatesInMonth: { [key: string]: number[] } = {};

    //     let currentDate = startDate;
    //     while (currentDate <= endDate) {
    //         const dateStr = currentDate.toISOString().split("T")[0];
    //         allDatesInMonth[dateStr] = groupedByMonth[monthYear][dateStr] || [0]; // Default to 0 if no data
    //         currentDate.setDate(currentDate.getDate() + 1); // Move to next day
    //     }

    //     completeGroupedByMonth[monthYear] = allDatesInMonth;
    // });

    const months = Object.keys(groupedByMonth).sort();
    const paginatedMonths = months.slice(currentPage, currentPage + ITEMS_PER_PAGE);
    const paginatedValues = paginatedMonths.map((month) => groupedByMonth[month]);

    // Prepare the box plot data in the format expected by Chart.js BoxPlot
    const prepareBoxPlotData = (data: number[]): { min: number; q1: number; median: number; q3: number; max: number } => {
        data.sort((a, b) => a - b);
        const min = data[0];
        const max = data[data.length - 1];
        const median = data[Math.floor(data.length / 2)];
        const q1 = data[Math.floor(data.length / 4)];
        const q3 = data[Math.floor((3 * data.length) / 4)];

        return { min, q1, median, q3, max };
    };

    const chartData: ChartConfiguration<"boxplot">["data"] = {
        labels: Object.keys(paginatedValues[0] || {}),
        datasets: [
            {
                label: `Dust Type ${dustType} (${room.join(", ")})`,
                data: paginatedValues.flatMap((monthData) =>
                    Object.values(monthData).map(prepareBoxPlotData)
                ),
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
                        content: `UCL (${r})`,
                        enabled: true,
                        position: "end",
                        backgroundColor: "blue",
                        font: { size: 12 },
                    },
                });
            }
        });
    }

    const totalPages = Math.ceil(months.length / ITEMS_PER_PAGE);

    return (
        <div>
            <div style={{ margin: "10px" }}>
                <Button
                    variant="contained"
                    color={showUSL ? "secondary" : "primary"}
                    onClick={() => setShowUSL(!showUSL)}
                    style={{ marginRight: "10px" }}
                >
                    {showUSL ? "Hide USL" : "Show USL"}
                </Button>

                <Button
                    variant="contained"
                    color={showUCL ? "secondary" : "primary"}
                    onClick={() => setShowUCL(!showUCL)}
                >
                    {showUCL ? "Hide UCL" : "Show UCL"}
                </Button>
            </div>

            <div style={{ display: "flex", justifyContent: "center", height: "400px" }}>
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
                            x: {
                                title: { display: true, text: "Date" },
                                type: "category",
                            },
                            y: {
                                title: { display: true, text: "Dust Value" },
                                beginAtZero: true,
                            },
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

export default BoxPlotByDate;

import React, { useState } from "react";
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
import { Button } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    fetchData: any[];
    room: string[];
    dustType: number;
}

const ITEMS_PER_PAGE = 20;

const BarChartByLocation: React.FC<BarChartProps> = ({ fetchData, room, dustType }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const dustTypeKey = `um${(dustType * 10).toFixed(0).padStart(2, "0")}`;

    // Filter and group data based on rooms and dust type
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

    const locationCounts = filteredData.reduce((acc: { [key: string]: number }, curr) => {
        acc[curr.location] = (acc[curr.location] || 0) + 1;
        return acc;
    }, {});

    const locations = Object.keys(locationCounts).sort((a, b) => a.localeCompare(b));
    const paginatedLocations = locations.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
    const paginatedCounts = paginatedLocations.map((location) => locationCounts[location]);

    const chartData = {
        labels: paginatedLocations,
        datasets: [
            {
                label: `Dust Measurement Count` ,
                data: paginatedCounts,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const totalPages = Math.ceil(locations.length / ITEMS_PER_PAGE);

    return (
        <div>
            <div style={{display:"flex",justifyContent:"center", height: "400px" }}>
                <Chart
                    type="bar"
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: "top" },
                            title: { display: true, text: `Dust Value Measurement Count by Location` },
                        },
                        scales: {
                            x: { title: { display: true, text: "Locations" } },
                            y: { title: { display: true, text: "Measurement Count" }, beginAtZero: true },
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

export default BarChartByLocation;

import { Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import API_BASE_URL from "../configs/apiConfig";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function DustMeasureCount() {
    const [_, setFilteredData] = useState([]);
    const [uniqueLocations, setUniqueLocations] = useState(new Set());

    const fetchData = async () => {
        try {
            const startDate = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
            const endDate = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");

            const response = await axios.post(`${API_BASE_URL}/api/dust-measurements/date-range`, {
                startDate,
                endDate,
            });

            const data = response.data;
            setFilteredData(data);

            // Get unique (room, area, location_name) combinations
            const locationSet = new Set(
                data.map((d: { room: any; area: any; location_name: any; }) => `${d.room}-${d.area}-${d.location_name}`)
            );
            setUniqueLocations(locationSet);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        fetchData(); // Initial fetch

        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchData, 10000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return (
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
            <Card variant="outlined" style={{ width: "200px", height: "200px" }}>
                <CardContent>
                    <Typography variant="caption">Total Measurements today</Typography>
                    <Typography variant="h4">{uniqueLocations.size}</Typography>
                </CardContent>
            </Card>
        </div>
    );
}

import { Card, CardContent, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import API_BASE_URL from '../configs/apiConfig';

function DustExceedLocation() {
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [uniqueLocations, setUniqueLocations] = useState<Set<string>>(new Set());

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
            const locationSet: Set<string> = new Set(
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

    // Calculate the sum of alarm_high for each location
    const locationAlarmHighs = Array.from(uniqueLocations).map((location) => {
        const alarmHighSum = filteredData
            .filter((d) => `${d.room}-${d.area}-${d.location_name}` === location && d.alarm_high === 1)
            .length;
        return { location, alarmHighSum };
    });

    // Sum all the alarm_high counts across all locations
    const totalExceeds = locationAlarmHighs.reduce((total, loc) => total + loc.alarmHighSum, 0);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Card variant="outlined" style={{ width: '200px', height: '200px' }}>
                <CardContent>
                    <Typography variant="caption">Locations with Excessive Dust Levels</Typography>
                    <Typography variant="h4">{totalExceeds}</Typography>
                </CardContent>
            </Card>
        </div>
    );
}

export default DustExceedLocation;

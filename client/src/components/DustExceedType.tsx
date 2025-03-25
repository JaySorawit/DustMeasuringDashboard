import { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import API_BASE_URL from '../configs/apiConfig';

function DustExceedType() {
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [uclData, setUclData] = useState<any[]>([]);
    const [mostExcessiveDust, setMostExcessiveDust] = useState<string>('UM 05'); // Default value, to be calculated

    // Fetch dust measurements data (um values)
    const fetchDustMeasurements = async () => {
        try {
            const startDate = dayjs().startOf("day").format("YYYY-MM-DD HH:mm:ss");
            const endDate = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss");

            const response = await axios.post(`${API_BASE_URL}/api/dust-measurements/date-range`, {
                startDate,
                endDate,
            });

            const data = response.data;
            setFilteredData(data);
        } catch (error) {
            console.error("Failed to fetch dust measurements:", error);
        }
    };

    // Fetch UCL data
    const fetchUclData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/room-management/');
            const data = response.data;
            setUclData(data);
        } catch (error) {
            console.error("Failed to fetch UCL data:", error);
        }
    };

    // Compare um values with ucl values to determine the most excessive dust type
    const compareDustData = () => {
        let dustExceedCount: { [key: string]: number } = {
            'UM 01': 0,
            'UM 03': 0,
            'UM 05': 0,
        };

        // Assuming the response data includes room and area info along with um and dust type
        filteredData.forEach((dust) => {
            // Find the matching UCL data based on room and area
            const uclValue = uclData.find(
                (room) => room.room === dust.room && room.area === dust.area
            );

            if (uclValue) {
                // Determine which UCL value to use based on the dust_type
                let uclThreshold;
                if (dust.dust_type === 'UM 01') uclThreshold = uclValue.ucl01;
                else if (dust.dust_type === 'UM 03') uclThreshold = uclValue.ucl03;
                else if (dust.dust_type === 'UM 05') uclThreshold = uclValue.ucl05;

                // Compare the um value with the corresponding ucl threshold
                if (dust.um > uclThreshold) {
                    dustExceedCount[dust.dust_type] += 1;
                }
            }
        });

        // Find the dust type with the highest exceed count
        const mostExcessive = Object.keys(dustExceedCount).reduce((a, b) =>
            dustExceedCount[a] > dustExceedCount[b] ? a : b
        );

        setMostExcessiveDust(mostExcessive);
    };

    useEffect(() => {
        fetchDustMeasurements(); // Fetch dust measurements data
        fetchUclData(); // Fetch UCL data

        // Auto-refresh every 10 seconds
        const interval = setInterval(() => {
            fetchDustMeasurements();
            fetchUclData();
        }, 10000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    useEffect(() => {
        // Calculate most excessive dust after data is fetched
        if (filteredData.length > 0 && uclData.length > 0) {
            compareDustData();
        }
    }, [filteredData, uclData]);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Card variant="outlined" style={{ width: '200px', height: '200px' }}>
                <CardContent>
                    <Typography variant="caption">Most Excessive Dust Type</Typography>
                    <Typography variant="h4">{mostExcessiveDust}</Typography>
                </CardContent>
            </Card>
        </div>
    );
}

export default DustExceedType;

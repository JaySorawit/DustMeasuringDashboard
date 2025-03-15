import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import FilterBar from "../components/FilterBar";
import dayjs, { Dayjs } from "dayjs";
import { dustType, FetchedData } from "../types/types";
import API_BASE_URL from "../configs/apiConfig";
import axios from "axios";
import BoxPlotByDate from "../components/BoxPlotByDate";

const MonthlyViewPage: React.FC = () => {
  const dustTypes = dustType;
  const [rooms, setRooms] = useState<string[]>([]);
  const [roomLimits, setRoomLimits] = useState<any>({});
  const [filteredData, setFilteredData] = useState<FetchedData[]>([]);
  const [startDate] = useState<Dayjs>(dayjs().startOf("month"));
  const [endDate] = useState<Dayjs>(dayjs().endOf("month"));
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setInitialLoading(true);
    try {
      const payload = {
        startDate: startDate ? startDate.format("YYYY-MM-DD HH:mm:ss") : null,
        endDate: endDate ? endDate.format("YYYY-MM-DD HH:mm:ss") : null,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/dust-measurements/date-range`,
        payload
      );
      const data: FetchedData[] = response.data;
      setFilteredData(data);
      setRooms(Array.from(new Set(data.map((d) => d.room))));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    const fetchRoomLimits = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/room-management/`);
        const result = await response.json();
        if (result.success) {
          const formattedLimits = result.data.reduce((acc: any, curr: any) => {
            acc[curr.room] = curr;
            return acc;
          }, {});
          setRoomLimits(formattedLimits);
        }
      } catch (error) {
        console.error("Error fetching room limits:", error);
      }
    };

    fetchRoomLimits();
  }, []);

  useEffect(() => {
    setRooms(Array.from(new Set(filteredData.map((d) => d.room))));
  }, [filteredData]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {initialLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <h2>Monthly View Page</h2>
          <FilterBar
            dustTypes={dustTypes}
            onFilter={(filteredData) => setFilteredData(filteredData)}
            initialStartDate={startDate}
            initialEndDate={endDate}
          />
          {rooms.map((room) => {
            const areas = Array.from(new Set(filteredData.filter(d => d.room === room).map(d => d.area)));

            return areas.map((area) =>
              dustTypes.map((dustType) => {
                const dustKey = `um${(dustType * 10).toFixed(0).padStart(2, "0")}`;

                // Filter only data for this room, area, and dust type.
                const areaData = filteredData.filter(
                  (data) =>
                    data.room === room &&
                    data.area === area &&
                    data[dustKey as keyof FetchedData] !== undefined
                );

                if (areaData.length === 0) {
                  return null;  // Skip if no data for this combination.
                }

                return (
                  <Box key={`${room}-${area}-${dustType}`} sx={{ my: 4, mx: 8 }}>
                    <Typography variant="h6" gutterBottom>
                      {`${room} (${area}) - Dust Type: ${dustType} µm`}
                    </Typography>
                    <BoxPlotByDate
                      fetchData={areaData}   // Pass only relevant data.
                      room={[room]}          // Pass the current room.
                      dustType={dustType}
                      roomLimits={roomLimits}
                    />
                  </Box>
                );
              })
            );
          })}
        </Box>
      )}
    </>
  );
};

export default MonthlyViewPage;
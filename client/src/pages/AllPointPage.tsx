import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import FilterBar from "../components/FilterBar";
import BoxPlotByLocation from "../components/BoxPlotByLocation";
import dayjs from "dayjs";
import { FetchedData } from "../types/types";
import API_BASE_URL from "../configs/apiConfig";
import axios from "axios";

const AllPointPage: React.FC = () => {
  const dustTypes = [0.1, 0.3, 0.5];
  const [rooms, setRooms] = useState<string[]>([]);
  const [roomLimits, setRoomLimits] = useState<any>({});
  const [filteredData, setFilteredData] = useState<FetchedData[]>([]);
  const startDate = dayjs().startOf("day");
  const endDate = dayjs().endOf("day");
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setInitialLoading(true);
    try {
      const payload = {
        startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
        endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
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
          <h2>All Point Page</h2>
          <FilterBar
            dustTypes={dustTypes}
            onFilter={(filteredData) => setFilteredData(filteredData)}
            initialStartDate={startDate}
            initialEndDate={endDate}
          />
          {rooms.map((room) =>
            dustTypes.map((dustType) => {
              const dustKey = `um${(dustType * 10).toFixed(0).padStart(2, "0")}`;

              const hasData = filteredData.some(
                (data) =>
                  data.room === room &&
                  data[dustKey as keyof FetchedData] !== undefined
              );
              return (
                hasData && (
                  <Box key={`${room}-${dustType}`} sx={{ my: 4, mx: 8 }}>
                    <Typography variant="h6" gutterBottom>
                      {`${room} - Dust Type: ${dustType}`}
                    </Typography>
                    <BoxPlotByLocation fetchData={filteredData} room={[room]} dustType={dustType} roomLimits={roomLimits} />
                  </Box>
                )
              );
            })
          )}
        </Box>
      )}
    </>
  );
};

export default AllPointPage;

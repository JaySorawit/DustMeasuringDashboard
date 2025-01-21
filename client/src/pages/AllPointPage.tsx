import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import FilterBar from "../components/FilterBar";
import BoxPlot from "../components/BoxPlot";
import dayjs from "dayjs";
import { FetchedData } from "../types/types";
import API_BASE_URL from "../configs/apiConfig";
import axios from "axios";

const AllPointPage: React.FC = () => {
  const dustTypes = [0.1, 0.3, 0.5];
  const [rooms, setRooms] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<FetchedData[]>([]);
  const startDate = dayjs().subtract(1, "day").startOf("day");
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
                  <Box key={`${room}-${dustType}`} sx={{ my: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      {`${room} - Dust Type: ${dustType}`}
                    </Typography>
                    <BoxPlot fetchData={filteredData} room={[room]} dustType={dustType} />
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

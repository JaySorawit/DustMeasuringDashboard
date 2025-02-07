import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Modal } from "@mui/material";
import BarChartV2 from "../components/BarChartV2";
import BarChart from "../components/BarChart";
import axios from "axios";
import API_BASE_URL from "../configs/apiConfig";
import FilterBar from "../components/FilterBar";
import dayjs from 'dayjs';
import { FetchedData } from "../types/types";

const RepeatPointPageV2: React.FC = () => {
  const dustTypes = [0.1, 0.3, 0.5];
  const [rooms, setRooms] = useState<string[]>([]);
  const [_, setRoomLimits] = useState<any>({});
  const [filteredData, setFilteredData] = useState<FetchedData[]>([]);
  const startDate = dayjs().startOf("day");
  const endDate = dayjs().endOf("day");
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedDustType, setSelectedDustType] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const handleBarClick = (room: string, location: string, dustType: number) => {
    const dustKey = `um${(dustType * 10).toFixed(0).padStart(2, "0")}`;
    const selected = filteredData.filter(
      (data) => data.location_name === location &&
        data.room === room &&
        data[dustKey as unknown as keyof FetchedData] !== undefined
    );

    if (selected.length > 0) {
      setModalData(selected);
      setSelectedRoom(room);
      setSelectedLocation(location);
      setSelectedDustType(dustType);
      setSelectedDate(selected[0].measurement_datetime.split("T")[0]);
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setRooms(Array.from(new Set(filteredData.map((d) => d.room))));
  }, [filteredData]);

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
            isSingleDate={true}
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
                    <BarChartV2
                      fetchData={filteredData}
                      room={[room]}
                      dustType={dustType}
                      onBarClick={handleBarClick}
                    />
                  </Box>
                )
              );
            })
          )}
        </Box>
      )}

      {/* Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500, bgcolor: "background.paper",
          boxShadow: 24, p: 4, borderRadius: 2
        }}>
          <Typography variant="h6">Details for {selectedRoom} {selectedLocation} on {selectedDate}</Typography>
          <BarChart fetchData={modalData} dustType={selectedDustType!} />
        </Box>
      </Modal>
    </>
  );
};

export default RepeatPointPageV2;

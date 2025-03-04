import React, { useState, useMemo, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import FilterBar from "../components/FilterBar";
import {
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  CircularProgress,
  Box,
} from "@mui/material";
import { DustMeasurement, FetchedData } from "../types/types";
import axios from "axios";
import API_BASE_URL from "../configs/apiConfig";

function ListViewPage() {
  const [filteredData, setFilteredData] = useState<DustMeasurement[]>([]);
  const dustTypes = [0.5, 0.3, 0.1];
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("room");
  const [startDate] = useState<Dayjs>(dayjs().startOf("month"));
  const [endDate] = useState<Dayjs>(dayjs().endOf("month"));
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const handleRequestSort = (property: keyof DustMeasurement | "dust_type" | "dust_value") => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (array: DustMeasurement[]): DustMeasurement[] => {
    return [...array].sort((a, b) => {
      if (orderBy === "location_name") {
        return order === "asc"
          ? a.location_name.localeCompare(b.location_name)
          : b.location_name.localeCompare(a.location_name);
      }

      if (orderBy === "room") {
        return order === "asc"
          ? a.room.localeCompare(b.room)
          : b.room.localeCompare(a.room);
      }

      const aValue = a[orderBy as keyof DustMeasurement] as number | string;
      const bValue = b[orderBy as keyof DustMeasurement] as number | string;

      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  const transformData = (data: FetchedData[]): DustMeasurement[] => {
    return data.flatMap((item) =>
      ["um01", "um03", "um05"].flatMap((key) => {
        const value = item[key as keyof FetchedData];
        if (value !== undefined) {
          return {
            measurement_id: item.measurement_id,
            measurement_datetime: item.measurement_datetime,
            room: item.room,
            location_name: item.location_name,
            count: item.count,
            alarm_high: item.alarm_high,
            dust_type: parseFloat(key.replace("um0", "0.")),
            dust_value: value as number,
            running_state: item.running_state,
          };
        }
        return [];
      })
    );
  };

  const currentData = useMemo(() => {
    const transformedData = [...filteredData];
    const sortedData = sortData(transformedData);
    const startIndex = page * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage, order, orderBy]);

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      const transformed = transformData(data);
      setFilteredData(transformed);
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
        <>
          <h2>List View Page</h2>
          <FilterBar
            dustTypes={dustTypes}
            onFilter={(data: FetchedData[]) => {
              const transformed = transformData(data);
              setFilteredData(transformed);
            }}
            initialStartDate={startDate}
            initialEndDate={endDate}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "room"}
                      direction={orderBy === "room" ? order : "asc"}
                      onClick={() => handleRequestSort("room")}
                    >
                      Room
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "location_name"}
                      direction={orderBy === "location_name" ? order : "asc"}
                      onClick={() => handleRequestSort("location_name")}
                    >
                      Location
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "measurement_datetime"}
                      direction={orderBy === "measurement_datetime" ? order : "asc"}
                      onClick={() => handleRequestSort("measurement_datetime")}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "dust_value"}
                      direction={orderBy === "dust_value" ? order : "asc"}
                      onClick={() => handleRequestSort("dust_value")}
                    >
                      Dust Value
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "dust_type"}
                      direction={orderBy === "dust_type" ? order : "asc"}
                      onClick={() => handleRequestSort("dust_type")}
                    >
                      Dust Type
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "count"}
                      direction={orderBy === "count" ? order : "asc"}
                      onClick={() => handleRequestSort("count")}
                    >
                      Count
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "alarm_high"}
                      direction={orderBy === "alarm_high" ? order : "asc"}
                      onClick={() => handleRequestSort("alarm_high")}
                    >
                      Alarm high
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.length > 0 ? (
                  currentData.map((item) => (
                    <TableRow key={`${item.measurement_id}-${item.dust_type}`}>
                      <TableCell>{item.room}</TableCell>
                      <TableCell>{item.location_name}</TableCell>
                      <TableCell>{dayjs(item.measurement_datetime).format("DD/MM/YYYY HH:mm:ss")}</TableCell>
                      <TableCell>{item.dust_value}</TableCell>
                      <TableCell>{item.dust_type}</TableCell>
                      <TableCell>{item.count}</TableCell>
                      <TableCell>{item.alarm_high}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} style={{ textAlign: "center" }}>
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[20, 30, 50]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </>
  );
}

export default ListViewPage;

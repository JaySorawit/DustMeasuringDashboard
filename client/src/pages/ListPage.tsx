// src/components/ListPage.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import Filters from "../components/FilterPanel";

interface DustMeasurement {
  measurement_date: string;
  measurement_time: string;
  location_id: string;
  dust_value: number;
  dust_type: string;
}

const ListPage: React.FC = () => {
  const [data, setData] = useState<DustMeasurement[]>([]);
  const [filteredData, setFilteredData] = useState<DustMeasurement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  interface Filters {
    selectedLocations?: string[];
    selectedDustTypes?: string[];
    startDate?: string;
    endDate?: string;
  }

  const [filters, setFilters] = useState<Filters>({});
  const [sortBy, setSortBy] = useState<"dust_value" | "measurement_date">("dust_value");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/dust-measurements/");
        setData(response.data as DustMeasurement[]);
        setFilteredData(response.data as DustMeasurement[]); // Initialize filtered data with all data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    const applyFilters = () => {
      const { selectedLocations, selectedDustTypes, startDate, endDate } = filters;

      const filtered = data.filter((item) => {
        const matchesLocation =
          !selectedLocations || selectedLocations.length === 0 || selectedLocations.includes(item.location_id);
        const matchesDustType =
          !selectedDustTypes || selectedDustTypes.length === 0 || selectedDustTypes.includes(item.dust_type);
        const matchesDate =
          (!startDate || new Date(item.measurement_date) >= new Date(startDate)) &&
          (!endDate || new Date(item.measurement_date) <= new Date(endDate));
        return matchesLocation && matchesDustType && matchesDate;
      });

      setFilteredData(filtered);
    };

    applyFilters();
  }, [filters, data]);

  const handleSort = (property: "dust_value" | "measurement_date") => {
    const isAsc = sortBy === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  const sortedData = filteredData.sort((a, b) => {
    if (sortOrder === "asc") return a[sortBy] > b[sortBy] ? 1 : -1;
    return a[sortBy] < b[sortBy] ? 1 : -1;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Filters
        locations={[...new Set(data.map((item) => item.location_id))]}
        dustTypes={[...new Set(data.map((item) => item.dust_type))]}
        onFilterChange={(newFilters) => setFilters(newFilters)}
      />
      {filteredData.length > 0 ? (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel active={sortBy === "measurement_date"} direction={sortOrder} onClick={() => handleSort("measurement_date")}>
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>
                  <TableSortLabel active={sortBy === "dust_value"} direction={sortOrder} onClick={() => handleSort("dust_value")}>
                    Dust Value
                  </TableSortLabel>
                </TableCell>
                <TableCell>Dust Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={`${row.measurement_date}-${row.measurement_time}-${row.location_id}`}>
                  <TableCell>{row.measurement_date}</TableCell>
                  <TableCell>{row.measurement_time}</TableCell>
                  <TableCell>{row.location_id}</TableCell>
                  <TableCell>{row.dust_value}</TableCell>
                  <TableCell>{row.dust_type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
          />
        </>
      ) : (
        <Typography variant="h6" align="center" mt={4}>
          No data available for the selected filters.
        </Typography>
      )}
    </div>
  );
};

export default ListPage;

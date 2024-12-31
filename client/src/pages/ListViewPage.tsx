import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import FilterBar from "../components/FilterBar";
import { CircularProgress, TablePagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";

interface DustMeasurement {
  id: number;
  location_id: string;
  measurement_datetime: string;
  dust_value: number;
  dust_type: number;
}

function ListViewPage() {
  const [data, setData] = useState<DustMeasurement[]>([]);
  const [filteredData, setFilteredData] = useState<DustMeasurement[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const dustTypes = [0.1, 0.3, 0.5, 1.0];
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('location_id');
  const initialStartDate: Dayjs = dayjs().startOf('month');
  const initialEndDate: Dayjs = dayjs().endOf('month');

  // Fetch all data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/dust-measurements/date-range", {
          params: {
            startDate: initialStartDate.format("YYYY-MM-DD"),
            endDate: initialEndDate.format("YYYY-MM-DD")
          },
        });

        const fetchedData = response.data;
        setData(fetchedData);
        setFilteredData(fetchedData);

        // Extract unique locations dynamically
        const uniqueLocations: string[] = Array.from(new Set(fetchedData.map((item: DustMeasurement) => item.location_id)));
        setLocations(uniqueLocations);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoize filtered data for performance
  const displayedData = useMemo(() => filteredData, [filteredData]);

  // Sorting logic
  const handleRequestSort = (property: keyof DustMeasurement) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (array: DustMeasurement[]) => {
    const comparator = (a: DustMeasurement, b: DustMeasurement) => {
      if (a[orderBy as keyof DustMeasurement] < b[orderBy as keyof DustMeasurement]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[orderBy as keyof DustMeasurement] > b[orderBy as keyof DustMeasurement]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    };
    return array.sort(comparator);
  };

  // Get the data for the current page
  const currentData = useMemo(() => {
    const sortedData = sortData(displayedData);
    const startIndex = page * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [displayedData, page, rowsPerPage, order, orderBy]);

  // Pagination change handler
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }  

  return (
    <>
      <h2>List View Page</h2>
      <FilterBar
        locations={locations}
        dustTypes={dustTypes}
        data={data}
        initialStartDate={initialStartDate}
        initialEndDate={initialEndDate}
        onFilter={(filteredData) => setFilteredData(filteredData)}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'location_id'}
                  direction={orderBy === 'location_id' ? order : 'asc'}
                  onClick={() => handleRequestSort('location_id')}
                >
                  Location
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'measurement_datetime'}
                  direction={orderBy === 'measurement_datetime' ? order : 'asc'}
                  onClick={() => handleRequestSort('measurement_datetime')}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'measurement_datetime'}
                  direction={orderBy === 'measurement_datetime' ? order : 'asc'}
                  onClick={() => handleRequestSort('measurement_datetime')}
                >
                  Time
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'dust_value'}
                  direction={orderBy === 'dust_value' ? order : 'asc'}
                  onClick={() => handleRequestSort('dust_value')}
                >
                  Dust Value
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'dust_type'}
                  direction={orderBy === 'dust_type' ? order : 'asc'}
                  onClick={() => handleRequestSort('dust_type')}
                >
                  Dust Type
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.location_id}</TableCell>
                  <TableCell>{dayjs(item.measurement_datetime).format("DD/MM/YYYY")}</TableCell>
                  <TableCell>{dayjs(item.measurement_datetime).format("HH:mm:ss")}</TableCell>
                  <TableCell>{item.dust_value}</TableCell>
                  <TableCell>{item.dust_type}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center" }}>
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
        count={displayedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default ListViewPage;

import React, { useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import FilterBar from "../components/FilterBar";
import { TablePagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";

interface DustMeasurement {
  id: number;
  location_id: string;
  measurement_datetime: string;
  dust_value: number;
  dust_type: number;
}

function ListViewPage() {
  const [filteredData, setFilteredData] = useState<DustMeasurement[]>([]);
  const dustTypes = [0.1, 0.3, 0.5, 1.0];
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('location_id');
  const [startDate] = useState<Dayjs>(dayjs().startOf('month'));
  const [endDate] = useState<Dayjs>(dayjs().endOf('month'));

  const handleRequestSort = (property: keyof DustMeasurement) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (array: DustMeasurement[]) => {
    const naturalCompare = (a: string, b: string) => {
      const re = /(\D+)(\d+)/g;
      const aParts = [];
      const bParts = [];
    
      // Extract text and number parts of the location_id
      let match;
      while ((match = re.exec(a)) !== null) {
        aParts.push(match[1], parseInt(match[2], 10));
      }
      while ((match = re.exec(b)) !== null) {
        bParts.push(match[1], parseInt(match[2], 10));
      }
  
      // Compare parts by text and number alternately
      const maxLen = Math.max(aParts.length, bParts.length);
      for (let i = 0; i < maxLen; i++) {
        const partA = aParts[i] || "";
        const partB = bParts[i] || "";
        if (partA !== partB) {
          // If part is text, compare lexicographically
          if (typeof partA === "string" && typeof partB === "string") {
            return partA.localeCompare(partB);
          }
          // If part is number, compare numerically
          return Number(partA) - Number(partB);
        }
      }
      return 0;
    };
  
    const comparator = (a: DustMeasurement, b: DustMeasurement) => {
      if (orderBy === "location_id") {
        return order === "asc"
          ? naturalCompare(a.location_id, b.location_id)
          : naturalCompare(b.location_id, a.location_id);
      }
  
      // Default sorting for other fields
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
  

  const currentData = useMemo(() => {
    const sortedData = sortData(filteredData);
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

  return (
    <>
      <h2>List View Page</h2>
      <FilterBar
        dustTypes={dustTypes}
        onFilter={(filteredData) => setFilteredData(filteredData)}
        initialStartDate={startDate}
        initialEndDate={endDate}
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
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default ListViewPage;

import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import FilterBar from "../components/FilterBar";
import {
  CircularProgress,
  Box,
} from "@mui/material";
import { DustMeasurement, dustType, FetchedData } from "../types/types";
import axios from "axios";
import API_BASE_URL from "../configs/apiConfig";
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridRenderCellParams } from "@mui/x-data-grid";

function ListViewPage() {
  const [filteredData, setFilteredData] = useState<DustMeasurement[]>([]);
  const dustTypes = dustType;
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [startDate] = useState<Dayjs>(dayjs().startOf("month"));
  const [endDate] = useState<Dayjs>(dayjs().endOf("month"));
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const transformData = (data: FetchedData[]): DustMeasurement[] => {
    return data.flatMap((item) =>
      ["um01", "um03", "um05"].flatMap((key) => {
        const value = item[key as keyof FetchedData];
        if (value !== undefined) {
          return {
            measurement_id: item.measurement_id,
            measurement_datetime: item.measurement_datetime,
            room: item.room,
            area: item.area,
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

  const columns: GridColDef[] = [
    { field: "room", headerName: "Room", flex: 1 },
    { field: "area", headerName: "Area", flex: 1 },
    { field: "location_name", headerName: "Location", flex: 1 },
    {
      field: "measurement_datetime",
      headerName: "Date",
      flex: 1.5,
      valueFormatter: (value: string) => dayjs(value).format("DD/MM/YYYY HH:mm:ss"),
    },
    { field: "dust_value", headerName: "Dust Value", flex: 1 },
    { field: "dust_type", headerName: "Dust Type", flex: 1 },
    {
      field: "count",
      headerName: "Repeat",
      flex: 1,
      valueFormatter: (value: number) => {
        return value-1;
      },
    },
    {
      field: "alarm_high",
      headerName: "Alarm status",
      flex: 1,
      valueFormatter: (value: number) => {
        return value === 0 ? "Pass" : "Not Pass";
      },
      renderCell: (params: GridRenderCellParams) => {
        return params.value === 0 ? (
          <div style={{ color: "green" }}>Pass</div>
        ) : (
          <div style={{ color: "red" }}>Not Pass</div>
        );
      }
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport printOptions={{ disableToolbarButton: true }}/>
      </GridToolbarContainer>
    );
  }

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
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={filteredData}
              columns={columns}
              getRowId={(row) => `${row.measurement_id}-${row.dust_type}`}
              paginationModel={{ pageSize: rowsPerPage, page }}
              pageSizeOptions={[20, 50, 100]}
              slots={{ toolbar: CustomToolbar }}
              onPaginationModelChange={(model) => {
                setPage(model.page);
                setRowsPerPage(model.pageSize);
              }}
            />
          </Box>
        </>
      )}
    </>
  );
}

export default ListViewPage;
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
  Select,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

import isBetween from "dayjs/plugin/isBetween";
import API_BASE_URL from "../configs/apiConfig";
import { DustMeasurement } from "../types/types";
dayjs.extend(isBetween);

interface FilterBarProps {
  dustTypes: number[];
  onFilter: (filteredData: DustMeasurement[]) => void;
  initialStartDate?: Dayjs | null;
  initialEndDate?: Dayjs | null;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const FilterBar: React.FC<FilterBarProps> = ({
  dustTypes,
  onFilter,
  initialStartDate = null,
  initialEndDate = null,
}) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(initialEndDate);
  const [rooms, setRooms] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDustTypes, setSelectedDustTypes] = useState<number[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [data, setData] = useState<{ location_name: string; room: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const filtersRef = useRef({
    selectedRooms: [] as string[],
    selectedLocations: [] as string[],
    selectedDustTypes: [] as number[],
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/dust-measurements/locations`);
        const data: { location_name: string; room: string }[] = response.data;

        const sortedLocations = data.map((item) => item.location_name).sort();
        const sortedRooms = [...new Set(data.map((item) => item.room))].sort();

        setRooms(sortedRooms);
        setSelectedRooms(sortedRooms);
        setSelectedLocations(sortedLocations);
        setData(data);

        filtersRef.current.selectedRooms = sortedRooms;
        filtersRef.current.selectedLocations = sortedLocations;
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const updatedLocations = Array.from(
      new Set(
        data
          .filter((item) => selectedRooms.includes(item.room))
          .map((item) => item.location_name)
      )
    ).sort((a, b) => {
      return String(a).localeCompare(String(b), undefined, { numeric: true });
    });    

    setSelectedLocations(updatedLocations);
    setFilteredLocations(updatedLocations);
  }, [selectedRooms, data]);

  useEffect(() => {
    const sortedDustTypes = [...dustTypes].sort((a, b) => a - b);
    setSelectedDustTypes(sortedDustTypes);
    filtersRef.current.selectedDustTypes = sortedDustTypes;
  }, [dustTypes]);

  const fetchFilteredData = async () => {
    setLoading(true);
    try {
      const payload = {
        startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
        endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
        rooms: selectedRooms,
        locations: selectedLocations,
        dustTypes: selectedDustTypes,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/dust-measurements/date-range`,
        payload
      );

      onFilter(response.data);

      filtersRef.current.selectedRooms = selectedRooms;
      filtersRef.current.selectedLocations = selectedLocations;
      filtersRef.current.selectedDustTypes = selectedDustTypes;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    if (value.includes("all")) {
      setSelectedLocations(
        selectedLocations.length === filteredLocations.length
          ? []
          : [...filteredLocations]
      );
    } else {
      setSelectedLocations(value);
    }
  };

  const applyFilters = () => {
    fetchFilteredData();
  };

  return (
    <div style={{ display: "flex", marginBottom: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={{ width: "320px", display: "flex", alignItems: "center", gap: "16px", marginRight: "0.5rem" }}>
          <DatePicker label="Start Date" value={startDate} onChange={(newValue) => setStartDate(newValue)} />
          <DatePicker label="End Date" value={endDate} onChange={(newValue) => setEndDate(newValue)} />
        </div>
      </LocalizationProvider>

      <FormControl sx={{ m: 1, width: 180 }}>
        <InputLabel id="room-filter-label">Rooms</InputLabel>
        <Select
          labelId="room-filter-label"
          id="room-filter"
          name="room-filter" 
          multiple
          value={selectedRooms}
          onChange={(event) => {
            const value = event.target.value as string[];
            if (value.includes("all")) {
              setSelectedRooms(selectedRooms.length === rooms.length ? [] : [...rooms]);
            } else {
              setSelectedRooms(value);
            }
          }}
          input={<OutlinedInput label="Rooms" />}
          renderValue={(selected) => (selected.length === rooms.length ? "All Rooms" : selected.join(", "))}
          MenuProps={MenuProps}
        >
          <MenuItem value="all">
            <Checkbox checked={selectedRooms.length === rooms.length} indeterminate={selectedRooms.length > 0 && selectedRooms.length < rooms.length} />
            <ListItemText primary="Select All" />
          </MenuItem>
          {rooms.map((room) => (
            <MenuItem key={room} value={room}>
              <Checkbox checked={selectedRooms.includes(room)} />
              <ListItemText primary={room} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: 180 }}>
        <InputLabel id="location-filter-label">Locations</InputLabel>
        <Select
          labelId="location-filter-label"
          id="location-filter"
          name="location-filter"
          multiple
          value={selectedLocations}
          onChange={handleLocationChange}
          input={<OutlinedInput label="Locations" />}
          renderValue={(selected) => {
            const uniqueSelected = Array.from(new Set(selected));
            return uniqueSelected.length === filteredLocations.length
              ? "All Locations"
              : uniqueSelected.join(", ");
          }}
          MenuProps={MenuProps}
        >
          <MenuItem value="all">
            <Checkbox
              checked={selectedLocations.length === filteredLocations.length}
              indeterminate={selectedLocations.length > 0 && selectedLocations.length < filteredLocations.length}
            />
            <ListItemText primary="Select All" />
          </MenuItem>
          {filteredLocations.map((location) => (
            <MenuItem key={location} value={location}>
              <Checkbox checked={selectedLocations.includes(location)} />
              <ListItemText primary={location} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: 180 }}>
        <InputLabel id="dust-type-filter-label">Dust Types</InputLabel>
        <Select
          labelId="dust-type-filter-label"
          id="dust-type-filter"
          name="dust-type-filter"
          multiple
          value={selectedDustTypes}
          onChange={(event) => setSelectedDustTypes(event.target.value as number[])}
          input={<OutlinedInput label="Dust Types" />}
          renderValue={(selected) => (selected.length === dustTypes.length ? "All Dust Types" : selected.map((type) => `Type ${type}`).join(", "))}
          MenuProps={MenuProps}
        >
          {dustTypes.map((dustType) => (
            <MenuItem key={dustType} value={dustType}>
              <Checkbox checked={selectedDustTypes.includes(dustType)} />
              <ListItemText primary={`Dust Type ${dustType}`} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div style={{ marginTop: "1rem" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={applyFilters}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Applying..." : "Apply Filters"}
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;

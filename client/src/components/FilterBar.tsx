import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

interface DustMeasurement {
  id: number;
  measurement_datetime: string;
  location_id: string;
  dust_value: number;
  dust_type: number;
}

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
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDustTypes, setSelectedDustTypes] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Inside useEffect for fetching locations, sort the locations alphabetically
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/dust-measurements/locations"
        );
        const sortedLocations = response.data.sort((a: string, b: string) =>
          a.localeCompare(b, undefined, { numeric: true })
        );
        setLocations(sortedLocations);
        setSelectedLocations(sortedLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const sortedDustTypes = [...dustTypes].sort((a, b) => a - b);
    setSelectedDustTypes(sortedDustTypes);
  }, [dustTypes]);

  // Fetch data based on filters
  const fetchFilteredData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/dust-measurements/date-range",
        {
          params: {
            startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
            endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
            locations: JSON.stringify(selectedLocations),
            dustTypes: JSON.stringify(selectedDustTypes),
          },
        }
      );

      onFilter(response.data);
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
        selectedLocations.length === locations.length ? [] : [...locations]
      );
    } else {
      setSelectedLocations(value);
    }
  };

  const handleDustTypeChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value as number[];
    if (value.includes(-1)) {
      setSelectedDustTypes(
        selectedDustTypes.length === dustTypes.length ? [] : [...dustTypes]
      );
    } else {
      setSelectedDustTypes(value);
    }
  };

  const applyFilters = () => {
    fetchFilteredData();
  };

  return (
    <div
      style={{
        display: "flex",
        marginBottom: "2rem",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div
          style={{
            width: "320px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginRight: "0.5rem",
          }}
        >
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
        </div>
      </LocalizationProvider>

      <FormControl sx={{ m: 1, width: 150 }}>
        <InputLabel id="location-filter-label">Locations</InputLabel>
        <Select
          labelId="location-filter-label"
          id="location-filter"
          multiple
          value={selectedLocations}
          onChange={handleLocationChange}
          input={<OutlinedInput label="Locations" />}
          renderValue={(selected) =>
            selected.length === locations.length
              ? "All Locations"
              : selected.join(", ")
          }
          MenuProps={MenuProps}
        >
          <MenuItem value="all">
            <Checkbox
              checked={selectedLocations.length === locations.length}
              indeterminate={
                selectedLocations.length > 0 &&
                selectedLocations.length < locations.length
              }
            />
            <ListItemText primary="Select All" />
          </MenuItem>
          {locations.map((location) => (
            <MenuItem key={location} value={location}>
              <Checkbox checked={selectedLocations.includes(location)} />
              <ListItemText primary={location} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: 200 }}>
        <InputLabel id="dust-type-filter-label">Dust Types</InputLabel>
        <Select
          labelId="dust-type-filter-label"
          id="dust-type-filter"
          multiple
          value={selectedDustTypes}
          onChange={handleDustTypeChange}
          input={<OutlinedInput label="Dust Types" />}
          renderValue={(selected) =>
            selected.length === dustTypes.length
              ? "All Dust Types"
              : selected.map((type) => `Type ${type}`).join(", ")
          }
          MenuProps={MenuProps}
        >
          <MenuItem value={-1}>
            <Checkbox
              checked={selectedDustTypes.length === dustTypes.length}
              indeterminate={
                selectedDustTypes.length > 0 &&
                selectedDustTypes.length < dustTypes.length
              }
            />
            <ListItemText primary="Select All" />
          </MenuItem>
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
        >
          {loading ? "Applying..." : "Apply Filters"}
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;

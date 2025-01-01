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
    locations: string[];
    dustTypes: number[];
    data: DustMeasurement[];
    onFilter: (filteredData: DustMeasurement[]) => void;
    initialStartDate?: Dayjs | null;
    initialEndDate?: Dayjs | null;
    onDateChange: (newStartDate: Dayjs | null, newEndDate: Dayjs | null) => void;
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
  locations,
  dustTypes,
  data,
  onFilter,
  initialStartDate = null,
  initialEndDate = null,
  onDateChange,
}) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(initialEndDate);

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDustTypes, setSelectedDustTypes] = useState<number[]>([]);

  const handleDateChange = (newStartDate: Dayjs | null, newEndDate: Dayjs | null) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    // Do not call onDateChange yet, only when Apply button is clicked
  };

  const handleLocationChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedLocations(typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value);
  };

  const handleDustTypeChange = (event: SelectChangeEvent<number[]>) => {
    setSelectedDustTypes(event.target.value as number[]);
  };

  const handleSelectAllLocations = () => {
    setSelectedLocations(selectedLocations.length === locations.length ? [] : locations);
  };

  const handleSelectAllDustTypes = () => {
    setSelectedDustTypes(selectedDustTypes.length === dustTypes.length ? [] : dustTypes);
  };

  // Apply filters when the button is clicked
  const applyFilters = () => {
    const filteredData = data.filter((item) => {
      const matchesLocation =
        selectedLocations.length === 0 || selectedLocations.includes(item.location_id);
      const matchesDustType =
        selectedDustTypes.length === 0 || selectedDustTypes.includes(item.dust_type);
      const matchesDate =
        !startDate ||
        dayjs(item.measurement_datetime).isBetween(
          dayjs(startDate).startOf("day"),
          dayjs(endDate).endOf("day"),
          null,
          "[]"
        );
      return matchesLocation && matchesDustType && matchesDate;
    });

    onFilter(filteredData);
    onDateChange(startDate, endDate); // Pass updated date range back to parent only after clicking Apply Filters
  };

  const isLocationIndeterminate =
    selectedLocations.length > 0 && selectedLocations.length < locations.length;
  const isDustTypeIndeterminate =
    selectedDustTypes.length > 0 && selectedDustTypes.length < dustTypes.length;

  return (
    <div style={{ display: "flex", marginBottom: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={{ width: "320px", display: "flex", alignItems: "center", gap: "16px", marginRight: "0.5rem" }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => handleDateChange(newValue, endDate)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => handleDateChange(startDate, newValue)}
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
            selected.length === locations.length ? "Select All" : selected.join(", ")
          }
          MenuProps={MenuProps}
        >
          <MenuItem onClick={handleSelectAllLocations}>
            <Checkbox
              checked={selectedLocations.length === locations.length}
              indeterminate={isLocationIndeterminate}
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

      <FormControl sx={{ m: 1, width: 150 }}>
        <InputLabel id="dust-type-filter-label">Dust Types</InputLabel>
        <Select
          labelId="dust-type-filter-label"
          id="dust-type-filter"
          multiple
          value={selectedDustTypes}
          onChange={handleDustTypeChange}
          input={<OutlinedInput label="Dust Types" />}
          renderValue={(selected) =>
            selected.length === dustTypes.length ? "Select All" : selected.join(", ")
          }
          MenuProps={MenuProps}
        >
          <MenuItem onClick={handleSelectAllDustTypes}>
            <Checkbox
              checked={selectedDustTypes.length === dustTypes.length}
              indeterminate={isDustTypeIndeterminate}
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
        <Button variant="contained" color="primary" onClick={applyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;

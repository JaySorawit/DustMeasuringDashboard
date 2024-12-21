// src/components/Filters.tsx
import React, { useState } from "react";
import { MenuItem, Select, FormControl, InputLabel, Box, Checkbox, ListItemText, OutlinedInput } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FilterProps {
  locations: string[];
  dustTypes: string[];
  onFilterChange: (filters: any) => void;
}

const FilterPanel: React.FC<FilterProps> = ({ locations, dustTypes, onFilterChange }) => {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDustTypes, setSelectedDustTypes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleLocationChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string[];
    setSelectedLocations(value);
    onFilterChange({ selectedLocations: value, selectedDustTypes, startDate, endDate });
  };

  const handleDustTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string[];
    setSelectedDustTypes(value);
    onFilterChange({
      selectedLocations,
      selectedDustTypes: value,
      startDate,
      endDate
    });
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    onFilterChange({ selectedLocations, selectedDustTypes, startDate: start, endDate: end });
  };

  return (
    <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Locations</InputLabel>
        <Select
          multiple
          value={selectedLocations}
          onChange={handleLocationChange}
          renderValue={(selected) => (selected as string[]).join(", ")}
          input={<OutlinedInput label="Locations" />}
        >
          {locations.map((location) => (
            <MenuItem key={location} value={location}>
              {location}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Dust Types</InputLabel>
        <Select
          multiple
          value={selectedDustTypes}
          onChange={handleDustTypeChange}
          renderValue={(selected) => (selected as string[]).join(", ")}
          input={<OutlinedInput label="Dust Types" />}
        >
          {dustTypes.map((type) => (
            <MenuItem key={type} value={type}>
              <Checkbox checked={selectedDustTypes.includes(type)} />
              <ListItemText primary={type} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box display="flex" gap={1} alignItems="center">
        <DatePicker
          selected={startDate}
          onChange={(date) => handleDateChange(date, endDate)}
          placeholderText="Start Date"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => handleDateChange(startDate, date)}
          placeholderText="End Date"
        />
      </Box>
    </Box>
  );
};

export default FilterPanel;

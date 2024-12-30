import React, { useState } from "react";
import {
  Autocomplete,
  Checkbox,
  TextField,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

interface Option {
  id: string | number;
  label: string;
}

const MultiSelectWithSelectAll: React.FC = () => {
  const options: Option[] = [
    { id: 1, label: "Option 1" },
    { id: 2, label: "Option 2" },
    { id: 3, label: "Option 3" },
    { id: 4, label: "Option 4" },
  ];

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: Option[]) => {
    const selectAllOption = newValue.find((option) => option.label === "Select All");
    if (selectAllOption) {
      if (selectedOptions.length === options.length) {
        setSelectedOptions([]); // Unselect all
      } else {
        setSelectedOptions(options); // Select all options
      }
    } else {
      setSelectedOptions(newValue);
    }
  };

  return (
    <Autocomplete
      multiple
      options={[{ id: "all", label: "Select All" }, ...options]}
      value={selectedOptions}
      onChange={handleChange}
      disableCloseOnSelect
      getOptionLabel={(option: Option) => option.label}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.label}
        </li>
      )}
      renderInput={(params) => <TextField {...params} label="Select Options" />}
    />
  );
};

export default MultiSelectWithSelectAll;

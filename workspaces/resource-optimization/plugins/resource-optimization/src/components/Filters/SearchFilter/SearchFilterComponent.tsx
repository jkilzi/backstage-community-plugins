import React, { useState } from 'react';
import { Chip, Typography, TextField, Box } from '@material-ui/core';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Stack from '@mui/material/Stack';
import { filtersType } from '../../ExampleComponent/ExampleComponent';

interface SearchFilterComponentProps {
  filterLabel: string;
  filterKey: keyof filtersType;
  onFilterChange?: (filters: string[], key: keyof filtersType) => void;
}

export const SearchFilterComponent: React.FC<SearchFilterComponentProps> = ({
  filterLabel,
  filterKey,
  onFilterChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      // Create new chip
      const newChip = inputValue.trim();
      setChips([...chips, newChip]);
      setInputValue(''); // Clear input after creating chip

      if (onFilterChange) {
        onFilterChange([...chips, newChip], filterKey);
      }
    }
  };

  const handleDeleteChip = (chipToDelete: string) => {
    const updatedChips = chips.filter(chip => chip !== chipToDelete);
    setChips(updatedChips);

    if (onFilterChange) {
      onFilterChange(updatedChips, filterKey);
    }
  };

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <Box pb={1} pt={1}>
      <Typography
        component="label"
        variant="button"
        style={{ fontWeight: 'bold' }}
      >
        {filterLabel}
        <TextField
          value={inputValue}
          variant="outlined"
          size="small"
          style={{ background: '#fff' }}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClear} edge="end">
                  <ClearIcon style={{ padding: '2px' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" marginTop={1} useFlexGap flexWrap="wrap">
          {chips.map((chip, index) => (
            <Chip
              size="small"
              key={index}
              label={chip}
              onDelete={() => handleDeleteChip(chip)}
            />
          ))}
        </Stack>
      </Typography>
    </Box>
  );
};

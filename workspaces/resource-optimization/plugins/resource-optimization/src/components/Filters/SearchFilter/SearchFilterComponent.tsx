import React, { useState } from 'react';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
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
        <Box flexDirection="row" marginTop={1} flexWrap="wrap">
          {chips.map((chip, index) => (
            <Chip
              size="small"
              key={index}
              label={chip}
              onDelete={() => handleDeleteChip(chip)}
            />
          ))}
        </Box>
      </Typography>
    </Box>
  );
};

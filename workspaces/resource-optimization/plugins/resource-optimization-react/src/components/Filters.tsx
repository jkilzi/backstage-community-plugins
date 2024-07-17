import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { ComboBox } from './ComboBox';

export type TableFiltersClassKey = 'root' | 'value' | 'heder' | 'filters';
const useFilterStyles = makeStyles(
  theme => ({
    root: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      marginRight: theme.spacing(3),
    },
    value: {
      fontWeight: 'bold',
      fontSize: 18,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      height: theme.spacing(7.5),
      justifyContent: 'space-between',
      borderBottom: `1px solid ${theme.palette.grey[500]}`,
    },
    filters: {
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  }),
  { name: 'BackstageTableFilters' },
);

export type Filter<T extends object = { label: string }> = {
  name: 'cluster' | 'project' | 'workload' | 'type';
  type: 'single' | 'multiple';
  options: Array<T>;
};

type SelectedFilters = Record<Filter['name'], string[]>;

type FiltersProps = {
  filters: Filter[];
  onChangeFilters: (arg: any) => any;
};

const initialState: SelectedFilters = {
  cluster: [],
  project: [],
  workload: [],
  type: [],
};

export function Filters(props: FiltersProps) {
  const { onChangeFilters } = props;
  const classes = useFilterStyles();

  const [selectedFilters, setSelectedFilters] =
    useState<SelectedFilters>(initialState);

  // Trigger re-rendering
  const handleClick = () => {
    setSelectedFilters(initialState);
  };

  useEffect(() => {
    onChangeFilters(selectedFilters);
  }, [onChangeFilters, selectedFilters]);

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Box className={classes.value}>Filters</Box>
        <Button color="primary" onClick={handleClick}>
          Reset
        </Button>
      </Box>
      <Box className={classes.filters}>
        {props.filters.map(filter => (
          <ComboBox
            label={filter.name.toUpperCase()}
            key={filter.name}
            options={filter.options}
            getOptionLabel={option => option.label}
            multiple={filter.type === 'multiple'}
          />
        ))}
      </Box>
    </Box>
  );
}

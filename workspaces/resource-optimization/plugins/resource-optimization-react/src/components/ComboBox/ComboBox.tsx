import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';
import { useStyles } from './useStyles';
import { RenderOptionLabel } from './RenderOptionLabel';
// import { useDebouncedEffect } from '@react-hookz/web';

type ExcludedAutocompleteProps =
  | 'clearOnEscape'
  | 'disableCloseOnSelect'
  | 'includeInputInList'
  | 'size'
  | 'popupIcon'
  | 'renderInput'
  | 'renderOption';

/** @public */
export type ComboBoxProps<T, Multiple extends boolean | undefined> = Omit<
  AutocompleteProps<T, Multiple, false, false>,
  ExcludedAutocompleteProps
> & {
  label: string;
};

/** @public */
export function ComboBox<
  T extends { label: string },
  Multiple extends boolean | undefined,
>(props: ComboBoxProps<T, Multiple>) {
  const classes = useStyles();
  const [_text, setText] = useState('');

  return (
    <Box className={classes.root} pb={1} pt={1}>
      <Typography className={classes.label} variant="button" component="label">
        {props.label}
      </Typography>
      <Autocomplete
        {...props}
        clearOnEscape
        disableCloseOnSelect={props.multiple}
        includeInputInList
        popupIcon={<ExpandMoreIcon data-testid="expand-icon" />}
        renderInput={params => (
          <TextField
            {...params}
            className={classes.input}
            onChange={e => {
              setText(e.currentTarget.value);
            }}
            variant="outlined"
          />
        )}
        renderOption={(option, { selected }) => (
          <RenderOptionLabel title={option.label} isSelected={selected} />
        )}
        size="small"
      />
    </Box>
  );
}

import { makeStyles } from '@material-ui/core/styles';

/** @public */
export type AutocompleteSearchFilterClassKey = 'input';

export const useStyles = makeStyles(
  {
    root: {},
    label: {},
    input: {},
    fullWidth: { width: '100%' },
    boxLabel: {
      width: '100%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  },
  {
    name: 'AutocompleteSearchFilter',
  },
);

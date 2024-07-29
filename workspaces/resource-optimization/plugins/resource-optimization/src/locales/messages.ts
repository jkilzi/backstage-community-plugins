import { defineMessages } from 'react-intl';

export default defineMessages({
    chartNoData: {
        defaultMessage: 'no data',
        description: 'no data',
        id: 'chartNoData',
    },
    chartCostForecastConeTooltip: {
        defaultMessage: '{value0} - {value1}',
        description: 'Cost forecast confidence min/max tooltip',
        id: 'chartCostForecastConeTooltip',
    },
    currencyAbbreviations: {
        defaultMessage:
          '{symbol, select, ' +
          'billion {{value} B} ' +
          'million {{value} M} ' +
          'quadrillion {{value} q} ' +
          'thousand {{value} K} ' +
          'trillion {{value} t} ' +
          'other {}}',
        description: 'str.match(/([\\D]*)([\\d.,]+)([\\D]*)/)',
        id: 'currencyAbbreviations',
    },
    unitTooltips: {
        defaultMessage:
          '{units, select, ' +
          'byte_ms {{value} Byte-ms} ' +
          'core_hours {{value} core-hours} ' +
          'gb {{value} GB} ' +
          'gb_hours {{value} GB-hours} ' +
          'gb_mo {{value} GB-month} ' +
          'gb_ms {{value} GB-ms} ' +
          'gibibyte_month {{value} GiB-month} ' +
          'hour {{value} hours} ' +
          'hrs {{value} hours} ' +
          'ms {{value} milliseconds} ' +
          'vm_hours {{value} VM-hours} ' +
          'other {{value}}}',
        description: 'return value and unit based on key: "units"',
        id: 'unitTooltips',
    },
    chartUsageTooltip: {
        defaultMessage:
          'Min: {min} {units}, Max: {max} {units}{br}Median: {median} {units}{br}Q1: {q1} {units}, Q3: {q3} {units}',
        description:
          'Min: {min} {units}, Max: {max} {units}{br}Median: {median} {units}{br}Q1: {q1} {units}, Q3: {q3} {units}',
        id: 'chartUsageTooltip',
    },
    units: {
        defaultMessage:
          '{units, select, ' +
          'cores {cores} ' +
          'ei {Ei} ' +
          'eib {EiB} ' +
          'gi {Gi} ' +
          'gib {GiB} ' +
          'ki {Ki} ' +
          'kib {KiB} ' +
          'mi {Mi} ' +
          'mib {MiB} ' +
          'm {m} ' +
          'millicores {millicores} ' +
          'other {}}',
        description: 'return the proper unit label based on key: "units"',
        id: 'units',
    },
});   


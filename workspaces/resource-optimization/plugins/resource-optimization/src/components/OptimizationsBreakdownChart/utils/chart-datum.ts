// /* eslint-disable no-nested-ternary */
// import type { ChartDatum } from '../types/ChartDatum';
// import type { FormatOptions, Formatter } from '../types/Formatter';

// function getMaxY(datum: ChartDatum) {
//   return datum.y0 !== undefined
//     ? Math.max(datum.y, datum.y0)
//     : Array.isArray(datum.y)
//     ? datum.y[0] !== null
//       ? Math.max(...datum.y)
//       : (datum as any).yVal !== null // For boxplot, which is hidden via `datum.y[0] = null` when all values are equal
//       ? (datum as any).yVal
//       : null
//     : datum.y;
// }

// function getMinY(datum: ChartDatum) {
//   return datum.y0 !== undefined
//     ? Math.min(datum.y, datum.y0)
//     : Array.isArray(datum.y)
//     ? datum.y[0] !== null
//       ? Math.min(...datum.y)
//       : (datum as any).yVal !== null // For boxplot, which is hidden via `datum.y[0] = null` when all values are equal
//       ? (datum as any).yVal
//       : null
//     : datum.y;
// }

// export function getMaxMinValues(data: ChartDatum[]) {
//   let max: number | null = null;
//   let min: number | null = null;
//   if (data && data.length > 0) {
//     for (const datum of data) {
//       const maxY = getMaxY(datum);
//       const minY = getMinY(datum);
//       if ((max === null || maxY > max) && maxY !== null) {
//         max = maxY;
//       }
//       if ((min === null || minY < min) && minY !== null) {
//         min = minY;
//       }
//     }
//   }

//   return { min, max };
// }

// export function getTooltipContent(formatter: Formatter) {
//   return function labelFormatter(
//     value: number,
//     unit: string | null = null,
//     options: FormatOptions = {},
//   ) {
//     const lookup = unitsLookupKey(unit);
//     if (lookup) {
//       return intl.formatMessage(messages.unitTooltips, {
//         units: lookup,
//         value: formatter(value, unit, options),
//       });
//     }
//     return formatCurrency(value, unit, options);
//   };
// }

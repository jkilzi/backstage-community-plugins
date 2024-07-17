import React from 'react';
import {
  Chart,
  // ChartArea,
  ChartAxis,
  ChartBoxPlot,
  // ChartLegend,
  // ChartLegendTooltip,
  // ChartScatter,
  // createContainer,
  // getInteractiveLegendEvents,
} from '@patternfly/react-charts';

type Props = {
  name: string;
  data: {
    limits: any;
    requests: any;
    usage: any;
  };
};

// type ChartDatum {
  
//   _min
//   _median
//   _max
//   _q1
//   _q3
// }

// const labelFormatter = (datum?: ChartDatum) => {
//   // With box plot data, datum.y will also be an array
//   if (datum && (datum._min || datum._median || datum._max || datum._q1 || datum._q3)) {
//     return `Min: ${datum._min}, Max: ${datum._max}\nMedian: ${datum._median}\nQ1: ${datum._q1}, Q3: ${datum._q3}`;
//   }
//   const yVal = Array.isArray(datum.y) ? datum.y[0] : datum.y;
//   return yVal !== null ? yVal : 'no data';
// }

// const CursorVoronoiContainer = createContainer('voronoi', 'cursor');

export const OptimizationsBreakdownChart: React.FC<Props> = props => {
  return (
    <Chart
      name={props.name}
      legendPosition="bottom"
      domainPadding={{ x: [30, 30] }}
    >
      <ChartAxis fixLabelOverlap />
      <ChartAxis dependentAxis showGrid />
      <ChartBoxPlot
        data={[
          {
            x: '2024-07-07T00:00:00.000Z',
            max: 52.48,
            median: 52.07,
            min: 52.05,
            q1: 52.07,
            q3: 52.14,
          },
          {
            x: '2024-07-07T06:00:00.000Z',
            max: 52.89,
            median: 52.39,
            min: 52.05,
            q1: 52.3,
            q3: 52.63,
          },
          {
            x: '2024-07-07T12:00:00.000Z',
            max: 52.33,
            median: 52.08,
            min: 51.75,
            q1: 52.07,
            q3: 52.16,
          },
          {
            x: '2024-07-07T18:00:00.000Z',
            max: 52.37,
            median: 52.1,
            min: 51.8,
            q1: 51.87,
            q3: 52.11,
          },
        ]}
        name="cats"
      />
    </Chart>
  );
};

import {
  LongTermRecommendationBoxPlots,
  MediumTermRecommendationBoxPlots,
  PlotsData,
  RecommendationBoxPlotsRecommendations,
  ShortTermRecommendationBoxPlots,
} from '@backstage-community/plugin-resource-optimization-common';
import { Interval, UsageType } from '../types/chart';
import { format } from 'date-fns';

export const getRecommendationTerm = (
  recommendations: RecommendationBoxPlotsRecommendations,
  interval: Interval,
):
  | ShortTermRecommendationBoxPlots
  | MediumTermRecommendationBoxPlots
  | LongTermRecommendationBoxPlots => {
  let result;
  switch (interval) {
    case Interval.shortTerm:
      result = recommendations?.recommendationTerms?.shortTerm;
      break;
    case Interval.mediumTerm:
      result = recommendations?.recommendationTerms?.mediumTerm;
      break;
    case Interval.longTerm:
      result = recommendations?.recommendationTerms?.longTerm;
      break;
  }

  return result || {};
};

export const createUsageDatum = (
  usageType: UsageType,
  currentInterval: Interval,
  recommendations?: RecommendationBoxPlotsRecommendations,
) => {
  const datum = [];

  if (recommendations) {
    const term = getRecommendationTerm(recommendations, currentInterval);
    const plotsData = term?.plots?.plotsData || {};

    for (const key of Object.keys(plotsData)) {
      const data = plotsData?.[key]?.[usageType];
      let correctedIsoDate = key.replace(
        /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(.*)Z/,
        '$1-$2-$3T$4:$5:$6Z',
      );
      console.log('Corrected ISO Date:', correctedIsoDate);
      const date = new Date(correctedIsoDate);
      const xVal =
        currentInterval === Interval.shortTerm
          ? format(date, 'kk:mm')
          : format(date, 'MMM d');
      datum.push({
        key,
        name: usageType,
        units: data?.format,
        x: xVal,
        y: data ? [data.min, data.median, data.max, data.q1, data.q3] : [null],
      });
    }
  }

  // Pad dates if plots_data is missing
  if (datum.length === 0 && recommendations?.monitoringEndTime) {
    if (currentInterval === Interval.shortTerm) {
      const today = new Date(recommendations?.monitoringEndTime);
      for (let hour = 24; hour > 0; hour -= 6) {
        today.setHours(today.getHours() - hour);
        datum.push({
          key: today.toDateString(),
          name: usageType,
          x: format(today, 'kk:mm'),
          y: [null],
        });
      }
    } else {
      for (
        let day = currentInterval === Interval.longTerm ? 15 : 7;
        day > 0;
        day--
      ) {
        const today = new Date(recommendations?.monitoringEndTime);
        today.setDate(today.getDate() - day);
        datum.push({
          key: today.toDateString(),
          name: usageType,
          x: format(today, 'MMM d'),
          y: [null],
        });
      }
    }
  }
  return datum;
};

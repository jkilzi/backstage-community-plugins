import React from 'react';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { optimizationsApiRef } from '../../api/refs';

export const ExampleFetchComponent2 = () => {
  const config = useApi(configApiRef);
  const api = useApi(optimizationsApiRef);

  const { value, loading, error } = useAsync(async () => {
    return (await api.getRecommendationList({ query: {} })).json();
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return [
    <div>{JSON.stringify(value, null, 2)}</div>,
    // <div>{JSON.stringify(config, null, 2)}</div>
  ];
};

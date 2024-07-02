import React from 'react';
import { Page, Header, Content } from '@backstage/core-components';
import { Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';

export const OptimizationsBreakdownPage = () => {
  const { id } = useParams();
  // const { value, error, loading } = useAsync(async () => {
  // });

  return (
    <Page themeId="tool">
      <Header
        title="Resource Optimization"
        type="Optimizations"
        typeLink="/resource-optimization"
      />

      <Content>
        <Typography variant="h4">Container 1</Typography>
      </Content>
    </Page>
  );
};

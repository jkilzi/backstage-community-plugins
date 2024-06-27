import React from 'react';
import { Page, Header, Content } from '@backstage/core-components';
import { Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';

export const RosDetailComponent = () => {
  const { id } = useParams();

  console.log('Checking id:', id);

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

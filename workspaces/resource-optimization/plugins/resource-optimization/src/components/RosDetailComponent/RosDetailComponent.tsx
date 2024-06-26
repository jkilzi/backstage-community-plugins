import React from 'react';
import { Page, Header, Content } from '@backstage/core-components';
import { Typography } from '@material-ui/core';

export const RosDetailComponent = () => {
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

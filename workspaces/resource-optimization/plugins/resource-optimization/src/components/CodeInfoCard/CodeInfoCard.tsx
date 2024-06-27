import { CodeSnippet, InfoCard } from '@backstage/core-components';
import { Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { generateYAMLCode } from '../../utils/generateYAMLCode';

const yamlCodeData = {
  limits: {
    cpu: 0.5,
    memory: '500Mi',
  },
  requests: {
    cpu: 0.1,
    memory: '20Mi',
  },
};

const YAMLCode = generateYAMLCode(yamlCodeData);

interface CodeInfoCardProps {
  cardTitle: string;
  showCopyCodeButton: boolean;
}

export const CodeInfoCard: React.FC<CodeInfoCardProps> = ({
  cardTitle,
  showCopyCodeButton,
}) => {
  console.log('Code:', YAMLCode);
  return (
    <InfoCard
      title={
        <Typography variant="body1" style={{ fontWeight: 'bold' }}>
          {cardTitle}
        </Typography>
      }
    >
      <CodeSnippet
        text={YAMLCode}
        language="yaml"
        showCopyCodeButton={showCopyCodeButton}
      />
    </InfoCard>
  );
};

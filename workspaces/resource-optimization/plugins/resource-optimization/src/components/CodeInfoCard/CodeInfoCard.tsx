import { CodeSnippet, InfoCard } from '@backstage/core-components';
import { Typography } from '@material-ui/core';
import React from 'react';
import {
  YAMLCodeDataType,
  generateYAMLCode,
} from '../../utils/generateYAMLCode';

const sampleYAMLCodeData = {
  limits: {
    cpu: '-',
    memory: '500Mi  # -85.1%',
  },
  requests: {
    cpu: 0.1,
    memory: '20Mi  # -86.1%',
  },
};

interface CodeInfoCardProps {
  cardTitle: string;
  showCopyCodeButton: boolean;
  yamlCodeData?: YAMLCodeDataType;
}

export const CodeInfoCard: React.FC<CodeInfoCardProps> = ({
  cardTitle,
  showCopyCodeButton,
  yamlCodeData,
}) => {
  const YAMLCode = generateYAMLCode(yamlCodeData || sampleYAMLCodeData);

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

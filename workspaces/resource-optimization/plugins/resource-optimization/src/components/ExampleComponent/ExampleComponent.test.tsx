import React from 'react';
import { ExampleComponent } from './ExampleComponent';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import {
  setupRequestMockHandlers,
  renderInTestApp,
  TestApiRegistry,
} from '@backstage/test-utils';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';
import { ApiProvider } from '@backstage/core-app-api';
import { optimizationsApiRef } from '../../apis';
import { searchApiRef } from '@backstage/plugin-search-react';
import { getRecommendationMockResponse } from './mockResponses';
import { RecommendationList } from '@backstage-community/plugin-resource-optimization-common';
import { TypedResponse } from '@backstage-community/plugin-resource-optimization-common/src/generated/apis/OptimizationsApi.client';

const emptySearchResults = Promise.resolve({
  results: [],
});

const recommendationsListResult: Promise<TypedResponse<RecommendationList>> =
  new Promise((resolve, reject) => {
    return {
      json: async () => getRecommendationMockResponse,
    };
  });

const query = () => emptySearchResults;
const querySpy = jest.fn(query);
const searchApi = { query: querySpy };

const catalogApi: jest.Mocked<CatalogApi> = {
  getEntitiesByRefs: jest.fn(),
} as any;

const getRecommendationList = () => recommendationsListResult;
const getRecommendationListSpy = jest.fn(getRecommendationList);
const optimizationApi = { getRecommendationList: getRecommendationListSpy };

// create apiRegistry for mocking apis
const apiRegistry = TestApiRegistry.from(
  [searchApiRef, searchApi],
  [optimizationsApiRef, optimizationApi],
  [catalogApiRef, catalogApi],
);

describe('ExampleComponent', () => {
  const server = setupServer();
  // Enable sane handlers for network requests
  setupRequestMockHandlers(server);

  // setup mock response
  beforeEach(() => {
    server.use(
      rest.get('/*', (_, res, ctx) => res(ctx.status(200), ctx.json({}))),
    );
  });

  it('should render', async () => {
    expect(1).toBeTruthy();
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <ExampleComponent />
      </ApiProvider>,
    );
    expect(screen.getByText('Resource Optimization')).toBeInTheDocument();
  });
});

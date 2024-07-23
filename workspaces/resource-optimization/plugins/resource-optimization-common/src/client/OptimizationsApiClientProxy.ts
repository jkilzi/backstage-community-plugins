import type { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { deepMapKeys } from '@y0n1/json/deep-map-keys';
import crossFetch from 'cross-fetch';
import camelCase from 'lodash/camelCase';
import { pluginId } from '../generated/pluginId';
import {
  DefaultApiClient,
  RequestOptions,
  TypedResponse,
} from '../generated/apis';
import type {
  GetRecommendationByIdRequest,
  GetRecommendationListRequest,
} from '../models/requests';
import type {
  RecommendationBoxPlots,
  RecommendationList,
  GetTokenResponse,
} from '../models/responses';
import { snakeCase } from 'lodash';

/** @public */
export type OptimizationsApi = Omit<
  InstanceType<typeof DefaultApiClient>,
  'fetchApi' | 'discoveryApi'
>;

/**
 * This class is a proxy for the original Optimizations client.
 * It provides the following additional functionality:
 *   1. Routes calls through the backend's proxy.
 *   2. Implements a token renewal mechanism.
 *
 * @public
 */
export class OptimizationsApiClientProxy implements OptimizationsApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  private readonly defaultClient: DefaultApiClient;
  private token?: string;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.defaultClient = new DefaultApiClient({
      fetchApi: options.fetchApi,
      discoveryApi: {
        async getBaseUrl() {
          const baseUrl = await options.discoveryApi.getBaseUrl('proxy');
          return `${baseUrl}/cost-management/v1`;
        },
      },
    });
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi ?? { fetch: crossFetch };
  }

  public async getRecommendationById(
    request: GetRecommendationByIdRequest,
  ): Promise<TypedResponse<RecommendationBoxPlots>> {
    const response = await this.fetchWithToken(
      this.defaultClient.getRecommendationById,
      request,
    );

    return response;
  }

  public async getRecommendationList(
    request: GetRecommendationListRequest,
  ): Promise<TypedResponse<RecommendationList>> {
    const response = await this.fetchWithToken(
      this.defaultClient.getRecommendationList,
      request,
    );

    return response;
  }

  private async getNewToken(): Promise<GetTokenResponse> {
    const baseUrl = await this.discoveryApi.getBaseUrl(`${pluginId}`);
    const response = await this.fetchApi.fetch(`${baseUrl}/token`);
    const data = (await response.json()) as GetTokenResponse;
    return data;
  }

  private async fetchWithToken<
    TRequest = GetRecommendationByIdRequest | GetRecommendationListRequest,
    TResponse = RecommendationBoxPlots | RecommendationList,
  >(
    asyncOp: DefaultApiClientOpFunc<TRequest, TResponse>,
    request: TRequest,
  ): Promise<TypedResponse<TResponse>> {
    if (!this.token) {
      const { accessToken } = await this.getNewToken();
      this.token = accessToken;
    }

    const snakeCaseTransformedRequest = deepMapKeys(
      request,
      snakeCase,
    ) as TRequest;

    let response = await asyncOp.call(
      this.defaultClient,
      snakeCaseTransformedRequest,
      {
        token: this.token,
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
        const { accessToken } = await this.getNewToken();
        this.token = accessToken;

        response = await asyncOp.call(
          this.defaultClient,
          snakeCaseTransformedRequest,
          {
            token: this.token,
          },
        );
      } else {
        throw new Error(response.statusText);
      }
    }

    return {
      ...response,
      json: async () => {
        const data = await response.json();
        const transformedData = deepMapKeys(data, camelCase) as TResponse;
        return transformedData;
      },
    };
  }
}

type DefaultApiClientOpFunc<
  TRequest = GetRecommendationByIdRequest | GetRecommendationListRequest,
  TResponse = RecommendationBoxPlots | RecommendationList,
> = (
  this: DefaultApiClient,
  request: TRequest,
  options?: RequestOptions,
) => Promise<TypedResponse<TResponse>>;

## API Report File for "@backstage-community/plugin-tech-insights-backend"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { AuthService } from '@backstage/backend-plugin-api';
import { BackendFeatureCompat } from '@backstage/backend-plugin-api';
import { CheckResult } from '@backstage-community/plugin-tech-insights-common';
import { Config } from '@backstage/config';
import { DatabaseService } from '@backstage/backend-plugin-api';
import { DiscoveryService } from '@backstage/backend-plugin-api';
import { Duration } from 'luxon';
import express from 'express';
import { FactChecker } from '@backstage-community/plugin-tech-insights-node';
import { FactCheckerFactory } from '@backstage-community/plugin-tech-insights-node';
import { FactLifecycle } from '@backstage-community/plugin-tech-insights-node';
import { FactRetriever } from '@backstage-community/plugin-tech-insights-node';
import { FactRetrieverRegistration } from '@backstage-community/plugin-tech-insights-node';
import { FactRetrieverRegistry as FactRetrieverRegistry_2 } from '@backstage-community/plugin-tech-insights-node';
import { HumanDuration } from '@backstage/types';
import { LoggerService } from '@backstage/backend-plugin-api';
import { PersistenceContext as PersistenceContext_2 } from '@backstage-community/plugin-tech-insights-node';
import { SchedulerService } from '@backstage/backend-plugin-api';
import { TechInsightCheck } from '@backstage-community/plugin-tech-insights-node';
import { TokenManager } from '@backstage/backend-common';

// @public
export const buildTechInsightsContext: <
  CheckType extends TechInsightCheck,
  CheckResultType extends CheckResult,
>(
  options: TechInsightsOptions<CheckType, CheckResultType>,
) => Promise<TechInsightsContext<CheckType, CheckResultType>>;

// @public
export function createFactRetrieverRegistration(
  options: FactRetrieverRegistrationOptions,
): FactRetrieverRegistration;

// @public
export function createRouter<
  CheckType extends TechInsightCheck,
  CheckResultType extends CheckResult,
>(options: RouterOptions<CheckType, CheckResultType>): Promise<express.Router>;

// @public
export const entityMetadataFactRetriever: FactRetriever;

// @public
export const entityOwnershipFactRetriever: FactRetriever;

// @public
export interface FactRetrieverEngine {
  getJobRegistration(ref: string): Promise<FactRetrieverRegistration>;
  schedule(): Promise<void>;
  triggerJob(ref: string): Promise<void>;
}

// @public (undocumented)
export type FactRetrieverRegistrationOptions = {
  cadence: string;
  factRetriever: FactRetriever;
  lifecycle?: FactLifecycle;
  timeout?: Duration | HumanDuration;
  initialDelay?: Duration | HumanDuration;
};

// @public @deprecated (undocumented)
export type FactRetrieverRegistry = FactRetrieverRegistry_2;

// @public
export const initializePersistenceContext: (
  database: DatabaseService,
  options: PersistenceContextOptions,
) => Promise<PersistenceContext_2>;

// @public @deprecated (undocumented)
export type PersistenceContext = PersistenceContext_2;

// @public
export type PersistenceContextOptions = {
  logger: LoggerService;
};

// @public
export interface RouterOptions<
  CheckType extends TechInsightCheck,
  CheckResultType extends CheckResult,
> {
  config: Config;
  factChecker?: FactChecker<CheckType, CheckResultType>;
  logger: LoggerService;
  persistenceContext: PersistenceContext_2;
}

// @public
export const techdocsFactRetriever: FactRetriever;

// @public (undocumented)
export type TechInsightsContext<
  CheckType extends TechInsightCheck,
  CheckResultType extends CheckResult,
> = {
  factChecker?: FactChecker<CheckType, CheckResultType>;
  persistenceContext: PersistenceContext_2;
  factRetrieverEngine: FactRetrieverEngine;
};

// @public (undocumented)
export interface TechInsightsOptions<
  CheckType extends TechInsightCheck,
  CheckResultType extends CheckResult,
> {
  // (undocumented)
  auth?: AuthService;
  // (undocumented)
  config: Config;
  // (undocumented)
  database: DatabaseService;
  // (undocumented)
  discovery: DiscoveryService;
  factCheckerFactory?: FactCheckerFactory<CheckType, CheckResultType>;
  factRetrieverRegistry?: FactRetrieverRegistry_2;
  factRetrievers?: FactRetrieverRegistration[];
  // (undocumented)
  logger: LoggerService;
  persistenceContext?: PersistenceContext_2;
  // (undocumented)
  scheduler: SchedulerService;
  // (undocumented)
  tokenManager: TokenManager;
}

// @public
const techInsightsPlugin: BackendFeatureCompat;
export default techInsightsPlugin;

// (No @packageDocumentation comment for this package)
```
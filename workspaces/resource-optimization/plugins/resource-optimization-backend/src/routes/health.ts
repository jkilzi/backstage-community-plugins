import { Router } from 'express';
import { RouterOptions } from '../service/createRouter';
import { getHealth } from '../controllers/health';

export const registerHealthRoutes = (
  router: Router,
  options: RouterOptions,
) => {
  router.get('/health', getHealth(options));
};

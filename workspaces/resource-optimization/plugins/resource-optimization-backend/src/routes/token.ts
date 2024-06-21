import { Router } from 'express';
import { RouterOptions } from '../service/createRouter';
import { getToken } from '../controllers/token';

export const registerTokenRoutes = (router: Router, options: RouterOptions) => {
  router.get('/token', getToken(options));
};

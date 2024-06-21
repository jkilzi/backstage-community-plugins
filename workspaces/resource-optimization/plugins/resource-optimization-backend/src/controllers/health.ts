import { RequestHandler } from 'express';
import { RouterOptions } from '../service/createRouter';

export const getHealth: (options: RouterOptions) => RequestHandler =
  options => (_, response) => {
    const { logger } = options;

    logger.info('PONG!');
    response.json({ status: 'ok' });
  };

import type { NextApiRequest, NextApiResponse } from 'next';
import { Logger } from '@mvp/lib/backend/Logger';
import { loggedInAuthMiddleware } from '@mvp/lib/backend/middleware/auth';
import DataProductRouter from '@mvp/lib/backend/services/dataspace/data-product-router';
import { array, minLength, object, optional, parse, string } from 'valibot';
import type { DataProduct } from '@shared/types';

const DataProductRequestSchema = object({
  slug: array(string(), [minLength(1)]),
  source: optional(string()),
});

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  logger: Logger
) {
  const { slug, source } = parse(DataProductRequestSchema, req.query);

  if (slug.length > 0) {
    const dataProduct = slug.join('/');

    return await DataProductRouter.execute(
      dataProduct as DataProduct,
      source,
      req,
      res,
      logger
    );
  }

  res.status(400).json({ message: 'Bad request' });
}

export default loggedInAuthMiddleware(handler);

import { loggedInAuthMiddleware } from '@mvp/lib/backend/middleware/auth';
import DataProductRouter from '@mvp/lib/backend/services/testbeb-gw/data-product-router';
import type { DataProduct } from '@shared/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { array, minLength, object, optional, parse, string } from 'valibot';

const DataProductRequestSchema = object({
  slug: array(string(), [minLength(1)]),
  source: optional(string()),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, source } = parse(DataProductRequestSchema, req.query);

  if (slug.length > 0) {
    const dataProduct = slug.join('/');

    return await DataProductRouter.execute(
      dataProduct as DataProduct,
      source,
      req,
      res
    );
  }

  res.status(400).json({ message: 'Bad request' });
}

export default loggedInAuthMiddleware(handler);

import type { NextApiRequest, NextApiResponse } from 'next';
import DataProductRouter, {
  DataProduct,
} from '@shared/lib/backend/services/testbeb-gw/data-product-router';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug, source } = req.query;

  if (slug instanceof Array && slug.length > 0) {
    const dataProduct = slug.join('/');
    const dataSource = source instanceof Array ? source[0] : source;

    return await DataProductRouter.execute(
      dataProduct as DataProduct,
      dataSource,
      req,
      res
    );
  }

  res.status(400).json({ message: 'Bad request' });
}

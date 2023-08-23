import type { NextApiRequest, NextApiResponse } from 'next';
import { loggedInAuthMiddleware } from '@mvp/lib/backend/middleware/auth';
import axios from 'axios';
import { parse } from 'valibot';
import {
  JmfRecommendationsRequestPayloadSchema,
  JmfRecommendationsResponseSchema,
} from '@shared/types';
import { JMF_SKILL_RECOMMENDATIONS_ENDPOINT } from '@shared/lib/api/endpoints';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Parse input
  const payload = parse(JmfRecommendationsRequestPayloadSchema, req.body);

  try {
    const response = await axios.post(
      JMF_SKILL_RECOMMENDATIONS_ENDPOINT,
      payload
    );
    const responseData = parse(JmfRecommendationsResponseSchema, response.data);
    res.status(response.status).json(responseData);
  } catch (error: any) {
    res
      .status(error?.response?.status || 500)
      .json({ message: error.message, context: 'JMF' });
  }
}

export default loggedInAuthMiddleware(handler);

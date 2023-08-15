import { loggedInAuthMiddleware } from '@mvp/lib/backend/middleware/auth';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'valibot';
import { JMF_SKILL_RECOMMENDATIONS_ENDPOINT } from 'vf-shared/src/lib/api/endpoints';
import { JmfRecommendationsRequestPayloadSchema, JmfRecommendationsResponseSchema } from 'vf-shared/src/types';

async function handler(req: NextApiRequest, res: NextApiResponse) {

    // Parse input
    const payload = parse(JmfRecommendationsRequestPayloadSchema, req.body);

    try {
        const response = await axios.post(JMF_SKILL_RECOMMENDATIONS_ENDPOINT, payload);
        const responseData = parse(JmfRecommendationsResponseSchema, response.data);
        res.status(response.status).json(responseData);
    } catch (error: any) {
        res.status(error?.response?.status || 500).json({ message: error.message, context: 'JMF' });
    }
}

export default loggedInAuthMiddleware(handler);

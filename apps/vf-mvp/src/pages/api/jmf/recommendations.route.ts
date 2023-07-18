import { loggedInAuthMiddleware } from '@mvp/lib/backend/middleware/auth';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { JMF_SKILL_RECOMMENDATIONS_ENDPOINT } from 'vf-shared/src/lib/api/endpoints';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await axios.post(JMF_SKILL_RECOMMENDATIONS_ENDPOINT, req.body);
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error?.response?.status || 500).json({ message: error.message, context: 'JMF' });
    }
}

export default loggedInAuthMiddleware(handler);

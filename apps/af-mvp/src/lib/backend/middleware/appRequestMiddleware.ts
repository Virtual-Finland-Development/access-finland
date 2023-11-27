import { cognitoVerifyMiddleware } from './cognitoVerifyMiddleware';
import { requestLoggingMiddleware } from './requestLogging';

/**
 * Common middleware for all app requests
 */
export function appRequestMiddleware(handler: NextApiHandlerWithLogger) {
  return cognitoVerifyMiddleware(requestLoggingMiddleware(handler));
}

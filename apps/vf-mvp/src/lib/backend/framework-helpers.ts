import { IncomingHttpHeaders } from 'http';

/**
 * Remove connection/forbidden headers from the incoming request so it can be forwarded to the external endpoints.
 *
 * @param req
 * @returns
 */
export function getForwardableHeaders(
  requestHeaders: IncomingHttpHeaders,
  extraHeaders?: Record<string, string>
) {
  const headers = {
    ...((requestHeaders as Record<string, string>) || {}),
    ...((extraHeaders as Record<string, string>) || {}),
  };

  delete headers.host;
  // Remove auto-added content headers
  delete headers['content-length'];
  // Remove forbidden connection header fields
  delete headers.connection;
  delete headers['keep-alive'];

  return headers;
}
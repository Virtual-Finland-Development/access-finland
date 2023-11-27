// Extends the NextApiHandler type to include a logger parameter
type NextApiHandlerWithLogger<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  logger?: Logger
) => unknown | Promise<unknown>;

/**
 * A function that takes a NextRequest and returns a NextResponse or null.
 * Null means the middleware did not handle the request and the next middleware should be called.
 */
type FrontendMiddlewareFunction = (
  request: NextRequest
) => Promise<NextResponse | null>;

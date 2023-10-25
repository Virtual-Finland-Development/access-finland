// Extends the NextApiHandler type to include a logger parameter
type NextApiHandlerWithLogger<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  logger?: Logger
) => unknown | Promise<unknown>;

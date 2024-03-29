// Reference to the frontend origin URI, which is not easily resolvable in the nextjs request context when requests are proxied through the load balancer etc.
export const FRONTEND_ORIGIN_URI = process.env.FRONTEND_ORIGIN_URI;
// Users API Access Key
export const USERS_API_ACCESS_KEY = process.env.USERS_API_ACCESS_KEY;

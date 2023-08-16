
// Reference to the frontend origin URI, which is not easily resolvable in the nextjs request context when requests are proxied through the load balancer etc.
export const FRONTEND_ORIGIN_URI = process.env.FRONTEND_ORIGIN_URI;

// Session signing key
export const BACKEND_SECRET_SIGN_KEY = process.env.BACKEND_SECRET_SIGN_KEY;
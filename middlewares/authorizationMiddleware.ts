import { withAuth } from "next-auth/middleware";

export const config = { matcher: ["/artworks"] };

export const authorizationMiddleware = withAuth;

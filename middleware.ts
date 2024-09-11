import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/uploadthing",
]);
export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();
  // ignoredRoutes: ["/api/(.*)"],
  // ignoredRoutes: ["/"],
});

export const config = {
  matcher: ["/", "/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};

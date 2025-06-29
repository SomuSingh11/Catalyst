import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes
const isPublicRoute = createRouteMatcher([ "/landing(.*)", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  // If the request is for a public route, allow access without authentication
  if (isPublicRoute(request)) {
    return;
  }

  // Protect all other routes
  await auth.protect();
});

export const config = {
  matcher: [
    // Protect specific routes and handle API routes
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

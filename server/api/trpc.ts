/**
 * Core tRPC Server Configuration
 *
 * This file sets up:
 * - Request context
 * - Error handling
 * - Middleware (auth + observability)
 * - Base procedure abstractions
 *
 * All routers and procedures build on top of these primitives.
 */

import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import prisma from "@/lib/db";


/**
 * ---------------------------------------
 * 1. CONTEXT CREATION
 * ---------------------------------------
 *
 * - This section defines the "contexts" that are available in the backend API.
 * - These allow you to access things when processing a request, like the database, the session, etc.
 * - This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 *   wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    prisma,   // Prisma client instance
    ...opts,  // Request-specific metadata
  };
};


/**
 * ---------------------------------------
 * 2. tRPC INITIALIZATION
 * ---------------------------------------
 *
 * - This is where the tRPC API is initialized, connecting the context and transformer. 
 * - We also parse ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 *   errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});


/**
 * ---------------------------------------
 * 3. CORE BUILDING BLOCKS
 * ---------------------------------------
 */
export const createCallerFactory = t.createCallerFactory; // Enables server-side calls to procedures
export const createTRPCRouter = t.router;                 // Router creator (used to define API modules)


/**
 * ---------------------------------------
 * 4. MIDDLEWARE
 * ---------------------------------------
 */

/**
 * Timing & Debug Middleware
 *
 * - Logs execution time of each procedure
 * - Simulates latency in development
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Authentication Middleware
 *
 * Ensures user is authenticated before accessing protected routes.
 * Injects user object into context for downstream usage.
 */
const isAuthenticated = t.middleware(async ({ next, ctx }) => {
  const { userId } = await auth();

  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in to access this resource" });
  }
  return next({
    ctx:{
      ...ctx,
      userId
    }
  });
});



/**
 * ---------------------------------------
 * 5. PROCEDURE TYPES
 * ---------------------------------------
 */

/**
 * Public Procedure
 *
 * - No authentication required
 * - Includes timing middleware
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected Procedure
 *
 * - Requires authentication
 * - Automatically provides `ctx.user`
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)  
  .use(isAuthenticated);
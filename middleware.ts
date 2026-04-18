import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/'])
const hasClerkPublishableKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
const isProduction = process.env.NODE_ENV === "production";
let hasLoggedMissingClerkKey = false;

const authMiddleware = clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();
});
const noopMiddleware = () => {
  if (isProduction) {
    throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required in production.");
  }

  if (!hasLoggedMissingClerkKey && process.env.NODE_ENV !== "test") {
    console.warn(
      "Clerk key not found. Authentication is disabled in local development until NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set."
    );
    hasLoggedMissingClerkKey = true;
  }

  return NextResponse.next();
};

export default hasClerkPublishableKey
  ? authMiddleware
  : noopMiddleware;

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

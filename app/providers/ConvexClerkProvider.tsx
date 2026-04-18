"use client"
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useEffect, useRef } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

const ConvexClerkProvider = ({ children }: { children: ReactNode }) => {
  const hasLoggedMissingClerkKey = useRef(false);

  useEffect(() => {
    if (!isProduction && !isTest && !clerkPublishableKey && !hasLoggedMissingClerkKey.current) {
      console.warn(
        "Clerk key not found. Authentication is disabled in local development until NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set."
      );
      hasLoggedMissingClerkKey.current = true;
    }
  }, []);

  if (!clerkPublishableKey) {
    if (isProduction) {
      throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required in production.");
    }
    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} appearance={{
      layout: { 
        socialButtonsVariant: 'iconButton',
        logoImageUrl: 'icons/logo.svg'
      },
      variables: {
        colorBackground: '#15171c',
        colorPrimary: '',
        colorText: 'white',
        colorInputBackground: '#1b1f29',
        colorInputText: 'white',
      }
    }}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default ConvexClerkProvider;

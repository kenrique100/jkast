"use client"
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const ConvexClerkProvider = ({ children }: { children: ReactNode }) => {
  if (!clerkPublishableKey) {
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

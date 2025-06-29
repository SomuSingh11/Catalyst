"use client";
import React, { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";

const queryClient = new QueryClient();

const Providers = ({ children }: ThemeProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <TRPCReactProvider>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </NextThemesProvider>
      </QueryClientProvider>
    </TRPCReactProvider>
  );
};

export default Providers;

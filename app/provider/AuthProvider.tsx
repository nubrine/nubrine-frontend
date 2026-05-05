"use client";

import { useEffect, useRef } from "react";

import { API_BASE } from "../lib/api";
import { useAuthStore } from "../stores/auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = useAuthStore((s) => s.status);
  const initialize = useAuthStore((state) => state.initialize);
  const initializeRef = useRef(false);

  // Initialize auth status once on mount
  useEffect(() => {
    if (!initializeRef.current) {
      initializeRef.current = true;
      initialize();
    }
  }, [initialize]);

  // Only redirect if unauthenticated AND we've finished checking
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = `${API_BASE}/api/v0/auth/google/login`;
    }
  }, [status]);

  if (status === "checking") {
    return (
      <>
        <div>
          <p>skeleton alternative</p>
        </div>
      </>
    );
  }

  if (status === "unauthenticated") {
    // This shouldn't render since we redirect above, but as a safety net
    return null;
  }

  return <>{children}</>;
}

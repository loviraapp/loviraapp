"use client";

import { useEffect, useState } from "react";
import { getUserRole } from "@/lib/role";
import type { UserRole } from "@/types/role";

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRole(getUserRole());
    setReady(true);
  }, []);

  return { role, ready };
}

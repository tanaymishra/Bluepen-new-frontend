"use client";
import React, { useEffect } from "react";
import { useAuth } from "./authentication";
import { useRouter } from "next/navigation";

interface authRoleProps {
  role: "student" | "admin" | "freelancer";
}

const IsAuthenticated: React.FC<authRoleProps> = ({ role }) => {
  const {
    clearUser,
    getUserRole,
    isAuthenticated,
    isHydrated,
    storeUser,
    user,
  } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated()) {
      if (role === "student") {
        window.location.href = `/login?prev=${window.location.pathname}`;
        // router.push("/login");
      } else if (role === "admin") {
        router.push("/admin-dashboard");
      } else if (role === "freelancer") {
        router.push("/freelancer-dashboard");
      }
    }
  }, [isHydrated, role, router]);

  return null;
};

export default IsAuthenticated;

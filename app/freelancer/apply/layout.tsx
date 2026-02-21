import React from "react";

export const metadata = {
    title: "Bluepen — Freelancer Application",
    description: "Apply to become a freelancer on Bluepen. Multi-step registration process.",
};

export default function FreelancerApplyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

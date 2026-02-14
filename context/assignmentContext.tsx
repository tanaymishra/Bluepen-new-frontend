"use client";
import React, { createContext, useContext, useState } from "react";

type AssignmentStatus = "All" | "Completed" | "Pending";

interface AssignmentContextType {
    activeStatus: AssignmentStatus;
    setActiveStatus: (status: AssignmentStatus) => void;
}

const AssignmentContext = createContext<AssignmentContextType | undefined>(undefined);

export const AssignmentProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeStatus, setActiveStatus] = useState<AssignmentStatus>("All");

    return (
        <AssignmentContext.Provider value={{ activeStatus, setActiveStatus }}>
            {children}
        </AssignmentContext.Provider>
    );
};

export const useAssignment = () => {
    const context = useContext(AssignmentContext);
    if (context === undefined) {
        throw new Error("useAssignment must be used within an AssignmentProvider");
    }
    return context;
};
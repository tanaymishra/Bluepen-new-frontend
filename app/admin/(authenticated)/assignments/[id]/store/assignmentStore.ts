import { create } from "zustand";

export interface AssignmentDetail {
    id: string;
    title: string;
    description: string;
    type: string;
    subtype: string;
    subject: string;
    stream: string;
    academicLevel: string;
    wordCount: string | number;
    deadline: string;
    submittedAt: string;
    stage: string;
    freelancerAmount: number;
    totalAmount: number;
    referencingStyle: string;
    marks: number | null;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    pmName: string;
    pmPhone: string;
    freelancerName: string;
    freelancerPhone: string;
    currentStep: number;
}

interface AssignmentStore {
    assignment: AssignmentDetail | null;
    loading: boolean;
    error: boolean;
    pmName: string;
    freelancerName: string;
    pmSheetOpen: boolean;
    flSheetOpen: boolean;

    setAssignment: (assignment: AssignmentDetail) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: boolean) => void;
    setPmName: (name: string) => void;
    setFreelancerName: (name: string) => void;
    setPmSheetOpen: (open: boolean) => void;
    setFlSheetOpen: (open: boolean) => void;
    resetTimeline: () => void;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
    assignment: null,
    loading: true,
    error: false,
    pmName: "",
    freelancerName: "",
    pmSheetOpen: false,
    flSheetOpen: false,

    setAssignment: (assignment) => set({ assignment }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setPmName: (pmName) => set({ pmName }),
    setFreelancerName: (freelancerName) => set({ freelancerName }),
    setPmSheetOpen: (pmSheetOpen) => set({ pmSheetOpen }),
    setFlSheetOpen: (flSheetOpen) => set({ flSheetOpen }),
    resetTimeline: () => {
        // TODO: Implement API call to reset timeline
        console.log("Reset timeline");
    },
}));

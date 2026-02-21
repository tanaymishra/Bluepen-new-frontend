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

interface AssignmentViewState {
    /* data */
    assignment: AssignmentDetail | null;
    loading: boolean;
    notFound: boolean;

    /* team selection */
    pmName: string;
    freelancerName: string;

    /* drawer toggles */
    pmDrawerOpen: boolean;
    flDrawerOpen: boolean;

    /* setters */
    setAssignment: (a: AssignmentDetail) => void;
    setLoading: (v: boolean) => void;
    setNotFound: (v: boolean) => void;
    setPmName: (n: string) => void;
    setFreelancerName: (n: string) => void;
    setPmDrawerOpen: (v: boolean) => void;
    setFlDrawerOpen: (v: boolean) => void;

    /* reset the whole slice when navigating away */
    reset: () => void;
}

const initial = {
    assignment: null,
    loading: true,
    notFound: false,
    pmName: "",
    freelancerName: "",
    pmDrawerOpen: false,
    flDrawerOpen: false,
};

export const useAssignmentViewStore = create<AssignmentViewState>((set) => ({
    ...initial,

    setAssignment: (assignment) => set({ assignment }),
    setLoading: (loading) => set({ loading }),
    setNotFound: (notFound) => set({ notFound }),
    setPmName: (pmName) => set({ pmName }),
    setFreelancerName: (freelancerName) => set({ freelancerName }),
    setPmDrawerOpen: (pmDrawerOpen) => set({ pmDrawerOpen }),
    setFlDrawerOpen: (flDrawerOpen) => set({ flDrawerOpen }),

    reset: () => set(initial),
}));

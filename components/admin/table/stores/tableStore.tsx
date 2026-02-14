import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PaginationState {
    searchValue: string;
    setSearchValue: (value: string) => void;
    // for pagination 
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalItems: number; // Add totalItems for showing entry count
    callbackFunction: () => void;
    setPageNumber: (pageNumber: number) => void;
    setPageSize: (pageSize: number) => void;
    setTotalPages: (totalPages: number) => void;
    setTotalItems: (totalItems: number) => void; // Add setter for totalItems
    // filters
    status: any;
    statusMarks: string;
    stream: string;
    pmList: any[];
    assignmentType: string[];
    startDate: string | null;
    endDate: string | null;
    paymentStatus: string;
    filter_marks_status: string[];
    setStatus: (status: string) => void;
    setStream: (stream: string) => void;
    setPmList: (pmList: string[]) => void;
    setAssignmentType: (assignmentType: string[]) => void;
    // general actions
    update: <K extends keyof PaginationState>(key: K, value: PaginationState[K]) => void;
    reset: () => void;

    month1:string;
    month2:string;
    setCallback: (callback: () => void) => void;
}

export const useTableStore = create<PaginationState>()(
    persist(
        (set) => ({
            searchValue: "",
            setSearchValue: (value) => set({ searchValue: value }),
            // pagination
            pageNumber: 1,
            pageSize: 25,
            totalPages: 1,
            totalItems: 0, // Initialize totalItems
            callbackFunction: () => { },
            setPageNumber: (pageNumber) => set({ pageNumber }),
            setPageSize: (pageSize) => set({ pageSize }),
            setTotalPages: (totalPages) => set({ totalPages }),
            setTotalItems: (totalItems) => set({ totalItems }), // Add setter
            // filters
            status: "",
            statusMarks: "",
            stream: "",
            paymentStatus: "",
            month1:"",
            month2:"",
            pmList: [],
            assignmentType: [],
            startDate: null,
            endDate: null,
            filter_marks_status: [],
            setStatus: (status) => set({ status }),
            setStream: (stream) => set({ stream }),
            setPmList: (pmList) => set({ pmList }),
            setAssignmentType: (assignmentType) => set({ assignmentType }),
            // general actions
            update: (key, value) => {
                set((state) => ({
                    ...state,
                    [key]: value,
                }));
            },            reset: () =>
                set({
                    searchValue: "",
                    pageNumber: 1,
                    pageSize: 25,
                    totalPages: 1,
                    totalItems: 0, // Reset totalItems
                    status: "",
                    statusMarks: "",
                    paymentStatus: "",
                    stream: "",
                    pmList: [],
                    assignmentType: [],
                    filter_marks_status: [],
                    month1:"",
                    month2:"",
                    startDate: null,
                    endDate: null
                }),
            setCallback: (callback) => set({ callbackFunction: callback }),
        }),
        {
            name: 'table-store',
        }
    )
);


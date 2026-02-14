import React, { useState, useRef, type JSX } from 'react';
import { useRouter } from 'next/navigation';
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useToast } from "@/context/toastContext";
import SearchBar from "@/components/admin/searchbar/searchbar";
import PaginationBar from "@/components/admin/paginationBar/paginationBar";
import { debounce } from "@/utils/debounce";
import useThrottleFunction from "@/utils/throttle";
import css from '@/styles/admin/studentprofile.module.scss';
import CreditPayModal from './modals/creditPayModal';

interface CreditData {
    id: number;
    name: string | React.ReactNode;
    assignmentId: number;
    assignmentTitle: string;
    credits: number;
    status: string;
    settledAssignment: number;
}

interface CreditTableProps {
    studentId: string | null;
    baseURL: string;
    userToken: string | undefined;
    NotAvailable: () => JSX.Element;
    userAssignments: Array<{ id: number; title: string; }>
}

const CreditTable: React.FC<CreditTableProps> = ({
    studentId,
    baseURL,
    userToken,
    NotAvailable,
    userAssignments
}) => {
    const router = useRouter();
    const { showToast } = useToast();
    const [hasSearched, setHasSearched] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [creditData, setCreditData] = useState<CreditData[]>([]);
    const [paginatedCredits, setPaginatedCredits] = useState<CreditData[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [selectedCreditId, setSelectedCreditId] = useState<number | null>(null);
    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

    const fetchCreditHistory = async () => {
        if (!userToken) return;
        try {
            const response = await fetch(`${baseURL}/team/creditTable`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    user_id: studentId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const creditDetails = data.data.map((item: any) => ({
                    id: item.id,
                    assignmentId: item.assignment_id,
                    name: item.firstname ? (
                        item.firstname + " " + item.lastname
                    ) : (
                        <NotAvailable />
                    ),
                    assignmentTitle: item.title,
                    credits: item.amount,
                    status: item.status,
                    settledAssignment: item.settledAssignment,
                }));

                setCreditData(creditDetails);
                updatePaginatedCredits(creditDetails, 1);
            }
        } catch (error) {
            console.error("Error fetching credit details:", error);
        }
    };

    const fetchCreditSearch = async (searchValue: string) => {
        if (!userToken) return;
        try {
            const response = await fetch(`${baseURL}/team/creditTableSearch`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    user_id: studentId,
                    search_value: searchValue,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const creditDetails = data.data.map((item: any) => ({
                    id: item.id,
                    assignmentId: item.assignment_id,
                    name: item.firstname ? (
                        item.firstname + " " + item.lastname
                    ) : (
                        <NotAvailable />
                    ),
                    assignmentTitle: item.title,
                    credits: item.amount,
                    status: item.status,
                    settledAssignment: item.settledAssignment,
                }));

                setCreditData(creditDetails);
                updatePaginatedCredits(creditDetails, 1);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    // Cell Renderers
    const creditsCellRenderer = (params: any) => {
        const { data } = params;

        if (data.status === "Paid" && data.settledAssignment) {
            return (
                <span
                    style={{
                        color: "#801311",
                        border: "1px solid #7E1C1C",
                        backgroundColor: "#EDB0B0",
                        padding: "4px 8px",
                        borderRadius: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        router.push(`/admin/assignments/details?id=${data.settledAssignment}`);
                    }}
                >
                    Settled against assignment {data.settledAssignment}
                </span>
            );
        }

        if (data.status === "Paid" && !data.settledAssignment) {
            return (
                <span
                    style={{
                        color: "#00510D",
                        border: "1px solid #28A87B",
                        backgroundColor: "#CFF4E7",
                        padding: "4px 8px",
                        borderRadius: "20px",
                        textAlign: "center",
                    }}
                >
                    Paid Normally
                </span>
            );
        }

        return (
            <div
                style={{
                    color: "#28A87B",
                    fontWeight: 600,
                    cursor: "pointer",
                }}
                onClick={() => {
                    if (data.id) {
                        handleCreditClick(data.id, data.credits);
                    }
                }}
            >
                {`+${params.value === 0 ? "-" : params.value}`}
            </div>
        );
    };

    const titleCellRenderer = (params: { value: string }) => {
        return <div>{params.value || "Professional Writing"}</div>;
    };

    const assignmentIdCellRenderer = (params: { value: string }) => {
        return (
            <div
                style={{
                    color: "var(--primary)",
                    cursor: "pointer",
                    fontWeight: 500,
                }}
                onClick={() => router.push(`/admin/assignments/details?id=${params?.value}`)}
            >
                {params.value}
            </div>
        );
    };

    const columnDefs: ColDef<CreditData>[] = [
        { headerName: "Name", field: "name", sortable: true, width: 180 },
        {
            headerName: "Assignment ID",
            field: "assignmentId",
            sortable: true,
            width: 130,
            cellRenderer: assignmentIdCellRenderer,
        },
        {
            headerName: "Assignment Title",
            field: "assignmentTitle",
            cellRenderer: titleCellRenderer,
            sortable: true,
            width: 530,
        },
        {
            headerName: "Credit Amount",
            field: "credits",
            cellRenderer: creditsCellRenderer,
            sortable: true,
            width: 240,
        },
    ];

    // Pagination functions
    const updatePaginatedCredits = (data: CreditData[], page: number) => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setPaginatedCredits(data.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(data.length / pageSize));
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            updatePaginatedCredits(creditData, nextPage);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            updatePaginatedCredits(creditData, prevPage);
        }
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setCurrentPage(1);
        updatePaginatedCredits(creditData, 1);
    };

    // Search handling
    const debouncedFetchSearch = useRef(debounce(fetchCreditSearch, 300)).current;
    const throttledFetchSearch = useThrottleFunction(fetchCreditSearch, 1000);

    const handleSearch = (value: string) => {
        if (!userToken) return;
        debouncedFetchSearch(value);
        throttledFetchSearch(value);
    };

    React.useEffect(() => {
        if (searchText && userToken) {
            fetchCreditSearch(searchText);
        } else if (hasSearched && userToken && !searchText) {
            fetchCreditHistory();
            setHasSearched(false);
        }
    }, [searchText, userToken]);

    React.useEffect(() => {
        if (userToken) {
            fetchCreditHistory();
        }
    }, [userToken]);

    const defaultColDef = {
        resizable: true,
        suppressMovable: true,
    };

    const gridOptions = {
        rowClass: css.customRow,
        rowHeight: 42,
    };

    const handleSettle = async (assignmentId: string) => {
        try {
            if (!selectedCreditId) return;
            const response = await fetch(`${baseURL}/team/giveCredit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    credit_id: selectedCreditId,
                    assignment_id: assignmentId
                }),
            });
            if (response.ok) {
                const data = await response.json();
                showToast(data.message, "success");
                setIsCreditModalOpen(false);
                fetchCreditHistory();
            }
        } catch (error) {
            console.error("Error settling credit:", error);
        }
    };

    const handlePay = async () => {
        try {
            if (!selectedCreditId) return;
            const response = await fetch(`${baseURL}/team/giveCredit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    credit_id: selectedCreditId,
                    assignment_id: ""
                }),
            });
            if (response.ok) {
                const data = await response.json();
                showToast(data.message, "success");
                setIsCreditModalOpen(false);
                fetchCreditHistory();
            }
        } catch (error) {
            console.error("Error paying credit:", error);
        }
    };

    const handleCreditClick = (creditId: number, amount: number) => {
        setSelectedCreditId(creditId);
        setPaymentAmount(amount);
        setIsCreditModalOpen(true);
    };

    return (
        <>
            <CreditPayModal
                isOpen={isCreditModalOpen}
                onClose={() => setIsCreditModalOpen(false)}
                paymentAmount={paymentAmount}
                userAssignments={userAssignments}
                onSettle={handleSettle}
                onPay={handlePay}
            />

            <div className={css.betweenTitle}>Credit History</div>
            <div className={css.tableWrapper}>
                <div className={css.tableUpper}>
                    <SearchBar
                        searchText={searchText}
                        handleSearchChange={handleSearch}
                        setSearchText={(value) => {
                            setSearchText(value);
                            if (value) {
                                setHasSearched(true);
                            }
                        }}
                        options={["Name", "Assignment ID", "Assignment Title", "Credits"]}
                    />
                </div>

                <div className={`ag-theme-alpine ${css.assignmentsGrid}`}>
                    <AgGridReact
                        rowData={paginatedCredits}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        suppressCellFocus={true}
                        gridOptions={gridOptions}
                    />
                </div>

                <PaginationBar
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                        updatePaginatedCredits(creditData, page);
                    }}
                    onPageSizeChange={handlePageSizeChange}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                />
            </div>
        </>
    );
};

export default CreditTable;

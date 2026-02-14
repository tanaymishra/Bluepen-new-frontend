import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useAuth } from "@/authentication/authentication";
import SearchBar from "@/components/admin/searchbar/searchbar";
import PaginationBar from "@/components/admin/paginationBar/paginationBar";
import { debounce } from "@/utils/debounce";
import useThrottleFunction from "@/utils/throttle";
import css from '@/styles/admin/studentprofile.module.scss';

interface ReferralData {
    userId: number;
    name: string;
    phone: string;
    email: string;
    assignmentId: number;
    assignmentTitle: string;
}

interface ReferralTableProps {
    studentId: string | null;
    baseURL: string;
    userToken: string | undefined;
}

const ReferralTable: React.FC<ReferralTableProps> = ({ studentId, baseURL, userToken }) => {
    const router = useRouter();
    const [hasSearched, setHasSearched] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [referralData, setReferralData] = useState<ReferralData[]>([]);
    const [paginatedReferrals, setPaginatedReferrals] = useState<ReferralData[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const fetchReferralHistory = async () => {
        if (!userToken) return;
        try {
            const response = await fetch(`${baseURL}/team/userReferralTable`, {
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
                const referralDetails = data.data.map((item: any) => ({
                    userId: item.user_id,
                    name: item.name,
                    phone: "+" + item.country_code + " " + item.phone,
                    email: item.email,
                    assignmentId: item.assignment_id,
                    assignmentTitle: item.assignment_title,
                }));

                setReferralData(referralDetails);
                updatePaginatedReferrals(referralDetails, 1);
            }
        } catch (error) {
            console.error("Error fetching referral details:", error);
        }
    };

    const fetchReferralSearch = async (searchValue: string) => {
        try {
            if (!userToken) return;
            const response = await fetch(`${baseURL}/team/userReferralTableSearch`, {
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
                const referralDetails = data.data.map((item: any) => ({
                    userId: item.user_id,
                    name: item.name,
                    phone: "+" + item.country_code + " " + item.phone,
                    email: item.email,
                    assignmentId: item.assignment_id,
                    assignmentTitle: item.assignment_title,
                }));

                setReferralData(referralDetails);
                updatePaginatedReferrals(referralDetails, 1);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    // Cell Renderers
    const studentIdCellRenderer = (params: { value: number }) => {
        return (
            <div
                style={{
                    color: "var(--primary)",
                    cursor: "pointer",
                    fontWeight: 500,
                }}
                onClick={() => router.push(`/admin/students/details?id=${params.value}`)}
            >
                {params.value}
            </div>
        );
    };

    const idCellRenderer = (params: { value: number }) => {
        return (
            <div
                style={{
                    color: "var(--primary)",
                    cursor: "pointer",
                    fontWeight: 500,
                }}
                onClick={() =>
                    router.push(
                        params.value ? `/admin/assignments/details?id=${params.value}` : ""
                    )
                }
            >
                {params.value ? params.value : "-"}
            </div>
        );
    };

    const assignmentTitleCellRenderer = (params: { value: number }) => {
        return <div>{params.value ? params.value : "-"}</div>;
    };

    const columnDefs: ColDef<ReferralData>[] = [
        {
            headerName: "User ID",
            field: "userId",
            cellRenderer: studentIdCellRenderer,
            sortable: true,
            width: 80,
        },
        { headerName: "Name", field: "name", sortable: true, width: 180 },
        { headerName: "Phone", field: "phone", sortable: true, width: 150 },
        { headerName: "Email", field: "email", sortable: true, width: 200 },
        {
            headerName: "Assignment ID",
            field: "assignmentId",
            cellRenderer: idCellRenderer,
            sortable: true,
            width: 130,
        },
        {
            headerName: "Assignment Title",
            field: "assignmentTitle",
            cellRenderer: assignmentTitleCellRenderer,
            sortable: true,
            width: 335,
        },
    ];

    // Pagination functions
    const updatePaginatedReferrals = (data: ReferralData[], page: number) => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setPaginatedReferrals(data.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(data.length / pageSize));
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            updatePaginatedReferrals(referralData, nextPage);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            updatePaginatedReferrals(referralData, prevPage);
        }
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setCurrentPage(1);
        updatePaginatedReferrals(referralData, 1);
    };

    // Search handling
    const debouncedFetchSearch = useRef(debounce(fetchReferralSearch, 300)).current;
    const throttledFetchSearch = useThrottleFunction(fetchReferralSearch, 1000);

    const handleSearch = (value: string) => {
        if (!userToken) return;
        debouncedFetchSearch(value);
        throttledFetchSearch(value);
    };

    React.useEffect(() => {
        if (searchText && userToken) {
            fetchReferralSearch(searchText);
        } else if (hasSearched && userToken && !searchText) {
            fetchReferralHistory();
            setHasSearched(false);
        }
    }, [searchText, userToken]);

    React.useEffect(() => {
        if (userToken) {
            fetchReferralHistory();
        }
    }, [userToken, studentId]);

    const defaultColDef = {
        resizable: true,
        suppressMovable: true,
    };

    const gridOptions = {
        rowClass: css.customRow,
        rowHeight: 42,
    };

    return (
        <>
            <div className={css.betweenTitle}>Referral History</div>
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
                        options={[
                            "ID",
                            "Name",
                            "Phone",
                            "Email",
                            "Assignment ID",
                            "Assignment Title",
                        ]}
                    />
                </div>

                <div className={`ag-theme-alpine ${css.assignmentsGrid}`}>
                    <AgGridReact
                        rowData={paginatedReferrals}
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
                        updatePaginatedReferrals(referralData, page);
                    }}
                    onPageSizeChange={handlePageSizeChange}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                />
            </div>
        </>
    );
};

export default ReferralTable;

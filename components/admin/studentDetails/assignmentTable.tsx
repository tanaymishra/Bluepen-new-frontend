import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import SearchBar from "@/components/admin/searchbar/searchbar";
import Dropdown from "@/components/admin/dropdown/dropdown";
import PaginationBar from "@/components/admin/paginationBar/paginationBar";
import { formatDate } from "@/utils/customJsFunctions/dateFormatJS";
import debouncer from "@/utils/debouncer";
import css from '@/styles/admin/studentprofile.module.scss';

interface Assignment {
  id: number;
  title: string;
}

interface AssignmentTableProps {
  studentId: string | null;
  baseURL: string;
  userToken: string | undefined;
  onAssignmentsUpdate?: (assignments: Assignment[]) => void;
}

interface RowData {
  id: number;
  title: string;
  stream: string;
  deadline: string;
  marks_obtained: number;
  marks_out_of: number;
  project_manager: string;
  status: string;
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({ studentId, baseURL, userToken, onAssignmentsUpdate }) => {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(100);

  const fetchAssignmentTable = async (search_value: string) => {
    if (!userToken) return;
    try {
      const response = await fetch(`${baseURL}/team/userAssignmentDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          id: studentId,
          search_value: search_value,
          filter_status: [status],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assignmentData = data.assignments.map((item: any) => ({
          id: item.id,
          title: item.title,
        }));
        
        if (onAssignmentsUpdate) {
          onAssignmentsUpdate(assignmentData);
        }
        
        const AssignmentDetails = data.assignments.map((item: any) => ({
          id: item.id,
          stream: item.stream,
          title: item.title,
          deadline: formatDate(item.deadline, "full"),
          marks_obtained: item.marks_obtained,
          marks_out_of: item.marks_out_of,
          project_manager: item.project_manager,
          status: item.status,
        }));

        setRowData(AssignmentDetails);
        updatePaginatedAssignments(AssignmentDetails, 1);
      }
    } catch (error) {
      console.error("Error fetching assignment details:", error);
    }
  };

  const handleAssignmentSearchDebounce = debouncer(fetchAssignmentTable, 300);

  const handleSearch = (value: string) => {
    if (!userToken) return;
    handleAssignmentSearchDebounce(value);
  };

  useEffect(() => {
    fetchAssignmentTable(searchText);
  }, [userToken, status]);

  // Pagination functions
  const updatePaginatedAssignments = (data: RowData[], page: number) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setRowData(data.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(data.length / pageSize));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      updatePaginatedAssignments(rowData, nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      updatePaginatedAssignments(rowData, prevPage);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    updatePaginatedAssignments(rowData, 1);
  };

  // Cell renderers
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

  const statusCellRenderer = (params: {
    value: string;
    data: {
      projectManager: string;
      freelancerName: string;
    };
  }) => {
    let color = "";
    let border = "";
    let backgroundColor = "";

    let displayText: React.ReactNode = params.value;

    switch (params.value) {
      case "Posted":
        color = "#666666";
        border = "1px solid #666666";
        backgroundColor = "#F5F5F5";
        break;
      case "Under Process":
        color = "#CCB834";
        border = "1px solid #CCB834";
        backgroundColor = "#ffffe6";
        break;
      case "Lost":
        color = "#EF4444";
        border = "1px solid #EF4444";
        backgroundColor = "#FEE2E2";
        break;
      case "Assigned to PM":
        color = "#2196F3";
        border = "1px solid #2196F3";
        backgroundColor = "#E3F2FD";
        displayText = (
          <>
            Assigned to PM{" "}
            <span style={{ color: "#000" }}>
              ({params.data?.projectManager})
            </span>
          </>
        );
        break;
      case "Assigned to Freelancer":
        color = "#FF9800";
        border = "1px solid #FF9800";
        backgroundColor = "#FFF3E0";
        displayText = (
          <>
            Assigned to Freelancer{" "}
            <span style={{ color: "#000" }}>
              ({params.data.freelancerName})
            </span>
          </>
        );
        break;
      case "Completed Marks Not Received":
        color = "rgb(163, 50, 207)";
        border = "1px solid rgb(163, 50, 207)";
        backgroundColor = "rgb(236, 222, 242)";
        break;
      case "Completed":
        color = "#28A87B";
        border = "1px solid #28A87B";
        backgroundColor = "#E9F7F0";
        break;
      case "Review Received":
        color = "#00BCD4";
        border = "1px solid #00BCD4";
        backgroundColor = "#E0F7FA";
        break;
      default:
        color = "#B22B28";
        border = "1px solid #B22B28";
        backgroundColor = "rgb(249, 180, 177)";
        break;
    }

    return (
      <div
        style={{
          color,
          border,
          backgroundColor,
          padding: "4px 8px",
          borderRadius: "20px",
        }}
      >
        {displayText}
      </div>
    );
    };
    
    const titleCellRenderer = (params: { value: string }) => {
        return <div>{params.value ? params.value : "Professional Writing"}</div>;
    };

    const marksCellRenderer = (params: {
        value: { field1: string; field2: string };
    }) => {
        const { field1, field2 } = params.value;
        return (
            <div>
                {field1 ? (
                    <div>
                        {" "}
                        <span>{field1}</span> / <span>{field2}</span>{" "}
                    </div>
                ) : (
                    "-"
                )}
            </div>
        );
    };

  const columnDefs: ColDef[] = [
      {
          headerName: "ID",
          field: "id",
          cellRenderer: idCellRenderer,
          sortable: true,
          width: 50,
      },
      {
          headerName: "Title",
          field: "title",
          cellRenderer: titleCellRenderer,
          sortable: true,
          width: 250,
      },
      {
          headerName: "Stream",
          field: "stream",
          sortable: true,
          width: 150,
      },
      {
          headerName: "Marks Obtained",
          field: "marks_obtained",
          valueGetter: (params: any) => {
              return {
                  field1: params.data.marks_obtained,
                  field2: params.data.marks_out_of,
              };
          },
          sortable: true,
          cellRenderer: marksCellRenderer,
          width: 150,
      },
      {
          headerName: "Deadline",
          field: "deadline",
          sortable: true,
          width: 200,
      },
      {
          headerName: "Project Manager",
          field: "project_manager",
          sortable: true,
          width: 200,
      },
      {
          headerName: "Status",
          field: "status",
          cellRenderer: statusCellRenderer,
          sortable: true,
          width: 150,
      },
  ];

  const defaultColDef = {
    resizable: true,
    suppressMovable: true,
  };

  const gridOptions = {
    rowClass: css.customRow,
    rowHeight: 42,
  };

  const handleStatusChange = (option: string) => {
    setCurrentPage(1);    
    setStatus(option);
  };

  return (
    <div className={css.tableWrapper}>
      <div className={css.betweenTitle}>Assignment History</div>
      <div className={css.tableUpper}>
        <SearchBar
          searchText={searchText}
          handleSearchChange={handleSearch}
          setSearchText={setSearchText}
          options={["Stream", "Title"]}
        />
        <div className={css.statusFilter}>
          <Dropdown
            options={[
              "All",
              "Under Process",
              "Assigned to PM",
              "Completed Marks Not Received",
              "Assigned to Freelancer",
              "Completed",
              "Review Received",
              "Lost",
              "Resit",
            ]}
            defaultOption="Status"
            onChange={handleStatusChange}
            style={{
              "--dropdown-border-radius": "8px",
              "--dropdown-margin-right": "8px",
              "--dropdown-text-color": "#444444",
              "--dropdown-width": "180px",
              "--dropdown-background-color": "#fff",
            } as React.CSSProperties}
            value={status}
            onReset={() => setStatus("")}
          />
        </div>
      </div>

      <div className={`ag-theme-alpine ${css.assignmentsGrid}`}>
        <AgGridReact
          rowData={rowData}
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
          updatePaginatedAssignments(rowData, page);
        }}
        onPageSizeChange={handlePageSizeChange}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
      />
    </div>
  );
};

export default AssignmentTable;

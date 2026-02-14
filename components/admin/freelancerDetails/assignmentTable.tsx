import React, { useState, useEffect } from 'react';
import { AgGridReact } from "ag-grid-react";
import { useRouter, useSearchParams } from "next/navigation";
import css from "@/styles/admin/freelancerDetails.module.scss";
import SearchBar from "@/components/admin/searchbar/searchbar";
import PaginationBar from "@/components/admin/paginationBar/paginationBar";
import SkeletonLoader from "@/ui/loader/skeletonLoader";
import debouncer from "@/utils/debouncer";
import { ColDef } from "ag-grid-community";
import { useFreelancerAssignments } from '@/components/admin/freelancerDetails/hooks/useFreelancerAssignments';
import { useTableStore } from '../table/stores/tableStore';
import Table from '../table/table';
import Dropdown from "@/components/admin/dropdown/dropdown";

import { useAuth } from '@/authentication/authentication';

interface RowData {
  id: number;
  title: string;
  marks_obtained: string;
  marks_out_of: string;
  marks_status: string;
  status: string;
}

interface AssignmentTableProps {
  freelancerMarksTable?: any[];
  loading?: boolean;
  onSearch?: (value: string) => void;
}

const baseURL = String(process.env.NEXT_PUBLIC_BASE_URL);

const AssignmentTable: React.FC<AssignmentTableProps> = ({
  freelancerMarksTable,
  loading,
  onSearch
}) => {
  const router = useRouter();
  const [displayData, setDisplayData] = useState<any[]>([]);

  const params = useSearchParams();
  const freelancer_id = params?.get("id");
  const { user } = useAuth();


  // Column definitions and renderers
  const idCellRenderer = (params: { value: number }) => {
    return (
      <div
        style={{
          color: "var(--primary)",
          cursor: "pointer",
        }}
        onClick={() =>
          router.push(`/admin/assignments/details?id=${params.value}`)
        }
      >
        {params.value}
      </div>
    );
  };

  const statusCellRenderer = (params: { value: string }) => {
    let color = "";
    let border = "";
    let backgroundColor = "";

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
        break;
      case "Assigned to Freelancer":
        color = "#FF9800";
        border = "1px solid #FF9800";
        backgroundColor = "#FFF3E0";
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
        {params.value}
      </div>
    );
  };
  const marksCellRenderer = (params: { value: number }) => {
    return <div>{params.value === 0 ? "-" : params.value}</div>;
  };


  const fetchFreelancerAssignment = async () => {
    if (!user?.token) return;
    const { searchValue, status, statusMarks, paymentStatus, setTotalPages, pageNumber, pageSize } = useTableStore.getState();
    try {
      const response = await fetch(`${baseURL}/team/freelancerAssignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          id: freelancer_id,
          page_number: pageNumber,
          pagination_number: pageSize,
          is_page_count_required: 1,
          search_value: searchValue,
          filter_status: status === "All" || status === "" ? []: [status],
          filter_marks_status: statusMarks === "All" || statusMarks === "" ? [] : [statusMarks],
          filter_payment_status: paymentStatus === "All" ? "" : paymentStatus,

        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setTotalPages(data.totalPages)
      const assignmentsData = data.assignmentsTable.map((item: any) => ({
        id: Number(item.id),
        studentName: item.name,
        stream: item.stream,
        title: item.title,
        user_id: item.user_id,
        description: item.description,
        marks_obtained: item.marks_obtained ? Number(item.marks_obtained) : null,
        marks_out_of: item.marks_out_of ? Number(item.marks_out_of) : null,
        status: item.status,
      }));

      setDisplayData(assignmentsData);
    } catch (error) {
      console.error("Error fetching freelancer assignments:", error);
    }
  };

  const columnDefs: ColDef<RowData>[] = [
    {
      headerName: "ID",
      field: "id",
      cellRenderer: idCellRenderer,
      sortable: true,
      width: 80,
      flex: 1,
    },
    {
      headerName: "Title",
      field: "title",
      sortable: true,
      width: 515,
      flex: 5,
    },

    {
      headerName: "Marks",
      valueGetter: (params) =>
        params?.data?.marks_obtained
          ? `${params?.data?.marks_obtained}/${params?.data?.marks_out_of}`
          : "-",
      sortable: true,
      width: 180,
      flex: 2,
    },
    {
      headerName: "Category",
      field: "marks_status",
      valueGetter: (params) => params?.data?.marks_status || "-",
      cellRenderer: marksCellRenderer,
      sortable: true,
      width: 100,
      flex: 2,
    },
    {
      headerName: "Status",
      valueGetter: (params) => params?.data?.status || "-",
      sortable: true,
      cellRenderer: statusCellRenderer,
      width: 250,
      flex: 3,
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

  useEffect(() => {
    const reset = useTableStore.getState().reset;
    return reset
  }, [])


  const { setCallback } = useTableStore.getState();

  useEffect(() => {
    setCallback(fetchFreelancerAssignment);
    fetchFreelancerAssignment();
  }, [user?.token, freelancer_id,]);



  if (loading) return <SkeletonLoader />;


  const handleStatusChange = (option: string) => {
    const update = useTableStore.getState().update;
    update("status", option);
    fetchFreelancerAssignment();
  }
  const handlePaymentStatus = (option: string) => {
    const update = useTableStore.getState().update;
    update("paymentStatus", option);
    fetchFreelancerAssignment();
  }
  const handleStreamStatusChange = (option: string) => {
    const update = useTableStore.getState().update;
    update("statusMarks", option);
    fetchFreelancerAssignment();
  }

  const renderFilters = () => {
    const { status, stream, statusMarks, update, paymentStatus } = useTableStore.getState();
    return (
      <div className={css.filtersContainer}>
        <div className={css.statusFilter}>
          <Dropdown
            options={["All", "paid", "unpaid"]}
            defaultOption="Payment"
            onChange={handlePaymentStatus}
            style={{
              "--dropdown-border-radius": "8px",
              "--dropdown-margin-right": "8px",
              "--dropdown-text-color": "#444444",
              "--dropdown-width": "150px",
              "--dropdown-background-color": "#fff",
            } as React.CSSProperties}
            value={paymentStatus}
            onReset={() => update("paymentStatus", "")}
          />
          {/* <Dropdown
            options={["All", "Academic Writing", "Programming", "Professional Writing"]}
            defaultOption="Category"
            onChange={handleStreamStatusChange}
            style={{
              "--dropdown-border-radius": "8px",
              "--dropdown-margin-right": "8px",
              "--dropdown-text-color": "#444444",
              "--dropdown-width": "150px",
              "--dropdown-background-color": "#fff",
            } as React.CSSProperties}
            value={statusMarks}
            onReset={() => update("statusMarks", "")}
          /> */}

          <Dropdown
            options={[
              "All",
              "Under Process",
              "Assigned to PM",
              "Assigned to Freelancer",
              "Completed Marks Not Received",
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
              "--dropdown-width": "150px",
              "--dropdown-background-color": "#fff",
            } as React.CSSProperties}
            value={status}
            onReset={() => update("status", "")}
          />
        </div>


      </div>
    );
  };
  return (
    <div className={css.tableWrapper}>
      <Table
        rowData={displayData}
        columnDefs={columnDefs}
        gridOptions={gridOptions}
        renderFilters={renderFilters}
      />
    </div>
  );
};

export default AssignmentTable;

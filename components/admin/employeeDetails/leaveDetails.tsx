import React, { useState, useEffect } from "react";
import css from "@/styles/admin/details.module.scss";
import { ColDef } from "ag-grid-community";
import Dropdown from "@/components/admin/dropdown/dropdown";
import { formatDate } from "@/utils/customJsFunctions/dateFormatJS";
import { useTableStore } from "../table/stores/tableStore";
import Table from "../table/table";
import { useAuthStore } from "@/authentication/authStore";

const baseURL = String(process.env.NEXT_PUBLIC_BASE_URL);

interface LeaveDetailsProps {
  employeeId: string | null;
  userToken: string | undefined;
}

interface RowData {
  leaveCategory: string;
  reason: string;
  from: string;
  to: string;
  total: number;
  status: string;
  rejectReason: string;
}

const LeaveDetails: React.FC<LeaveDetailsProps> = ({ employeeId, userToken }) => {
  const [statusLeaves, setStatusLeaves] = useState("");
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [paginatedLeaves, setPaginatedLeaves] = useState<RowData[]>([]);
  const [totalLeavePages, setTotalLeavePages] = useState<number>(1);
  const [leavePageSize, setLeavePageSize] = useState<number>(10);
  const [leavesStats, setLeavesStats] = useState<any>(null);

  const statusCellRenderer = (params: any) => {
    const { value } = params;
    let styles = {};

    if (value === "Approved") {
      styles = {
        color: "#00510D",
        border: "1px solid #28A87B",
        backgroundColor: "#CFF4E7",
      };
    } else if (value === "Rejected") {
      styles = {
        color: "#801311",
        border: "1px solid #7E1C1C",
        backgroundColor: "#EDB0B0",
      };
    } else if (value === "Applied") {
      styles = {
        color: "#0052CC",
        border: "1px solid #0052CC",
        backgroundColor: "#E6F0FF",
      };
    } else {
      styles = {
        color: "#000000",
        border: "1px solid #CCCCCC",
        backgroundColor: "#FFFFFF",
      };
    }

    return (
      <div
        style={{
          ...styles,
          padding: "4px 8px",
          borderRadius: "20px",
          textAlign: "center",
        }}
      >
        {value}
      </div>
    );
  };

  const columnDefs: ColDef<RowData>[] = [
    {
      headerName: "Leave Category",
      field: "leaveCategory",
      sortable: true,
      width: 180,
    },
    { headerName: "Reason", field: "reason", sortable: true, width: 180 },
    { headerName: "From", field: "from", sortable: true, width: 170 },
    { headerName: "To", field: "to", sortable: true, width: 170 },
    { headerName: "Total days", field: "total", sortable: true, width: 175 },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      cellRenderer: statusCellRenderer,
      width: 180,
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

  const updatePaginatedData = (data: RowData[], page: number) => {
    const startIndex = (page - 1) * leavePageSize;
    const endIndex = startIndex + leavePageSize;
    setPaginatedLeaves(data.slice(startIndex, endIndex));
    setTotalLeavePages(Math.ceil(data.length / leavePageSize));
  };

  const fetchLeavesDetails = async () => {
    const { searchValue, setTotalPages } = useTableStore.getState();
    const user = useAuthStore.getState().user;
    try {
      const response = await fetch(baseURL + `/team/employeeLeaveDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          employee_id: Number(employeeId),
          search_value: searchValue,
          filter_status: [statusLeaves],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const leaveTable = data.leaves.map((item: any) => ({
          leaveCategory: item.category,
          reason: item.reason,
          from: formatDate(item.leave_from, "dd/mm/yyyy"),
          to: formatDate(item.leave_to, "dd/mm/yyyy"),
          total: item.totaldays,
          status: item.status,
          rejectReason: item.reject_reason,
        }));
        setLeavesStats(data.stats);
        return leaveTable;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const { setCallback } = useTableStore();

  const handleFetch = async () => {

    const result = await fetchLeavesDetails();
    if (result) {
      setRowData(result);
      updatePaginatedData(result, 1);
    }
  };
  useEffect(() => {
    setCallback(handleFetch);
    handleFetch();
  }, [statusLeaves]);


  useEffect(() => {
    const status = useTableStore.getState().status;
    setStatusLeaves(status)
  }, [])

  const handleStatusChangeLeaveTable = (option: string) => {
    const { setPageNumber, update } = useTableStore.getState();
    setPageNumber(1);
    update("status", option)
    setStatusLeaves(option);
  };

  const renderFilters = () => {
    return (
      <div className={css.statusFilter}>
        <Dropdown
          options={["All", "Approved", "Rejected", "Applied"]}
          defaultOption="Status"
          onChange={handleStatusChangeLeaveTable}
          style={{
            "--dropdown-border-radius": "8px",
            "--dropdown-margin-right": "8px",
            "--dropdown-text-color": "#444444",
            "--dropdown-width": "100px",
            "--dropdown-background-color": "#fff",
          } as React.CSSProperties}
          value={statusLeaves}
          onReset={() => setStatusLeaves("")}
        />
      </div>
    )
  }
  return (
    <div className={css.leaveDetails}>
      <div className={css.leaveHead}>Leave Details</div>
      <div className={css.detailsRow}>
        <div className={css.detaisField}>
          <div className={css.fieldName}>Total</div>
          <div className={css.fieldValue}>{`${leavesStats?.totalLeaves}/24`}</div>
        </div>

        <div className={css.detaisField}>
          <div className={css.fieldName}>Casual</div>
          <div className={css.fieldValue}>{`${leavesStats?.casualLeaves}/18`}</div>
        </div>

        <div className={css.detaisField}>
          <div className={css.fieldName}>Sick</div>
          <div className={css.fieldValue}>{`${leavesStats?.sickLeaves}/6`}</div>
        </div>
      </div>
      <div className={css.tableWrapper}>
        <Table
          rowData={rowData}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          renderFilters={renderFilters}
        />
      </div>
    </div>
  );
};

export default LeaveDetails;

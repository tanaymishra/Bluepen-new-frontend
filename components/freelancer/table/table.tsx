import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import css from "@/styles/freelancer/components/table.module.scss";
import { Eye } from 'lucide-react';
import { relativeTime } from "@/utils/customJsFunctions/bluepenCustomJs";

interface AssignmentsTableProps {
  rowData: any[];
  activeTab: string;
}

const AssignmentsTable: React.FC<AssignmentsTableProps> = ({ rowData, activeTab }) => {
  const router = useRouter();

  const columnDefs = useMemo(() => [
    {
      headerName: "Title",
      field: "title",
      sortable: true,
      cellRenderer: (params:any) => (
        <a href="#" className={css.titleLink}>
          {params.value}
        </a>
      ),
      minWidth: 250,
      flex: 2,
      autoHeight: true,
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      cellRenderer: params => (
        <span className={`${css.status} ${params.value === "Completed" ? css['completed-status'] : css['pending-status']}`}>
          {params.value}
        </span>
      ),
      minWidth: 150,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Marks",
      field: "marks",
      sortable: true,
      cellRenderer: (params) => {
        const { marks_obtained, marks_out_of } = params.data;
        if (!marks_obtained || !marks_out_of) return "-";
        return `${marks_obtained}/${marks_out_of}`;
      },
      minWidth: 100,
      flex: 0.8,
      autoHeight: true,
    },
    {
      headerName: "Due in",
      field: "deadline", // Changed from dueIn to deadline to use the actual date field
      sortable: true,
      cellRenderer: params => {
        if (!params.value) return "-";
        
        try {
          const remainingTime = relativeTime(params.value, 'future');
          return (
            <div className={css.dueInContainer}>
              <span>{remainingTime}</span>
              {/* <div className={css.progressBar}>
                Progress bar implementation can be added here if needed
              </div> */}
            </div>
          );
        } catch (error) {
          console.error("Date parsing error:", error);
          return "-";
        }
      },
      minWidth: 150,
      flex: 1.2,
      autoHeight: true,
    },
    {
      headerName: "Deadline",
      field: "deadline",
      sortable: true,
      minWidth: 130,
      flex: 1,
      autoHeight: true,
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params:any) => (
        <button
          className={css.viewButton}
          onClick={() => router.push(`assignments/details?id=${params.data.id}`)}
        >
          <Eye size={14} />
          <span>View</span>
        </button>
      ),
      minWidth: 120,
      flex: 0.8,
      autoHeight: true,
      cellClass: 'actions-cell',
      headerClass: 'center-header',
    },
  ], [router]);

  return (
    <div className={css.tableWrapper}>
      <div className={css.tableHeader}>
        <span>Assignments Table</span>
      </div>
      <div className="ag-theme-alpine" style={{ width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          animateRows={true}
          pagination={false}
          defaultColDef={{
            resizable: true,
            sortable: true,
            suppressMovable: true,
            wrapText: true,
            autoHeight: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            cellClass: (params) => {
              if (params.column.getColId() === 'actions') {
                return 'actions-cell';
              }
            }
          }}
          overlayNoRowsTemplate={
            '<span class="no-data">No assignments found</span>'
          }
        />
      </div>
    </div>
  );
};

export default AssignmentsTable;
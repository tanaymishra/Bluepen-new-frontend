import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import css from "@/styles/freelancer/components/table.module.scss";
import { formatDate } from "@/utils/customJsFunctions/dateFormatJS";
import PaginationBar from "@/components/admin/paginationBar/paginationBar";
import { DownloadIcon } from "lucide-react";
import { EyeIcon } from "lucide-react";

interface InvoiceTableProps {
    rowData: any[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    onDownload?: (fileUrl: string) => void;  // Made optional since it's not used in the current call
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
    rowData,
    currentPage,
    pageSize,
    totalPages,
    onPageChange,
    onPageSizeChange,
    onDownload
}) => {
    const columnDefs = [
        {
            headerName: "Invoice ID",
            field: "id",
            sortable: true,
            cellRenderer: (params: any) => (
                <div className={css.titleLink}>
                    {params.value}
                </div>
            ),
            minWidth: 80,
            flex: 1,
            autoHeight: true,
        },
        {
            headerName: "No. of Assignments",
            field: "assignment_count",
            sortable: true,
            minWidth: 120,
            flex: 1,
            autoHeight: true,
        },
        {
            headerName: "Amount",
            field: "total_amount",
            sortable: true,
            cellRenderer: (params: any) => `₹${params.value}`,
            minWidth: 130,
            flex: 1,
            autoHeight: true,
        },
        {
            headerName: "Generated On",
            field: "generated_on",
            sortable: true,
            cellRenderer: (params: any) => formatDate(params.value, "dd-mm-yyyy"),
            minWidth: 150,
            flex: 1,
            autoHeight: true,
        },
        {
            headerName: "Status",
            field: "status",
            sortable: true,
            cellRenderer: (params: any) => (
                <div className={`${css.status} ${params.value === "Generated" ? css['completed-status'] : css['pending-status']}`}>
                    {params.value}
                </div>
            ),
            minWidth: 120,
            flex: 1,
            autoHeight: true,
        },
        {
            headerName: "Preview",
            field: "files",
            cellRenderer: (params: any) => (
                <button
                    className={css.viewButton}
                    onClick={() =>
                        window.open(
                            `${params.value}?inline=true`,
                            "_blank"
                        )
                    }
                >
                    <EyeIcon width={20} height={15}/>
                </button>
            ),
            minWidth: 120,
            flex: 0.8,
            autoHeight: true,
            cellClass: "actions-cell",
            headerClass: "center-header",
        },
        {
            headerName: "Download",
            field: "files",
            cellRenderer: (params: any) => (
                <button
                    className={css.viewButton}
                    onClick={() => onDownload && onDownload(params.value)}
                >
                    <DownloadIcon width={20} height={15}/>
                </button>
            ),
            minWidth: 120,
            flex: 0.8,
            autoHeight: true,
            cellClass: 'actions-cell',
            headerClass: 'center-header',
        }
    ];

    return (
        <div className={css.tableWrapper}>
            <div className={css.tableHeader}>
                <span>Past Invoices</span>
            </div>
            <div className="ag-theme-alpine" style={{ width: '100%', height: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    domLayout="autoHeight"
                    animateRows={true}
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

            <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                onNextPage={() => onPageChange(currentPage + 1)}
                onPreviousPage={() => onPageChange(currentPage - 1)}
            />
        </div>
    );
};

export default InvoiceTable;
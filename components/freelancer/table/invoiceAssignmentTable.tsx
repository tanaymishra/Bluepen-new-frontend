import React, { useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import css from '@/styles/freelancer/components/table.module.scss';
import PaginationBar from '@/components/admin/paginationBar/paginationBar';
import { formatDate } from '@/utils/customJsFunctions/dateFormatJS';
import { ColDef } from 'ag-grid-community';
import { useRouter } from 'next/navigation';
import Legend from '@/components/legend/legend';
import ThreeDotsOption from '@/ui/threeDotsOption/threeDotsOption';
import OptionsModal from '@/components/admin/optionsModal/optionsModal';

interface InvoiceAssignmentTableProps {
    rowData: any[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    onSelectionChange: (selectedIds: number[]) => void;
    onGridReady?: (api: any) => void;
    selectedAssignments: number[];
}

const InvoiceAssignmentTable: React.FC<InvoiceAssignmentTableProps> = ({
    rowData,
    currentPage,
    pageSize,
    totalPages,
    onPageChange,
    onPageSizeChange,
    onSelectionChange,
    onGridReady,
    selectedAssignments
}) => {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const modalRefOp = useRef<HTMLDivElement>(null);
    const moreBtnRefOp = useRef<HTMLDivElement>(null);

    const titleCellRenderer = (params: { value: string, data: any }) => {
        return (
            <div
                className={css.titleLink}
                onClick={() => router.push(`/admin/assignments/details?id=${params.data.id}`)}
                title={params.value} // Show full title on hover
            >
                {params.value}
            </div>
        );
    };

    const columnDefs: ColDef[] = [
        {
            headerName: '',
            field: 'checkbox',
            width: 50,
            checkboxSelection: true,
            sortable: false,
            suppressMenu: true,
            filter: false
        },
        {
            headerName: 'Assignment ID',
            field: 'assignment_id',
            sortable: true,
            cellRenderer: (params: any) => (
                <div
                    className={`${css.titleLink} ${params.data.addedToInvoice === 1 ? css.alreadyAdded : ''}
                    ${params.data.status === 'Assigned' ? css.assignedToFreelancer : ''}
                    ${(params.data.status === 'Failed' || params.data.status === 'Resit') ? css.failed : ''}
                    ${params.data.status === 'Lost' ? css.failed : ''}
                    `}
                    onClick={() => { router.push(`/freelancer/assignments/details?id=${params.value}`) }}
                >
                    #{params.value.toString().padStart(4, '0')}
                </div>
            ),
            minWidth: 120,
            flex: 1,
            autoHeight: true,
        },
        {
            headerName: 'Title',
            field: 'title',
            sortable: true,
            cellRenderer: titleCellRenderer,
            autoHeight: true, // Allow cell height to adjust
            wrapText: true, // Enable text wrapping
            cellStyle: {
                'white-space': 'normal',
                'line-height': '1.2',
                'padding': '8px'
            },
            minWidth: 250,
            flex: 2,
        },
        {
            headerName: 'Type',
            field: 'type',
            sortable: true,
            cellRenderer: (params: any) => {
                try {
                    // Handle both array formats: ["a","b"] and {\"a\",\"b\"}
                    const cleanStr = params.value.replace(/[\[\]{}\\\"]/g, '');
                    const types = cleanStr.split(',');
                    if (types.length > 1) {
                        return `${types[0]}, ...`;
                    }
                    return types[0] || '-';
                } catch {
                    return params.value || '-';
                }
            },
            minWidth: 150,
            flex: 1,
            autoHeight: true,
        },
        {
            headerName: 'PM',
            field: 'project_manager.name',
            sortable: true,
            minWidth: 120,
            flex: 1,
            autoHeight: true,
        },
        {
            headerName: 'Deadline',
            field: 'deadline',
            sortable: true,
            cellRenderer: (params: any) => formatDate(params.value, 'dd-mm-yyyy'),
            minWidth: 120,
            flex: 1,
            autoHeight: true,
        },
        {
            headerName: 'Amount',
            field: 'freelancer_amount',
            sortable: true,
            cellRenderer: (params: any) =>
                params.value ? `₹${params.value.toLocaleString('en-IN')}` : '-',
            minWidth: 120,
            flex: 1,
            autoHeight: true,
        }
    ];

    return (
        <div className={css.tableWrapper}>
            <div className={css.tableHeader}>
                <div className={css.headLegend}>
                    <span>Assignments</span>

                    <div className={css.legendCont}>
                        <ThreeDotsOption
                            btnRef={moreBtnRefOp as any}
                            onClick={() => setModalOpen(!modalOpen)}
                        />
                        <OptionsModal
                            isOpen={modalOpen}
                            className={css.optionsModal}
                            options={[
                                {
                                    component: <Legend
                                        items={[
                                            { color: '#b22b28', label: 'Already Added to another invoice' },
                                            { color: 'var(--primary)', label: 'Completed' },
                                            { color: '#28a87b', label: 'Assigned' },
                                            { color: '#FFAFA3', label: 'Failed / Resit' },
                                            { color: 'red', label: 'Lost' },
                                        ]}
                                    />,
                                },
                            ]}
                            onClose={() => setModalOpen(false)}
                            modalRef={modalRefOp as any}
                            btnRef={moreBtnRefOp as any}
                            itemStyle={{
                                padding: "2px 4px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: 500,
                                zIndex: 100,
                                width: "100%",
                            }}
                            itemClassName={css.modalItem}
                        />
                    </div>
                </div>
            </div>
            <div className="ag-theme-alpine" style={{ width: '100%', height: '470px' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    domLayout="normal"
                    animateRows={true}
                    rowSelection={{
                        mode: 'multiRow',
                        checkboxes: false,
                        headerCheckbox: false,
                        enableSelectionWithoutKeys: true,
                        enableClickSelection: true
                    }}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        suppressMovable: true,
                        wrapText: true,
                        wrapHeaderText: true,
                        autoHeaderHeight: true,
                    }}
                    getRowId={(params) => params.data.assignment_id}
                    rowClassRules={{
                        [css.disabledRow]: (params) => {
                            return !(params.data.status === 'Completed' &&
                                (!params.data.addedToInvoice || params.data.addedToInvoice === 0));
                        }
                    }}
                    onSelectionChanged={(event) => {
                        const selectedRows = event.api.getSelectedRows();
                        onSelectionChange(selectedRows.map(row => row.assignment_id));
                    }}
                    onGridReady={(params) => {
                        onGridReady?.(params.api);
                        params.api.deselectAll();

                        // Recompute row heights after data is loaded
                        params.api.resetRowHeights();
                    }}
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

export default InvoiceAssignmentTable;
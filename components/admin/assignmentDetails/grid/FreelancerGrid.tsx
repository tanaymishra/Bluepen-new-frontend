import { AgGridReact } from "ag-grid-react";
import { FreelancerData } from "../types";
import { ColDef } from "ag-grid-community";
import css from "@/styles/admin/assignmentDetails.module.scss";

interface FreelancerGridProps {
  data: FreelancerData[];
  selectedIds: number[];
  onSelect: (id: number) => void;
}

export const FreelancerGrid: React.FC<FreelancerGridProps> = ({
  data,
  selectedIds,
  onSelect,
}) => {
  const columnDefs: ColDef[] = [
    {
      headerName: "ID",
      field: "id",
      cellRenderer: (params: { data: FreelancerData }) => (
        <div className={css.cellWithCheckbox}>
          <input
            type="checkbox"
            checked={selectedIds.includes(params.data.id)}
            onChange={() => onSelect(params.data.id)}
          />
          {params.data.id}
        </div>
      ),
      width: 120,
    },
    { headerName: "Name", field: "name", sortable: true, width: 180 },
    { headerName: "Email", field: "email", sortable: true, width: 150 },
    { headerName: "Phone", field: "number", sortable: true, width: 150 },
    { headerName: "WhatsApp", field: "whatsapp", sortable: true, width: 150 },
  ];

  return (
    <div className="ag-theme-alpine">
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={{
          resizable: true,
          suppressMovable: true,
        }}
        rowClass={css.customRow}
        rowHeight={42}
      />
    </div>
  );
};

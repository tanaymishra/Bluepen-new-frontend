import { AgGridReact } from "ag-grid-react";
import { PMData } from "../types";
import { ColDef } from "ag-grid-community";
import css from "@/styles/admin/assignmentDetails.module.scss";

interface PMGridProps {
  data: PMData[];
  selectedPM: PMData | null;
  onSelect: (pm: PMData) => void;
}

export const PMGrid: React.FC<PMGridProps> = ({
  data,
  selectedPM,
  onSelect,
}) => {
  const columnDefs: ColDef[] = [
    {
      headerName: "ID",
      field: "id",
      cellRenderer: (params: { data: PMData }) => (
        <div className={css.cellWithRadio}>
          <input
            type="radio"
            name="rowSelection"
            checked={selectedPM?.id === params.data.id}
            onChange={() => onSelect(params.data)}
          />
          {params.data.id}
        </div>
      ),
      width: 120,
    },
    { headerName: "Name", field: "name", sortable: true, width: 180 },
    { headerName: "Email", field: "email", sortable: true, width: 150 },
    { headerName: "Phone", field: "number", sortable: true, width: 150 },
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

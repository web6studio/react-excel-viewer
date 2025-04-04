import { AgGridReact } from "ag-grid-react";
import { Pagination } from "./Pagination";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

// Styles and features
ModuleRegistry.registerModules([AllCommunityModule]);

type Props = {
  file: {
    columns: ColumnDef[];
    rows: RowData[];
    total: number;
  };
  page: number;
  setPage: (page: number | ((prev: number) => number)) => void;
};

export const FileGridPreview = ({ file, page, setPage }: Props) => {
  const totalPages = Math.ceil(file.total / 100);

  return (
    <div className="mt-2">
      <div
        style={{ height: "calc(100vh - 290px)", width: "100%" }}
        className="grid-height-mobile"
      >
        <AgGridReact
          rowData={file.rows}
          columnDefs={file.columns
            .filter((col) => col.key !== "_id")
            .map((col) => ({
              field: col.key,
              headerName: col.label,
              sortable: true,
              filter: true,
              resizable: true,
            }))}
          defaultColDef={{
            flex: 1,
            minWidth: 120,
            editable: true,
          }}
        />
      </div>

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

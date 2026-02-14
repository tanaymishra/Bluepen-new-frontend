import React, { useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import css from "./tableComponent.module.scss";
import PaginationBar from "../paginationBar/paginationBar";
import {
  handleNextPage,
  handlePreviousPage,
  onPageChange,
  onPageSizeChange,
  handleSearch,
} from "./functions/table/tableFunction";
import { useTableStore } from "./stores/tableStore";
import SearchBar from "@/components/admin/searchbar/searchbar";
import TableSkeletonLoader from "@/ui/loader/tableSkeletonLoader";

interface TableProps {
  rowData: any;
  columnDefs: any;
  gridOptions: any;
  renderFilters?: () => React.ReactNode;
  pmList?: () => React.ReactNode;
  assignmentTypeList?: () => React.ReactNode;
  totalItems?: number; // Add optional totalItems prop
}

const Table: React.FC<TableProps> = ({ 
  rowData, 
  columnDefs, 
  gridOptions, 
  renderFilters, 
  pmList, 
  assignmentTypeList,
  totalItems 
}) => {
  const { 
    update,
    pageNumber, 
    pageSize, 
    totalPages, 
    searchValue,
    reset,
    totalItems: storeTotalItems,
    setTotalItems
  } = useTableStore();

  
    useEffect(()=>{
      return reset
    },[])
    
    // Update store's totalItems if provided as prop
    useEffect(() => {
      if (totalItems !== undefined) {
        setTotalItems(totalItems);
      }
    }, [totalItems, setTotalItems]);

  if (!rowData) {
    return <TableSkeletonLoader />;
  }

  // Use prop value if provided, otherwise use store value
  const displayTotalItems = totalItems !== undefined ? totalItems : storeTotalItems;

  return (
    <div>
      <div className={css.tableHeader}>
        <div className={css.searchAndFilters}>
          <div className={css.topControls}>
            <SearchBar
              searchText={searchValue}
              handleSearchChange={handleSearch}
              setSearchText={(value) => update("searchValue", value)}
            />
            {renderFilters ? renderFilters() : null}          </div>
          {pmList ? pmList() : null}
          {assignmentTypeList ? assignmentTypeList() : null}
        </div>
      </div>
      <div className={`ag-theme-alpine ${css.assignmentsGrid}`}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          suppressCellFocus={true}
          gridOptions={gridOptions}
        />
      </div>
      <PaginationBar
        currentPage={pageNumber}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
        totalItems={displayTotalItems}
      />
    </div>
  );
};

export default Table;

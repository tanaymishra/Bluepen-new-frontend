import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import Drawer from "@/components/ui/radix-drawer";
import SearchBar from '@/components/admin/searchbar/searchbar';
import PaginationBar from '@/components/admin/paginationBar/paginationBar';
import { useToast } from '@/context/toastContext';
import { useAuth } from '@/authentication/authentication';
import { debounce } from '@/utils/debounce';
import useThrottleFunction from '@/utils/throttle';
import css from '@/styles/admin/assignmentDetails.module.scss';
import { PMData, FreelancerData, PMFreelancerDrawerProps } from '../types/index';

const baseURL = String(process.env.NEXT_PUBLIC_BASE_URL);

const PMFreelancerDrawer: React.FC<PMFreelancerDrawerProps> = ({
  isOpen,
  onClose,
  currentListType,
  drawerTitle,
  assignmentNumber,
  assignmentDetailsResponse,
  fetchAssignmentDetails,
}) => {
  const [selectedRow, setSelectedRow] = useState<PMData | null>(null);
  const [selectedRowsFL, setSelectedRowsFL] = useState<number[]>([]);
  const [pmList, setPMList] = useState<PMData[]>([]);
  const [freelancerList, setFreelancerList] = useState<FreelancerData[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchTextFL, setSearchTextFL] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [gridApi, setGridApi] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [previousFreelancerId, setPreviousFreelancerId] = useState<number>(0);

  const { user } = useAuth();
  const { showToast } = useToast();
  const userToken = user?.token;

  const fetchPMList = async () => {
    try {
      const response = await fetch(`${baseURL}/team/getProjectManagerList`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        const pmListData = data.data.map((item: any) => ({
          id: Number(item.id),
          name: item.name,
          email: item.email,
          number: item.number,
          role: item.role,
        }));

        setPMList(pmListData);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchFreelancerList = async (
    pageNumber: number | string,
    pageSize: number = 10
  ) => {
    try {
      const response = await fetch(`${baseURL}/team/getFreelancersList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          last_freelancer_id: pageNumber,
          pagination_number: pageSize,
          is_page_count_required: 1,
          page_number: currentPage,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const freelancerListData = data.data.map((item: any) => ({
          id: Number(item.id),
          name: item.name,
          email: item.email,
          number: item.number,
          whatsapp: item.whatsapp,
        }));

        setFreelancerList(freelancerListData);
        setTotalPages(data.totalPages);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const assignToPM = async () => {
    try {
      const response = await fetch(`${baseURL}/team/assignToPM`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          assignmentId: assignmentNumber,
          projectManagerId: selectedRow?.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        showToast(data.message, "success");

        // Fetch updated assignment details
        await fetchAssignmentDetails();
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const assignToFreelancer = async (freelancerId: number[]) => {
    try {
      const response = await fetch(`${baseURL}/team/assignToFreelancer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          assignmentId: assignmentNumber,
          freelancerID: freelancerId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        showToast(data.message, "success");
        setSelectedRowsFL([]);
        await fetchAssignmentDetails();
      } else {
        const errorData = await response.json();
        showToast(errorData.message, "error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columnDefs: ColDef<PMData>[] = [
    {
      headerName: "ID",
      field: "id",
      cellRenderer: (params: { data: PMData }) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: "4px",
            fontWeight: 500,
            color: "var(--primary",
          }}
        >
          <input
            type="radio"
            name="rowSelection"
            checked={selectedRow?.id === params.data.id}
            onChange={() => {
              setSelectedRow(params.data);
            }}
          />
          {params.data.id}
        </div>
      ),
      width: 120,
    },

    { headerName: "Name", field: "name", sortable: true, width: 180 },
    {
      headerName: "Email",
      field: "email",
      sortable: true,
      width: 150,
    },
    { headerName: "Phone", field: "number", sortable: true, width: 150 },
  ];

  const freelancerColumnDefs: ColDef<FreelancerData>[] = [
    {
      headerName: "ID",
      field: "id",
      cellRenderer: (params: { data: FreelancerData }) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: "4px",
            fontWeight: 500,
            color: "var(--primary)",
          }}
        >
          <input
            type="checkbox"
            name="rowSelection"
            checked={selectedRowsFL.includes(Number(params.data.id))}
            onChange={() => handleRowSelection(Number(params.data.id))}
          />
          {params.data.id}
        </div>
      ),
      width: 120,
    },

    { headerName: "Name", field: "name", sortable: true, width: 180 },
    {
      headerName: "Email",
      field: "email",
      sortable: true,
      width: 150,
    },
    { headerName: "Phone", field: "number", sortable: true, width: 150 },
    { headerName: "Whatsapp", field: "whatsapp", sortable: true, width: 150 },
  ];

  const defaultColDef = {
    resizable: true,
    suppressMovable: true,
  };

  const gridOptions = {
    rowClass: css.customRow,
    rowHeight: 42,
  };

  const onPageSizeChanged = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleRowSelection = (id: number) => {
    setSelectedRowsFL(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      }
      return [...prev, id];
    });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPreviousFreelancerId(freelancerList[0]?.id);
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      if (searchTextFL) {
        fetchFreelancerSearch(
          searchTextFL,
          freelancerList[pageSize - 1]?.id,
          pageSize
        );
      } else {
        // For normal pagination
        fetchFreelancerList(freelancerList[pageSize - 1]?.id, pageSize);
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);

      if (searchTextFL) {
        if (prevPage === 1) {
          fetchFreelancerSearch(searchTextFL, "", pageSize);
        } else {
          fetchFreelancerSearch(
            searchTextFL,
            previousFreelancerId + 1,
            pageSize
          );
        }
      } else {
        if (prevPage === 1) {
          fetchFreelancerList("", pageSize);
        } else {
          fetchFreelancerList(previousFreelancerId + 1, pageSize);
        }
      }
    }
  };

  useEffect(() => {
    if (assignmentDetailsResponse?.freelancer?.length > 0) {
      setSelectedRowsFL([Number(assignmentDetailsResponse.freelancer[0].id)]);
    } else {
      setSelectedRowsFL([]);
    }
  }, [assignmentDetailsResponse?.freelancer]);


  useEffect(() => {
    if (userToken) {
      fetchFreelancerList("", pageSize);
    }
  }, [userToken, currentPage]);

  useEffect(() => {
    if (userToken) {
      fetchPMList();
    }
  }, [userToken]);

  const fetchFreelancerSearch = async (
    searchValue: string,
    last_freelancer_id: any,
    pageSize: number,
    isPageCountRequired: number = 0
  ) => {
    try {
      const response = await fetch(`${baseURL}/team/getFreelancersListSearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          last_freelancer_id: last_freelancer_id,
          pagination_number: pageSize,
          search_value: searchValue,
          is_page_count_required: isPageCountRequired,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const freelancerListData = data.data.map((item: any) => ({
          id: Number(item.id),
          name: item.name,
          email: item.email,
          number: item.number,
          whatsapp: item.whatsapp,
        }));

        setFreelancerList(freelancerListData);
        if (isPageCountRequired) {
          setTotalPages(data.totalPages);
        }
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const debouncedFetchSearchResultsFreelancer = useRef(
    debounce(fetchFreelancerSearch, 300)
  ).current;

  const throttledFetchSearchResultsFreelancer = useThrottleFunction(
    (searchValue, last_freelancer_id, pageSize, isPageCountRequired) =>
      fetchFreelancerSearch(
        searchValue,
        last_freelancer_id,
        pageSize,
        isPageCountRequired
      ),
    1000
  );

  const handleSearchFreelancer = (searchValue: string) => {
    if (userToken) {
      debouncedFetchSearchResultsFreelancer(searchValue, "", pageSize, 1);
      throttledFetchSearchResultsFreelancer(searchValue, "", pageSize, 1);
    }
  };

  useEffect(() => {
    if (searchTextFL && userToken) {
      fetchFreelancerSearch(searchTextFL, "", pageSize, 1);
    }
  }, [userToken, searchTextFL, pageSize]);

  useEffect(() => {
    if (assignmentDetailsResponse?.freelancer?.length > 0) {
      setSelectedRowsFL([Number(assignmentDetailsResponse.freelancer[0].id)]);
    }
  }, [assignmentDetailsResponse?.freelancer]);

  useEffect(() => {
    if (assignmentDetailsResponse?.project_manager) {
      setSelectedRow({
        id: Number(assignmentDetailsResponse.project_manager.id),
        name: assignmentDetailsResponse.project_manager.name,
        email: assignmentDetailsResponse.project_manager.email,
        number: assignmentDetailsResponse.project_manager.number,
        role: assignmentDetailsResponse.project_manager.role || "PM",
      });
    }
  }, [assignmentDetailsResponse?.project_manager]);

  // Update useEffect to handle all freelancers from response
  useEffect(() => {
    if (assignmentDetailsResponse?.freelancer?.length > 0) {
      const assignedFreelancerIds = assignmentDetailsResponse.freelancer.map(
        (freelancer: any) => Number(freelancer.id)
      );
      setSelectedRowsFL(assignedFreelancerIds);
    }
  }, [assignmentDetailsResponse?.freelancer]);


  const fetchPMSearch = async (searchValue: string) => {
    try {
      const userToken = user?.token;
      const response = await fetch(
        `${baseURL}/team/getProjectManagerListSearch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            search_value: searchValue,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        const pmListData = data.data.map((item: any) => ({
          id: Number(item.id),
          name: item.name,
          email: item.email,
          number: item.number,
          role: item.role,
        }));

        setPMList(pmListData);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const debouncedFetchSearchResults = useRef(
    debounce(fetchPMSearch, 300)
  ).current;

  const throttledFetchSearchResults = useThrottleFunction(
    (searchValue) => fetchPMSearch(searchValue),
    1000
  );

  const handleSearch = (searchValue: string) => {
    if (userToken) {
      debouncedFetchSearchResults(searchValue);
      throttledFetchSearchResults(searchValue);
    }
  };

  useEffect(() => {
    if (searchText && userToken) {
      fetchPMSearch(searchText);
    }
  }, [userToken, searchText]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      setDrawer={onClose}
      drawerContent="45%"
    >
      <div className={css.drawerHeader}>
        <h2 className={css.welTitle}>{drawerTitle}</h2>
        <button className={css.closeBtn} onClick={onClose}>×</button>
      </div>

      <div className={`${css.drawerContent}`}>
        <div className={css.tableWrapper}>
          <div className={css.tableUpper}>
            {currentListType === "pm" && (
              <SearchBar
                searchText={searchText}
                handleSearchChange={handleSearch}
                setSearchText={(value) => {
                  setSearchText(value);
                  if (value) {
                    setHasSearched(true);
                  } else if (hasSearched) {
                    if (userToken) {
                      fetchPMList();
                    }
                    setHasSearched(false);
                  }
                }}
                options={["ID", "Name", "Number"]}
                border="1px solid #E5E5E5"
              />
            )}
            {currentListType === "freelancer" && (
              <SearchBar
                searchText={searchTextFL}
                handleSearchChange={handleSearchFreelancer}
                setSearchText={(value) => {
                  setSearchTextFL(value);
                  if (value) {
                    setHasSearched(true);
                  } else if (hasSearched) {
                    if (userToken) {
                      fetchFreelancerList("", pageSize);
                    }
                    setHasSearched(false);
                  }
                }}
                options={["ID", "Name", "Number"]}
                border="1px solid #E5E5E5"
              />
            )}
          </div>
          <div
            className={`ag-theme-alpine ${currentListType === "pm"
              ? css.assignmentsGrid
              : css.freelancerGrid
              }`}
          >
            {currentListType === "pm" && (
              <AgGridReact
                rowData={pmList}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                suppressCellFocus={true}
                gridOptions={gridOptions}
                onGridReady={(params) => {
                  setGridApi(params.api);
                }}
              />
            )}
            {currentListType === "freelancer" && (
              <AgGridReact
                rowData={freelancerList}
                columnDefs={freelancerColumnDefs}
                defaultColDef={defaultColDef}
                suppressCellFocus={true}
                gridOptions={gridOptions}
                onGridReady={(params) => {
                  setGridApi(params.api);
                  // Scroll to first selected freelancer for visibility
                  if (assignmentDetailsResponse?.freelancer?.length > 0) {
                    const firstFreelancerId = Number(
                      assignmentDetailsResponse.freelancer[0].id
                    );
                    const rowIndex = freelancerList.findIndex(
                      (fl) => fl.id === firstFreelancerId
                    );
                    if (rowIndex >= 0) {
                      params.api.ensureIndexVisible(rowIndex);
                    }
                  }
                }}
              />
            )}
          </div>
          {currentListType === "freelancer" && (
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={(page) => {
                gridApi?.paginationGoToPage(page - 1);
                setCurrentPage(page);
              }}
              onPageSizeChange={(newSize) => {
                onPageSizeChanged(newSize);
                setCurrentPage(1);
                if (searchTextFL) {
                  fetchFreelancerSearch(searchTextFL, "", newSize, 1);
                } else {
                  fetchFreelancerList("", newSize);
                }
              }}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
            />
          )}
        </div>
      </div>

      <div className={`${css.drawerFooter}`}>
        <div className={`${css.closeFooterBtn}`} onClick={onClose}>
          Close
        </div>
        {currentListType === "pm" && (
          <div
            className={css.assignBtn}
            onClick={() => {
              if (selectedRow) {
                assignToPM();
                onClose();
              } else {
                showToast("Please select a PM to assign!", "error");
              }
            }}
          >
            {assignmentDetailsResponse?.assigned_to_pm === 1
              ? `Update`
              : `Assign`}
          </div>
        )}
        {currentListType === "freelancer" && (
          <div
            className={css.assignBtn}
            onClick={() => {
              if (selectedRowsFL.length > 0) {
                assignToFreelancer(selectedRowsFL);
                onClose();
              } else {
                showToast("Please select freelancers to assign!", "error");
              }
            }}
          >
            {assignmentDetailsResponse?.freelancer?.length > 0
              ? `Update`
              : `Assign`}
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default PMFreelancerDrawer;

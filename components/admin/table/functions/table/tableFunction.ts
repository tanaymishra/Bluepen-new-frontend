import debouncer from "@/utils/debouncer";
import { useTableStore } from "../../stores/tableStore";
import { useAuthStore } from "@/authentication/authStore";

const {
  callbackFunction,
  setPageSize,
  setPageNumber,
  update,
} = useTableStore.getState();

export const handleNextPage = () => {
  const { totalPages, pageNumber, callbackFunction } = useTableStore.getState();
  if (pageNumber < totalPages) {
    setPageNumber(pageNumber + 1);
  }
  callbackFunction();
};

export const handlePreviousPage = () => {
  const { pageNumber, callbackFunction } = useTableStore.getState();
  if (pageNumber > 1) {
     setPageNumber(pageNumber - 1);
  }
  callbackFunction();
}

// changing the page
export const onPageChange = (page: number) => {
  const { callbackFunction } = useTableStore.getState()
  // console.log("page Number", page)
  setPageNumber(page);
  callbackFunction();

}

// page Size change function
export const onPageSizeChange = (page: number) => {
  const {setPageNumber, setPageSize, callbackFunction} = useTableStore.getState()
  setPageNumber(1)
  setPageSize(page);
  callbackFunction()
  // console.log(page, "page size")
};



// debounced searching 

let debouncedSearch: any = null;
let prevFunc: (() => void) | null = null;

export const handleSearch = (value: string) => {
  const user = useAuthStore.getState().user;
  let callbackFunction = useTableStore.getState().callbackFunction;
  update("searchValue", value);
  setPageNumber(1);
  
  if (user?.token) {
    // Compare function reference directly instead of string conversion
    if (!debouncedSearch || prevFunc !== callbackFunction) {
      debouncedSearch = debouncer(callbackFunction, 300);
    }
    prevFunc = callbackFunction;
    debouncedSearch(value);
  }
}

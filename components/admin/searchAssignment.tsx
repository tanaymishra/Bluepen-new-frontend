import { debounce } from "@/utils/debounce";
import { useState, useEffect, useCallback } from "react";

// Custom hook for managing search state and requests
const useSearchAssignments = (user: any, pageSize: number, baseURL: string) => {
  const [searchText, setSearchText] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [assignmentsCards, setAssignmentsCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAssignments = async (
    pageNumber: number | string,
    pageSize: number = 10
  ) => {
    try {
      setIsLoading(true);
      const userToken = user?.token;
      const response = await fetch(`${baseURL}/team/assignmentTable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          last_assignment_id: pageNumber,
          pagination_number: pageSize,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAssignmentsCards(data.cards);

        const assignmentsData = data.data.map((item: any) => ({
          id: Number(item.id),
          studentName: item.name,
          stream: item.stream,
          title: item.title,
          user_id: item.user_id,
          description: item.description,
          marks_obtained: item.marks_obtained
            ? Number(item.marks_obtained)
            : null,
          marks_out_of: item.marks_out_of ? Number(item.marks_out_of) : null,
          status: item.status,
        }));

        setAssignments(assignmentsData);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSearchResults = async (
    searchValue: string,
    last_assignment_id: any,
    pageSize: number
  ) => {
    if (!searchValue.trim()) return;

    try {
      setIsLoading(true);
      const userToken = user?.token;
      const response = await fetch(`${baseURL}/team/assignmentTableSearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          last_assignment_id,
          pagination_number: pageSize,
          search_value: searchValue,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const assignmentsData = data.data.map((item: any) => ({
          id: Number(item.id),
          studentName: item.name,
          stream: item.stream,
          title: item.title,
          user_id: item.user_id,
          description: item.description,
          marks_obtained: item.marks_obtained
            ? Number(item.marks_obtained)
            : null,
          marks_out_of: item.marks_out_of ? Number(item.marks_out_of) : null,
          status: item.status,
        }));

        setAssignments(assignmentsData);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      if (searchValue.trim()) {
        fetchSearchResults(searchValue, "", pageSize);
      } else {
        fetchAssignments("", pageSize);
      }
    }, 300), // 300ms delay
    [user?.token, pageSize]
  );

  // Handle search text changes
  const handleSearchChange = (value: string) => {
    setSearchText(value);
    debouncedSearch(value);
  };


  return {
    searchText,
    handleSearchChange,
    assignments,
    totalPages,
    assignmentsCards,
    isLoading,
  };
};

export default useSearchAssignments;

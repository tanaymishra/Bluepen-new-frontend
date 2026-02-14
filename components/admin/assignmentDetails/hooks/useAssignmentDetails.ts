import { useState, useEffect } from 'react';
import { useToast } from "@/context/toastContext";
import { useAuth } from "@/authentication/authentication";
import { formatDate } from "@/utils/customJsFunctions/dateFormatJS";

const baseURL = String(process.env.NEXT_PUBLIC_BASE_URL);

interface MarksHistoryItem {
  marksObtained: number;
  marksOutOf: number;
  marksOutOf100: string;
  marksStatus: string;
  marksAddedOn: string;
  marksAddedBy: number;
  isActive: number;
  feedback: string;
}

interface AssignmentState {
  stream: string;
  level: string;
  type: string;
  title: string;
  description: string;
  deadline: string;
  submittedBy: string;
  postedOn: string;
  wordCount: string;
  freelancerAmount: string;
  totalAmount: string;
  education: string;
  files: any[];
  last_updated: string;
}

interface StudentDetails {
  firstname: string;
  lastname: string;
  country_name: string;
  country_code: string;
  email: string;
  number: string;
  is_select: string;
}

interface Status {
  label: string;
  state: "done" | "ongoing" | "pending";
  date: string;
}

const useAssignmentDetails = (assignmentNumber: string | null) => {
  const [assignments, setAssignments] = useState<AssignmentState>({
    stream: "",
    level: "",
    type: "",
    title: "",
    description: "",
    deadline: "",
    submittedBy: "",
    postedOn: "",
    wordCount: "",
    freelancerAmount: "",
    totalAmount: "",
    education: "",
    files: [],
    last_updated: "",
  });

  const [studentDetails, setStudentDetails] = useState<StudentDetails>({
    firstname: "",
    lastname: "",
    country_name: "",
    country_code: "",
    email: "",
    number: "",
    is_select: "",
  });

  const [statuses, setStatuses] = useState<Status[]>([]);
  const [currentStatusIndex, setCurrentStatusIndex] = useState<number>(0);
  const [isResit, setIsResit] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [assignmentDetailsResponse, setAssignmentDetailsResponse] = useState<any>({});
  const [marksDetails, setMarksDetails] = useState<any>({});
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const [assignmentNav, setAssignmentNav] = useState<any>({});
  const [marksHistory, setMarksHistory] = useState<MarksHistoryItem[]>([]);

  const { user } = useAuth();
  const { showToast } = useToast();

  const constructStatuses = (assignmentDetails: any) => {
    const statusFields = [
      { key: "posted", label: "Posted", timeKey: "posted_on" },
      { key: "under_process", label: "Processing", timeKey: "posted_on" },
      { key: "assigned_to_pm", label: "Assigned to PM", timeKey: "assigned_to_pm_time" },
      { key: "assigned_to_freelancer", label: "Assigned to Freelancer", timeKey: "assigned_to_freelancer_time" },
      { key: "completed_marks_not_received", label: "Completed but marks not received", timeKey: "completed_marks_not_received_time" },
      { key: "completed", label: "Completed", timeKey: "completed_time" },
      { key: "review_received", label: "Review Received", timeKey: "review_received_time" },
    ];

    const statuses: Status[] = [];
    let currentIndex = -1;

    statusFields.forEach((statusField, index) => {
      const statusValue = assignmentDetails[statusField.key];
      const dateValue = assignmentDetails[statusField.timeKey];
      let state: "done" | "ongoing" | "pending" = "pending";
      let date = "yet to accomplish";

      if (statusValue === 1) {
        state = "done";
        date = formatDate(dateValue, "dd MMM yyyy, hh:mm AM/PM") || "Date not available";
        currentIndex = index;
      } else if (currentIndex + 1 === index) {
        state = "ongoing";
        date = "in-progress";
      }

      statuses.push({
        label: statusField.label,
        state,
        date,
      });
    });

    return { statuses, currentStatusIndex: currentIndex + 1 };
  };

  const fetchAssignmentDetails = async () => {
    try {
      const response = await fetch(`${baseURL}/team/assignmentDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          id: assignmentNumber,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { assignmentDetails } = data;
        setAssignmentDetailsResponse(data.assignmentDetails);
        setMarksDetails(data.assignmentDetails.marks);

        setAssignments({
          stream: data.assignmentDetails.stream || "",
          level: data.assignmentDetails.level || "",
          type: data.assignmentDetails.type || "",
          title: data.assignmentDetails.title || "",
          description: data.assignmentDetails.description || "",
          deadline: data.assignmentDetails.deadline || "",
          submittedBy: data.assignmentDetails.submitted_by_name || "",
          postedOn: data.assignmentDetails.posted_on || "",
          wordCount: data.assignmentDetails.word_count || "",
          freelancerAmount: data.assignmentDetails.freelancer_amount || "",
          totalAmount: data.assignmentDetails.total_amount || "",
          education: data.assignmentDetails.course || "",
          files: data.assignmentDetails.files || "",
          last_updated: data.assignmentDetails.last_updated || "",
        });

        setStudentDetails({
          firstname: data.userDetails.firstname || "",
          lastname: data.userDetails.lastname || "",
          country_name: data.userDetails.country_name || "",
          country_code: data.userDetails.country_code || "",
          email: data.userDetails.email || "",
          number: data.userDetails.number || "",
          is_select: data.userDetails.is_select || "",
        });

        setAssignmentNav({
          previousAssId: data?.previousAssignmentId || "",
          nextAssId: data?.nextAssignmentId || "",
          total: data?.totalAssignmentCount || "",
        });

        const { statuses: newStatuses, currentStatusIndex: newIndex } = constructStatuses(assignmentDetails);
        setStatuses(newStatuses);
        setCurrentStatusIndex(newIndex);
        setIsResit(assignmentDetails.resit === 1);
        setIsLost(assignmentDetails.lost === 1);
        setLoadingSkeleton(false);

        // Add marks history
        if (data.marksHistory) {
          setMarksHistory(data.marksHistory);
        }

      }
    } catch (error) {
      console.error("Error fetching assignment details:", error);
    }
  };

  const deleteAssignment = async () => {
    try {
      const response = await fetch(`${baseURL}/team/deleteAssignment`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ assignmentId: Number(assignmentNumber) }),
      });

      if (response.ok) {
        showToast("Assignment deleted successfully", "success");
        return true;
      } else {
        const errorData = await response.json();
        console.error("Error deleting assignment:", errorData.message);
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };

  useEffect(() => {
    if (user?.token && assignmentNumber) {
      fetchAssignmentDetails();
    }
  }, [user?.token, assignmentNumber, isLost]);

  return {
    assignments,
    studentDetails,
    statuses,
    currentStatusIndex,
    isResit,
    isLost,
    assignmentDetailsResponse,
    marksDetails,
    loadingSkeleton,
    assignmentNav,
    marksHistory,
    setStatuses,
    setCurrentStatusIndex,
    setIsResit,
    setIsLost,
    fetchAssignmentDetails,
    deleteAssignment,
  };
};

export default useAssignmentDetails;

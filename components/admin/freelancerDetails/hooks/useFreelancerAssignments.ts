import { useState, useEffect } from 'react';
import { useAuth } from '@/authentication/authentication';

interface AssignmentStats {
  totalAssignments: number;
  average_marks_out_of_100: number;
  marksResultFinal: {
    performance: string;
    total_marks_obtained: number;
    total_marks_out_of: number;
    total_marks_out_of_100: number;
    marksReceivedAssignments: number;
    average_marks_out_of_100: number;
  };
}

export const useFreelancerAssignments = (freelancerId: string | null, baseURL: string) => {
  const [assignmentStats, setAssignmentStats] = useState<AssignmentStats | null>(null);
  const [freelancerMarksTable, setFreelancerMarksTable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFreelancerAssignment = async (search_value: string = "") => {
    try {
      const response = await fetch(`${baseURL}/team/freelancerAssignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          id: freelancerId,
          page_number: 1,
          search_value: "",
          filter_status: [],
          filter_marks_status: [],
          filter_payment_status: "",
          pagination_number:25,
          is_page_count_required: 1,


        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setAssignmentStats(data.assignmentStats);
      setFreelancerMarksTable(data.assignmentsTable);
    } catch (error) {
      console.error("Error fetching freelancer assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token && freelancerId) {
      fetchFreelancerAssignment();
    }
  }, [user?.token, freelancerId]);

  return {
    assignmentStats,
    freelancerMarksTable,
    loading,
    fetchFreelancerAssignment
  };
};

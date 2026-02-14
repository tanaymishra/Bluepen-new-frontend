import { useState, useEffect } from 'react';
import { useAuth } from '@/authentication/authentication';

const baseURL = String(process.env.NEXT_PUBLIC_BASE_URL);

export const useFreelancerDetails = (freelancerId: string | null) => {
  const [freelancerDetails, setFreelancerDetails] = useState<any>(null);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [freelacerNav, setFreelacerNav] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFreelancerDetails = async () => {
    try {
      const userToken = user?.token;

      const response = await fetch(`${baseURL}/team/freelancerDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ id: freelancerId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const { statusDetails } = data;
      
      setStatuses(statusDetails);
      setFreelacerNav({
        prevFreelancerId: data?.previousFreelancerId,
        nextFreelancerId: data?.nextFreelancerId,
        total: data?.totalFreelancerCount,
      });
      setFreelancerDetails(data);
    } catch (error: any) {
      console.error("Error fetching freelancer details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token && freelancerId) {
      fetchFreelancerDetails();
    }
  }, [user?.token, freelancerId]);

  return {
    freelancerDetails,
    statuses,
    freelacerNav,
    loading,
    setLoading,
    fetchFreelancerDetails
  };
};

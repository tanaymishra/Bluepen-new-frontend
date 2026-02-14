export interface PMData {
  id: number;
  name: string;
  email: string;
  number: string;
  role: "PM" | "Admin";
}

export interface FreelancerData {
  id: number;
  name: string;
  email: string;
  number: string;
  whatsapp: string;
}

export interface PMFreelancerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentListType: "pm" | "freelancer";
  drawerTitle: string;
  assignmentNumber: string | null;
  assignmentDetailsResponse: any;
  fetchAssignmentDetails: () => Promise<void>;
  onAssignmentSuccess?: () => void;
}

export interface WordCountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentNumber: string | null;
  fetchAssignmentDetails: () => void;
  assignments: {
    wordCount?: number | null;
    freelancerAmount?: number | null;
    totalAmount?: number | null;
  };
}

export interface EmailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: {
    title: string;
    deadline: string;
    freelancerAmount: number;
    description: string;
    files: string[];
    wordCount?: string;
  };
  assignmentNumber: string | null;
}

export interface DraftTipsProps {
  assignmentNumber: string | null;
  userName: string | undefined;
  editable?: boolean;
}

export interface Message {
  id: number;
  user: string;
  name: string;
  status: string;
  message: string;
  date: string;
  message_type?: string;
  profileImage?: string;
  docs?: string[];
}

export interface UploadedFile {
  originalName: string;
  savedAs: string;
}

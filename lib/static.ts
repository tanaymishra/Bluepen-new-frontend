/**
 * Static credentials and user data for development/testing.
 * Replace with real API calls when backend is integrated.
 */

export type UserRole = "admin" | "student" | "freelancer" | "PM" | "HR" | "Admin" | "Tech";

export interface StaticUser {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    role: UserRole;
    password: string;
    token: string;
}

export const STATIC_USERS: StaticUser[] = [
    {
        id: "stu_001",
        firstname: "Rahul",
        lastname: "Sharma",
        email: "student@bluepen.co.in",
        phone: "+919876543210",
        role: "student",
        password: "Student@123",
        token: "static_jwt_student_001",
    },
    {
        id: "adm_001",
        firstname: "Admin",
        lastname: "User",
        email: "admin@bluepen.co.in",
        phone: "+919876543211",
        role: "admin",
        password: "Admin@123",
        token: "static_jwt_admin_001",
    },
    {
        id: "frl_001",
        firstname: "Priya",
        lastname: "Patel",
        email: "freelancer@bluepen.co.in",
        phone: "+919876543212",
        role: "freelancer",
        password: "Freelancer@123",
        token: "static_jwt_freelancer_001",
    },
];

/**
 * Validates credentials against static users.
 * Returns the user object (without password) or null.
 */
export function validateCredentials(
    email: string,
    password: string
): Omit<StaticUser, "password"> | null {
    const user = STATIC_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return null;
    const { password: _, ...safeUser } = user;
    return safeUser;
}

/**
 * Checks if an email is already registered.
 */
export function isEmailTaken(email: string): boolean {
    return STATIC_USERS.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
    );
}

/**
 * Simulates user registration. Returns the new user object.
 * In production, this would be an API call.
 */
export function registerUser(data: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    password: string;
}): Omit<StaticUser, "password"> {
    const newUser: StaticUser = {
        id: `stu_${Date.now()}`,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        role: "student",
        password: data.password,
        token: `static_jwt_${Date.now()}`,
    };
    // In a real app, you'd persist this. For now, just return it.
    STATIC_USERS.push(newUser);
    const { password: _, ...safeUser } = newUser;
    return safeUser;
}

/* ──────────────────────────────────────────────────────────
   Assignment Stages
   ────────────────────────────────────────────────────────── */

export const ASSIGNMENT_STAGES = [
    { key: "submitted", label: "Submitted", color: "#2956A8", bgColor: "#DCE6F7" },
    { key: "assigned", label: "Assigned to Freelancer", color: "#7C3AED", bgColor: "#EDE9FE" },
    { key: "in_progress", label: "In Progress", color: "#D97706", bgColor: "#FEF3C7" },
    { key: "under_review", label: "Under Review", color: "#0891B2", bgColor: "#CFFAFE" },
    { key: "revision", label: "Revision", color: "#EA580C", bgColor: "#FFEDD5" },
    { key: "completed", label: "Completed", color: "#16A34A", bgColor: "#CFF4E7" },
    { key: "cancelled", label: "Cancelled", color: "#DC2626", bgColor: "#FEE2E2" },
] as const;

export type AssignmentStageKey = (typeof ASSIGNMENT_STAGES)[number]["key"];

export function getStageByKey(key: AssignmentStageKey) {
    return ASSIGNMENT_STAGES.find((s) => s.key === key)!;
}

/* ──────────────────────────────────────────────────────────
   Mock Assignments (for development / testing)
   ────────────────────────────────────────────────────────── */

export interface MockAssignment {
    id: string;
    title: string;
    type: string;
    subtype: string;
    subject: string;
    academicLevel: string;
    wordCount: number;
    deadline: string;
    submittedAt: string;
    stage: AssignmentStageKey;
    price: number | null;
    referencingStyle?: string;
    instructions?: string;
}

/* ──────────────────────────────────────────────────────────
   Stage History (timeline events per assignment)
   ────────────────────────────────────────────────────────── */

export interface StageHistoryEvent {
    stage: AssignmentStageKey;
    timestamp: string;
    note?: string;
}

/**
 * Map of assignment ID → history events (ordered oldest → newest).
 * Some assignments intentionally have NO history (null) to simulate
 * real-world gaps when integrating with a database.
 */
export const ASSIGNMENT_HISTORY: Record<string, StageHistoryEvent[] | null> = {
    "ASG-1001": [
        { stage: "submitted", timestamp: "2026-02-10T14:30:00", note: "Assignment submitted by student." },
        { stage: "assigned", timestamp: "2026-02-10T18:45:00", note: "Assigned to Dr. Meera Kapoor — Health Informatics specialist." },
        { stage: "in_progress", timestamp: "2026-02-11T09:00:00", note: "Expert has started working on the assignment." },
    ],
    "ASG-1002": [
        { stage: "submitted", timestamp: "2026-01-20T09:15:00", note: "Assignment submitted by student." },
        { stage: "assigned", timestamp: "2026-01-21T11:30:00", note: "Assigned to Prof. Arjun Nair — Supply Chain specialist." },
    ],
    "ASG-1003": [
        { stage: "submitted", timestamp: "2026-02-05T16:45:00", note: "Assignment submitted by student." },
        { stage: "assigned", timestamp: "2026-02-06T10:20:00", note: "Assigned to Dr. Sarah Thompson — Environmental Science specialist." },
        { stage: "in_progress", timestamp: "2026-02-07T08:00:00", note: "Expert has started working on the assignment." },
        { stage: "under_review", timestamp: "2026-02-12T15:30:00", note: "First draft submitted for quality review." },
    ],
    "ASG-1004": null,
    "ASG-1005": [
        { stage: "submitted", timestamp: "2026-01-30T08:20:00", note: "Assignment submitted by student." },
        { stage: "assigned", timestamp: "2026-01-30T12:00:00", note: "Assigned to Vikram Desai — Finance specialist." },
        { stage: "in_progress", timestamp: "2026-01-31T09:00:00", note: "Expert has started working on the case study." },
        { stage: "under_review", timestamp: "2026-02-08T14:00:00", note: "Draft submitted for internal quality check." },
        { stage: "completed", timestamp: "2026-02-10T11:30:00", note: "Assignment delivered successfully. Grade: Distinction." },
    ],
    "ASG-1006": [
        { stage: "submitted", timestamp: "2026-02-08T13:10:00", note: "Assignment submitted by student." },
        { stage: "assigned", timestamp: "2026-02-08T16:00:00", note: "Assigned to Priya Menon — Admissions consultant." },
        { stage: "in_progress", timestamp: "2026-02-09T10:00:00" },
        { stage: "under_review", timestamp: "2026-02-11T17:00:00", note: "SOP draft reviewed by admissions team." },
        { stage: "completed", timestamp: "2026-02-12T14:00:00", note: "Final SOP delivered." },
    ],
    "ASG-1007": null,
    "ASG-1008": [
        { stage: "submitted", timestamp: "2026-02-01T15:00:00", note: "Assignment submitted by student." },
        { stage: "assigned", timestamp: "2026-02-02T09:30:00", note: "Assigned to Ravi Kumar — Marketing specialist." },
        { stage: "in_progress", timestamp: "2026-02-03T08:00:00", note: "Expert has started working on the essay." },
        { stage: "under_review", timestamp: "2026-02-10T12:00:00", note: "Essay submitted for quality review." },
        { stage: "revision", timestamp: "2026-02-11T16:00:00", note: "Student requested changes to the conclusion section." },
    ],
    "ASG-1009": [
        { stage: "submitted", timestamp: "2026-02-11T17:45:00", note: "Assignment submitted by student." },
        { stage: "assigned", timestamp: "2026-02-12T10:00:00", note: "Assigned to Dr. Li Wei — AI & NLP specialist." },
        { stage: "in_progress", timestamp: "2026-02-13T09:00:00", note: "Expert has started working on the chapter." },
    ],
    "ASG-1010": [
        { stage: "submitted", timestamp: "2026-01-28T12:00:00", note: "Assignment submitted by student." },
        { stage: "assigned", timestamp: "2026-01-29T08:45:00", note: "Assigned to Dr. Anika Sharma — Public Policy researcher." },
        { stage: "in_progress", timestamp: "2026-01-30T09:00:00" },
        { stage: "under_review", timestamp: "2026-02-15T16:00:00" },
        { stage: "completed", timestamp: "2026-02-18T10:30:00", note: "Report delivered. Student satisfied." },
    ],
};

export function getAssignmentHistory(id: string): StageHistoryEvent[] | null {
    return ASSIGNMENT_HISTORY[id] ?? null;
}

export const MOCK_ASSIGNMENTS: MockAssignment[] = [
    {
        id: "ASG-1001",
        title: "Impact of AI on Modern Healthcare Systems",
        type: "Assignment / Coursework",
        subtype: "Research Paper",
        subject: "Health Informatics",
        academicLevel: "Postgraduate / Masters",
        wordCount: 3000,
        deadline: "2026-02-28T23:59:00",
        submittedAt: "2026-02-10T14:30:00",
        stage: "in_progress",
        price: 4500,
        referencingStyle: "APA 7th Edition",
        instructions: "Focus on AI applications in diagnostics, telemedicine, and patient data management. Include at least 15 peer-reviewed sources from the last 5 years. Use real-world case studies from NHS and Mayo Clinic.",
    },
    {
        id: "ASG-1002",
        title: "Blockchain in Supply Chain Management",
        type: "Masters Dissertation",
        subtype: "Full Dissertation",
        subject: "Supply Chain Management",
        academicLevel: "Postgraduate / Masters",
        wordCount: 15000,
        deadline: "2026-04-15T23:59:00",
        submittedAt: "2026-01-20T09:15:00",
        stage: "assigned",
        price: 25000,
        referencingStyle: "Harvard",
        instructions: "Complete dissertation including all chapters. Literature review should cover blockchain implementations in logistics across Europe and Asia. Methodology: Mixed-methods approach.",
    },
    {
        id: "ASG-1003",
        title: "Climate Change Effects on Coastal Biodiversity",
        type: "Assignment / Coursework",
        subtype: "Literature Review",
        subject: "Environmental Science",
        academicLevel: "Undergraduate (Year 3-4)",
        wordCount: 2500,
        deadline: "2026-02-18T23:59:00",
        submittedAt: "2026-02-05T16:45:00",
        stage: "under_review",
        price: 3000,
        referencingStyle: "APA 7th Edition",
        instructions: "Review recent literature on how rising sea levels and ocean acidification affect coastal ecosystems. Focus on mangrove forests and coral reefs.",
    },
    {
        id: "ASG-1004",
        title: "Machine Learning for Predictive Analytics",
        type: "PhD Thesis & Proposal",
        subtype: "PhD Proposal",
        subject: "Computer Science",
        academicLevel: "PhD / Doctoral",
        wordCount: 5000,
        deadline: "2026-03-10T23:59:00",
        submittedAt: "2026-02-12T11:00:00",
        stage: "submitted",
        price: null,
        referencingStyle: "IEEE",
        instructions: "Proposal should include problem statement, research objectives, methodology overview, and expected contributions. Focus on ensemble methods for time-series data.",
    },
    {
        id: "ASG-1005",
        title: "Financial Risk Assessment in Emerging Markets",
        type: "Assignment / Coursework",
        subtype: "Case Study",
        subject: "Finance",
        academicLevel: "Postgraduate / Masters",
        wordCount: 2000,
        deadline: "2026-02-14T23:59:00",
        submittedAt: "2026-01-30T08:20:00",
        stage: "completed",
        price: 2800,
        referencingStyle: "Harvard",
        instructions: "Analyse financial risk in at least 3 emerging markets (India, Brazil, Nigeria). Use CAPM and VaR models. Include recent data from 2024-2025.",
    },
    {
        id: "ASG-1006",
        title: "SOP for University of Toronto - MS Computer Science",
        type: "University Applications",
        subtype: "Statement of Purpose (SOP)",
        subject: "Computer Science",
        academicLevel: "Postgraduate / Masters",
        wordCount: 1000,
        deadline: "2026-02-20T23:59:00",
        submittedAt: "2026-02-08T13:10:00",
        stage: "completed",
        price: 1500,
    },
    {
        id: "ASG-1007",
        title: "Sustainable Urban Planning Strategies",
        type: "Assignment / Coursework",
        subtype: "Report",
        subject: "Urban Planning",
        academicLevel: "Undergraduate (Year 3-4)",
        wordCount: 3500,
        deadline: "2026-03-01T23:59:00",
        submittedAt: "2026-02-13T10:30:00",
        stage: "submitted",
        price: null,
    },
    {
        id: "ASG-1008",
        title: "Consumer Behaviour in E-Commerce Platforms",
        type: "Assignment / Coursework",
        subtype: "Essay",
        subject: "Marketing",
        academicLevel: "Undergraduate (Year 1-2)",
        wordCount: 1500,
        deadline: "2026-02-22T23:59:00",
        submittedAt: "2026-02-01T15:00:00",
        stage: "revision",
        price: 1800,
    },
    {
        id: "ASG-1009",
        title: "Neural Networks for Natural Language Processing",
        type: "Masters Dissertation",
        subtype: "Individual Chapter",
        subject: "Artificial Intelligence",
        academicLevel: "Postgraduate / Masters",
        wordCount: 4000,
        deadline: "2026-03-20T23:59:00",
        submittedAt: "2026-02-11T17:45:00",
        stage: "in_progress",
        price: 6000,
    },
    {
        id: "ASG-1010",
        title: "Renewable Energy Policy Analysis - UK vs India",
        type: "Assignment / Coursework",
        subtype: "Report",
        subject: "Public Policy",
        academicLevel: "Postgraduate / Masters",
        wordCount: 2800,
        deadline: "2026-02-25T23:59:00",
        submittedAt: "2026-01-28T12:00:00",
        stage: "completed",
        price: 3200,
    },
];

/* ──────────────────────────────────────────────────────────
   Mock Wallet Data
   ────────────────────────────────────────────────────────── */

export interface WalletTransaction {
    id: string;
    type: "payment" | "refund" | "topup";
    amount: number;
    description: string;
    date: string;
    assignmentId?: string;
    status: "completed" | "pending" | "failed";
}

export const MOCK_WALLET: {
    balance: number;
    transactions: WalletTransaction[];
} = {
    balance: 12450,
    transactions: [
        { id: "TXN-001", type: "payment", amount: -4500, description: "Payment for ASG-1001", date: "2026-02-10T14:35:00", assignmentId: "ASG-1001", status: "completed" },
        { id: "TXN-002", type: "topup", amount: 10000, description: "Wallet top-up via UPI", date: "2026-02-08T10:00:00", status: "completed" },
        { id: "TXN-003", type: "payment", amount: -2800, description: "Payment for ASG-1005", date: "2026-01-30T08:25:00", assignmentId: "ASG-1005", status: "completed" },
        { id: "TXN-004", type: "payment", amount: -1500, description: "Payment for ASG-1006", date: "2026-02-08T13:15:00", assignmentId: "ASG-1006", status: "completed" },
        { id: "TXN-005", type: "refund", amount: 1200, description: "Partial refund — price adjustment", date: "2026-02-05T16:00:00", assignmentId: "ASG-1003", status: "completed" },
        { id: "TXN-006", type: "topup", amount: 15000, description: "Wallet top-up via Net Banking", date: "2026-01-25T11:30:00", status: "completed" },
        { id: "TXN-007", type: "payment", amount: -3200, description: "Payment for ASG-1010", date: "2026-01-28T12:05:00", assignmentId: "ASG-1010", status: "completed" },
        { id: "TXN-008", type: "payment", amount: -1800, description: "Payment for ASG-1008", date: "2026-02-01T15:05:00", assignmentId: "ASG-1008", status: "completed" },
    ],
};

/* ──────────────────────────────────────────────────────────
   Mock Notifications
   ────────────────────────────────────────────────────────── */

export interface AppNotification {
    id: string;
    type: "assignment" | "payment" | "system" | "deadline";
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    link?: string;
}

export const MOCK_NOTIFICATIONS: AppNotification[] = [
    { id: "N-001", type: "assignment", title: "Expert Assigned", message: "Dr. Li Wei has been assigned to your assignment 'Neural Networks for NLP'.", timestamp: "2026-02-12T10:00:00", read: false, link: "/students/assignments/ASG-1009" },
    { id: "N-002", type: "deadline", title: "Deadline Approaching", message: "Your assignment 'Climate Change Effects on Coastal Biodiversity' is due in 4 days.", timestamp: "2026-02-14T08:00:00", read: false, link: "/students/assignments/ASG-1003" },
    { id: "N-003", type: "assignment", title: "Assignment Completed", message: "Your assignment 'Financial Risk Assessment in Emerging Markets' has been completed.", timestamp: "2026-02-10T11:30:00", read: true, link: "/students/assignments/ASG-1005" },
    { id: "N-004", type: "payment", title: "Payment Confirmed", message: "Payment of ₹4,500 for ASG-1001 has been processed successfully.", timestamp: "2026-02-10T14:36:00", read: true },
    { id: "N-005", type: "system", title: "Welcome to Bluepen", message: "Your account has been created. Start by posting your first assignment!", timestamp: "2026-01-20T09:00:00", read: true },
    { id: "N-006", type: "assignment", title: "Revision Requested", message: "Changes have been requested for 'Consumer Behaviour in E-Commerce Platforms'.", timestamp: "2026-02-11T16:05:00", read: false, link: "/students/assignments/ASG-1008" },
    { id: "N-007", type: "assignment", title: "Under Review", message: "Your assignment 'Climate Change Effects on Coastal Biodiversity' is now under quality review.", timestamp: "2026-02-12T15:32:00", read: true, link: "/students/assignments/ASG-1003" },
    { id: "N-008", type: "payment", title: "Refund Processed", message: "A refund of ₹1,200 has been credited to your wallet.", timestamp: "2026-02-05T16:02:00", read: true },
];

/* ──────────────────────────────────────────────────────────
   Mock Referrals
   ────────────────────────────────────────────────────────── */

export interface Referral {
    id: string;
    name: string;
    email: string;
    status: "pending" | "signed_up" | "first_order" | "rewarded";
    invitedAt: string;
    rewardAmount: number | null;
}

export const MOCK_REFERRAL_DATA = {
    code: "RAHUL15",
    link: "https://bluepen.co.in/ref/RAHUL15",
    totalEarnings: 2250,
    totalReferred: 6,
    successfulReferrals: 3,
    referrals: [
        { id: "REF-001", name: "Ankit Verma", email: "ankit.v@gmail.com", status: "rewarded" as const, invitedAt: "2026-01-10T14:00:00", rewardAmount: 750 },
        { id: "REF-002", name: "Neha Gupta", email: "neha.g@outlook.com", status: "rewarded" as const, invitedAt: "2026-01-15T09:30:00", rewardAmount: 750 },
        { id: "REF-003", name: "Siddharth Rao", email: "sid.rao@gmail.com", status: "rewarded" as const, invitedAt: "2026-01-22T16:00:00", rewardAmount: 750 },
        { id: "REF-004", name: "Priya Singh", email: "priya.s@yahoo.com", status: "first_order" as const, invitedAt: "2026-02-01T11:00:00", rewardAmount: null },
        { id: "REF-005", name: "Karan Mehta", email: "karan.m@gmail.com", status: "signed_up" as const, invitedAt: "2026-02-08T13:30:00", rewardAmount: null },
        { id: "REF-006", name: "Riya Patel", email: "riya.p@gmail.com", status: "pending" as const, invitedAt: "2026-02-12T10:15:00", rewardAmount: null },
    ],
};

/* ──────────────────────────────────────────────────────────
   Mock Coupons
   ────────────────────────────────────────────────────────── */

export interface Coupon {
    id: string;
    code: string;
    description: string;
    discountType: "percentage" | "flat";
    discountValue: number;
    minOrderValue: number | null;
    maxDiscount: number | null;
    validFrom: string;
    validUntil: string;
    usedAt: string | null;
    status: "active" | "used" | "expired";
}

export const MOCK_COUPONS: Coupon[] = [
    { id: "CPN-001", code: "WELCOME10", description: "Welcome discount for new users", discountType: "percentage", discountValue: 10, minOrderValue: 1000, maxDiscount: 500, validFrom: "2026-01-01T00:00:00", validUntil: "2026-06-30T23:59:00", usedAt: null, status: "active" },
    { id: "CPN-002", code: "FLAT500", description: "Flat ₹500 off on orders above ₹3,000", discountType: "flat", discountValue: 500, minOrderValue: 3000, maxDiscount: null, validFrom: "2026-02-01T00:00:00", validUntil: "2026-03-31T23:59:00", usedAt: null, status: "active" },
    { id: "CPN-003", code: "THESIS20", description: "20% off on dissertation & thesis orders", discountType: "percentage", discountValue: 20, minOrderValue: 5000, maxDiscount: 3000, validFrom: "2026-02-01T00:00:00", validUntil: "2026-04-30T23:59:00", usedAt: null, status: "active" },
    { id: "CPN-004", code: "NEWYEAR15", description: "New Year special — 15% off everything", discountType: "percentage", discountValue: 15, minOrderValue: null, maxDiscount: 2000, validFrom: "2026-01-01T00:00:00", validUntil: "2026-01-31T23:59:00", usedAt: "2026-01-20T14:30:00", status: "used" },
    { id: "CPN-005", code: "DIWALI25", description: "Diwali special 25% discount", discountType: "percentage", discountValue: 25, minOrderValue: 2000, maxDiscount: 2500, validFrom: "2025-10-15T00:00:00", validUntil: "2025-11-15T23:59:00", usedAt: null, status: "expired" },
    { id: "CPN-006", code: "REFER750", description: "Referral reward coupon", discountType: "flat", discountValue: 750, minOrderValue: null, maxDiscount: null, validFrom: "2026-01-10T00:00:00", validUntil: "2026-07-10T23:59:00", usedAt: "2026-02-05T09:00:00", status: "used" },
];

/* ═══════════════════════════════════════════════════════
   ADMIN DASHBOARD DATA
   ═══════════════════════════════════════════════════════ */

export interface AdminSlide {
    id: string;
    type: "weather" | "freelancer_of_month" | "pm_of_month";
    title: string;
    subtitle: string;
    highlight: string;
    meta?: string;
}

export const ADMIN_SLIDES: AdminSlide[] = [
    {
        id: "slide-weather",
        type: "weather",
        title: "New Delhi, India",
        subtitle: "Partly Cloudy",
        highlight: "24°C",
        meta: "Humidity 62% · Wind 12 km/h",
    },
    {
        id: "slide-freelancer",
        type: "freelancer_of_month",
        title: "Freelancer of the Month",
        subtitle: "Ananya Verma",
        highlight: "47 Assignments",
        meta: "98.2% on-time delivery · 4.9★ avg rating",
    },
    {
        id: "slide-pm",
        type: "pm_of_month",
        title: "Project Manager of the Month",
        subtitle: "Ravi Krishnan",
        highlight: "132 Managed",
        meta: "96% client satisfaction · 0 escalations",
    },
];

export interface AdminAssignmentStats {
    total: number;
    underProcess: number;
    reviewed: number;
    assignedToPm: number;
    withFreelancers: number;
    marksNotReceived: number;
    completed: number;
    lost: number;
    resit: number;
}

export const ADMIN_ASSIGNMENT_STATS: AdminAssignmentStats = {
    total: 5024,
    underProcess: 312,
    reviewed: 876,
    assignedToPm: 245,
    withFreelancers: 1890,
    marksNotReceived: 408,
    completed: 1102,
    lost: 181,
    resit: 10,
};

export interface AdminRecentActivity {
    id: string;
    action: string;
    user: string;
    role: string;
    timestamp: string;
    type: "assignment" | "payment" | "user" | "system" | "deadline";
}

export const ADMIN_RECENT_ACTIVITY: AdminRecentActivity[] = [
    { id: "act-1", action: "New assignment #BP-5024 submitted", user: "Rahul Sharma", role: "Student", timestamp: "2026-02-15T14:32:00", type: "assignment" },
    { id: "act-2", action: "Payment of ₹4,500 received", user: "Sneha Gupta", role: "Student", timestamp: "2026-02-15T13:15:00", type: "payment" },
    { id: "act-3", action: "Assignment #BP-4998 marked complete", user: "Ananya Verma", role: "Freelancer", timestamp: "2026-02-15T12:45:00", type: "assignment" },
    { id: "act-4", action: "New freelancer application approved", user: "Deepak Joshi", role: "HR", timestamp: "2026-02-15T11:30:00", type: "user" },
    { id: "act-5", action: "Assignment #BP-5010 escalated", user: "Ravi Krishnan", role: "PM", timestamp: "2026-02-15T10:05:00", type: "system" },
    { id: "act-6", action: "Deadline approaching for 8 assignments", user: "System", role: "Auto", timestamp: "2026-02-15T09:00:00", type: "deadline" },
    { id: "act-7", action: "Assignment #BP-4990 resit requested", user: "Meera Iyer", role: "Student", timestamp: "2026-02-14T18:20:00", type: "assignment" },
    { id: "act-8", action: "Bulk result upload — 24 assignments", user: "Admin User", role: "Admin", timestamp: "2026-02-14T16:00:00", type: "system" },
];

/** Deadline counts per day for Feb 2026 (day → count) */
export interface DeadlineEntry {
    id: string;
    title: string;
    pm: string;
    writer: string;
}

export const ADMIN_DEADLINE_MAP: Record<number, { count: number; assignments: DeadlineEntry[] }> = {
    1: { count: 2, assignments: [
        { id: "BP-4901", title: "Essay on Climate Change", pm: "Ravi Krishnan", writer: "Ananya Verma" },
        { id: "BP-4903", title: "Marketing Plan", pm: "Sneha Mehra", writer: "Deepak Joshi" },
    ]},
    3: { count: 5, assignments: [
        { id: "BP-4910", title: "Data Structures Lab", pm: "Ravi Krishnan", writer: "Priya Patel" },
        { id: "BP-4912", title: "Financial Analysis", pm: "Sneha Mehra", writer: "Ananya Verma" },
        { id: "BP-4915", title: "Psychology Essay", pm: "Arjun Nair", writer: "Kavita Rao" },
        { id: "BP-4917", title: "History Report", pm: "Ravi Krishnan", writer: "Vikram Singh" },
        { id: "BP-4919", title: "Web Dev Project", pm: "Sneha Mehra", writer: "Deepak Joshi" },
    ]},
    4: { count: 3, assignments: [
        { id: "BP-4920", title: "Statistics HW", pm: "Arjun Nair", writer: "Priya Patel" },
        { id: "BP-4922", title: "English Literature", pm: "Ravi Krishnan", writer: "Kavita Rao" },
        { id: "BP-4925", title: "Physics Lab", pm: "Sneha Mehra", writer: "Vikram Singh" },
    ]},
    7: { count: 1, assignments: [
        { id: "BP-4930", title: "Business Case Study", pm: "Arjun Nair", writer: "Ananya Verma" },
    ]},
    10: { count: 8, assignments: [
        { id: "BP-4940", title: "Dissertation Ch.3", pm: "Ravi Krishnan", writer: "Ananya Verma" },
        { id: "BP-4941", title: "Accounting Assignment", pm: "Sneha Mehra", writer: "Deepak Joshi" },
        { id: "BP-4942", title: "Medical Ethics", pm: "Arjun Nair", writer: "Priya Patel" },
        { id: "BP-4943", title: "Civil Engineering", pm: "Ravi Krishnan", writer: "Vikram Singh" },
        { id: "BP-4944", title: "AI Research", pm: "Sneha Mehra", writer: "Kavita Rao" },
        { id: "BP-4945", title: "Database Design", pm: "Arjun Nair", writer: "Ananya Verma" },
        { id: "BP-4946", title: "Nursing Essay", pm: "Ravi Krishnan", writer: "Priya Patel" },
        { id: "BP-4947", title: "Law Brief", pm: "Sneha Mehra", writer: "Deepak Joshi" },
    ]},
    12: { count: 4, assignments: [
        { id: "BP-4950", title: "OS Lab Report", pm: "Arjun Nair", writer: "Vikram Singh" },
        { id: "BP-4951", title: "Sociology Paper", pm: "Ravi Krishnan", writer: "Kavita Rao" },
        { id: "BP-4952", title: "Chemistry Lab", pm: "Sneha Mehra", writer: "Ananya Verma" },
        { id: "BP-4953", title: "Art History", pm: "Arjun Nair", writer: "Priya Patel" },
    ]},
    15: { count: 18, assignments: [
        { id: "BP-4960", title: "Thesis Defense Prep", pm: "Ravi Krishnan", writer: "Ananya Verma" },
        { id: "BP-4961", title: "MBA Case Study", pm: "Sneha Mehra", writer: "Deepak Joshi" },
        { id: "BP-4962", title: "Network Security", pm: "Arjun Nair", writer: "Vikram Singh" },
        { id: "BP-4963", title: "Pharmacology", pm: "Ravi Krishnan", writer: "Kavita Rao" },
        { id: "BP-4964", title: "UX Design", pm: "Sneha Mehra", writer: "Priya Patel" },
        { id: "BP-4965", title: "Microeconomics", pm: "Arjun Nair", writer: "Ananya Verma" },
        { id: "BP-4966", title: "Genetics Lab", pm: "Ravi Krishnan", writer: "Deepak Joshi" },
        { id: "BP-4967", title: "Philosophy Essay", pm: "Sneha Mehra", writer: "Vikram Singh" },
        { id: "BP-4968", title: "Cloud Computing", pm: "Arjun Nair", writer: "Kavita Rao" },
        { id: "BP-4969", title: "Organic Chemistry", pm: "Ravi Krishnan", writer: "Priya Patel" },
        { id: "BP-4970", title: "Public Health", pm: "Sneha Mehra", writer: "Ananya Verma" },
        { id: "BP-4971", title: "Machine Learning", pm: "Arjun Nair", writer: "Deepak Joshi" },
        { id: "BP-4972", title: "Contract Law", pm: "Ravi Krishnan", writer: "Vikram Singh" },
        { id: "BP-4973", title: "Calculus III", pm: "Sneha Mehra", writer: "Kavita Rao" },
        { id: "BP-4974", title: "Environmental Sci", pm: "Arjun Nair", writer: "Priya Patel" },
        { id: "BP-4975", title: "Digital Marketing", pm: "Ravi Krishnan", writer: "Ananya Verma" },
        { id: "BP-4976", title: "Software Testing", pm: "Sneha Mehra", writer: "Deepak Joshi" },
        { id: "BP-4977", title: "Political Science", pm: "Arjun Nair", writer: "Vikram Singh" },
    ]},
    18: { count: 6, assignments: [
        { id: "BP-4980", title: "Anatomy Report", pm: "Ravi Krishnan", writer: "Kavita Rao" },
        { id: "BP-4981", title: "Java Programming", pm: "Sneha Mehra", writer: "Priya Patel" },
        { id: "BP-4982", title: "Thermal Physics", pm: "Arjun Nair", writer: "Ananya Verma" },
        { id: "BP-4983", title: "Supply Chain", pm: "Ravi Krishnan", writer: "Deepak Joshi" },
        { id: "BP-4984", title: "Criminal Justice", pm: "Sneha Mehra", writer: "Vikram Singh" },
        { id: "BP-4985", title: "Biotech Paper", pm: "Arjun Nair", writer: "Kavita Rao" },
    ]},
    20: { count: 2, assignments: [
        { id: "BP-4990", title: "Electrical Circuits", pm: "Ravi Krishnan", writer: "Priya Patel" },
        { id: "BP-4991", title: "Education Theory", pm: "Sneha Mehra", writer: "Ananya Verma" },
    ]},
    22: { count: 10, assignments: [
        { id: "BP-4995", title: "Capstone Project", pm: "Arjun Nair", writer: "Deepak Joshi" },
        { id: "BP-4996", title: "Forensic Science", pm: "Ravi Krishnan", writer: "Vikram Singh" },
        { id: "BP-4997", title: "Quantum Mechanics", pm: "Sneha Mehra", writer: "Kavita Rao" },
        { id: "BP-4998", title: "Investment Analysis", pm: "Arjun Nair", writer: "Priya Patel" },
        { id: "BP-4999", title: "Pediatric Nursing", pm: "Ravi Krishnan", writer: "Ananya Verma" },
        { id: "BP-5000", title: "Robotics Lab", pm: "Sneha Mehra", writer: "Deepak Joshi" },
        { id: "BP-5001", title: "Taxation", pm: "Arjun Nair", writer: "Vikram Singh" },
        { id: "BP-5002", title: "Social Work", pm: "Ravi Krishnan", writer: "Kavita Rao" },
        { id: "BP-5003", title: "Signal Processing", pm: "Sneha Mehra", writer: "Priya Patel" },
        { id: "BP-5004", title: "Media Studies", pm: "Arjun Nair", writer: "Ananya Verma" },
    ]},
    25: { count: 7, assignments: [
        { id: "BP-5010", title: "Embedded Systems", pm: "Ravi Krishnan", writer: "Deepak Joshi" },
        { id: "BP-5011", title: "Clinical Psychology", pm: "Sneha Mehra", writer: "Vikram Singh" },
        { id: "BP-5012", title: "Strategic Mgmt", pm: "Arjun Nair", writer: "Kavita Rao" },
        { id: "BP-5013", title: "Fluid Mechanics", pm: "Ravi Krishnan", writer: "Priya Patel" },
        { id: "BP-5014", title: "Data Mining", pm: "Sneha Mehra", writer: "Ananya Verma" },
        { id: "BP-5015", title: "Neuroscience", pm: "Arjun Nair", writer: "Deepak Joshi" },
        { id: "BP-5016", title: "Real Estate Law", pm: "Ravi Krishnan", writer: "Vikram Singh" },
    ]},
    27: { count: 3, assignments: [
        { id: "BP-5020", title: "Compiler Design", pm: "Sneha Mehra", writer: "Kavita Rao" },
        { id: "BP-5021", title: "Epidemiology", pm: "Arjun Nair", writer: "Priya Patel" },
        { id: "BP-5022", title: "Brand Strategy", pm: "Ravi Krishnan", writer: "Ananya Verma" },
    ]},
    28: { count: 12, assignments: [
        { id: "BP-5024", title: "Final Submissions", pm: "Sneha Mehra", writer: "Deepak Joshi" },
        { id: "BP-5025", title: "Semester Closeout", pm: "Arjun Nair", writer: "Vikram Singh" },
        { id: "BP-5026", title: "Research Methods", pm: "Ravi Krishnan", writer: "Kavita Rao" },
        { id: "BP-5027", title: "Cybersecurity", pm: "Sneha Mehra", writer: "Priya Patel" },
        { id: "BP-5028", title: "Bioinformatics", pm: "Arjun Nair", writer: "Ananya Verma" },
        { id: "BP-5029", title: "HRM Assignment", pm: "Ravi Krishnan", writer: "Deepak Joshi" },
        { id: "BP-5030", title: "Power Systems", pm: "Sneha Mehra", writer: "Vikram Singh" },
        { id: "BP-5031", title: "Ethics in AI", pm: "Arjun Nair", writer: "Kavita Rao" },
        { id: "BP-5032", title: "Palliative Care", pm: "Ravi Krishnan", writer: "Priya Patel" },
        { id: "BP-5033", title: "Game Theory", pm: "Sneha Mehra", writer: "Ananya Verma" },
        { id: "BP-5034", title: "Maritime Law", pm: "Arjun Nair", writer: "Deepak Joshi" },
        { id: "BP-5035", title: "Nanotechnology", pm: "Ravi Krishnan", writer: "Vikram Singh" },
    ]},
};

export const ADMIN_WIN_LOSS = { wins: 4024, losses: 181 };

/* ═══════════════════════════════════════════════════════
   ADMIN METRICS DATA
   ═══════════════════════════════════════════════════════ */

export type MetricPeriod = "1m" | "6m" | "1y";

export interface MetricPoint {
    label: string;
    value: number;
}

export interface GrowthMetric {
    id: string;
    name: string;
    description: string;
    "1m": { growth: number; data: MetricPoint[] };
    "6m": { growth: number; data: MetricPoint[] };
    "1y": { growth: number; data: MetricPoint[] };
}

export const ADMIN_METRICS: GrowthMetric[] = [
    {
        id: "assignments",
        name: "Assignment Growth",
        description: "Total new assignments received",
        "1m": { growth: 12.4, data: [
            { label: "Week 1", value: 110 }, { label: "Week 2", value: 134 }, { label: "Week 3", value: 128 }, { label: "Week 4", value: 152 },
        ]},
        "6m": { growth: 34.2, data: [
            { label: "Sep", value: 380 }, { label: "Oct", value: 420 }, { label: "Nov", value: 465 }, { label: "Dec", value: 510 }, { label: "Jan", value: 548 }, { label: "Feb", value: 524 },
        ]},
        "1y": { growth: 58.7, data: [
            { label: "Mar", value: 310 }, { label: "Apr", value: 330 }, { label: "May", value: 355 }, { label: "Jun", value: 290 }, { label: "Jul", value: 275 }, { label: "Aug", value: 340 }, { label: "Sep", value: 380 }, { label: "Oct", value: 420 }, { label: "Nov", value: 465 }, { label: "Dec", value: 510 }, { label: "Jan", value: 548 }, { label: "Feb", value: 524 },
        ]},
    },
    {
        id: "dissertations",
        name: "Dissertation Growth",
        description: "Dissertation & thesis orders",
        "1m": { growth: 8.1, data: [
            { label: "Week 1", value: 22 }, { label: "Week 2", value: 28 }, { label: "Week 3", value: 25 }, { label: "Week 4", value: 31 },
        ]},
        "6m": { growth: 22.5, data: [
            { label: "Sep", value: 65 }, { label: "Oct", value: 72 }, { label: "Nov", value: 80 }, { label: "Dec", value: 88 }, { label: "Jan", value: 95 }, { label: "Feb", value: 106 },
        ]},
        "1y": { growth: 41.3, data: [
            { label: "Mar", value: 52 }, { label: "Apr", value: 55 }, { label: "May", value: 60 }, { label: "Jun", value: 48 }, { label: "Jul", value: 45 }, { label: "Aug", value: 58 }, { label: "Sep", value: 65 }, { label: "Oct", value: 72 }, { label: "Nov", value: 80 }, { label: "Dec", value: 88 }, { label: "Jan", value: 95 }, { label: "Feb", value: 106 },
        ]},
    },
    {
        id: "referrals",
        name: "Referral Growth",
        description: "New referral signups via codes",
        "1m": { growth: 18.6, data: [
            { label: "Week 1", value: 34 }, { label: "Week 2", value: 42 }, { label: "Week 3", value: 38 }, { label: "Week 4", value: 47 },
        ]},
        "6m": { growth: 45.0, data: [
            { label: "Sep", value: 88 }, { label: "Oct", value: 102 }, { label: "Nov", value: 115 }, { label: "Dec", value: 130 }, { label: "Jan", value: 145 }, { label: "Feb", value: 161 },
        ]},
        "1y": { growth: 72.4, data: [
            { label: "Mar", value: 60 }, { label: "Apr", value: 65 }, { label: "May", value: 70 }, { label: "Jun", value: 58 }, { label: "Jul", value: 62 }, { label: "Aug", value: 78 }, { label: "Sep", value: 88 }, { label: "Oct", value: 102 }, { label: "Nov", value: 115 }, { label: "Dec", value: 130 }, { label: "Jan", value: 145 }, { label: "Feb", value: 161 },
        ]},
    },
    {
        id: "signups",
        name: "User Signup Growth",
        description: "New student registrations",
        "1m": { growth: 15.2, data: [
            { label: "Week 1", value: 68 }, { label: "Week 2", value: 82 }, { label: "Week 3", value: 74 }, { label: "Week 4", value: 91 },
        ]},
        "6m": { growth: 38.8, data: [
            { label: "Sep", value: 210 }, { label: "Oct", value: 245 }, { label: "Nov", value: 268 }, { label: "Dec", value: 290 }, { label: "Jan", value: 315 }, { label: "Feb", value: 340 },
        ]},
        "1y": { growth: 65.1, data: [
            { label: "Mar", value: 155 }, { label: "Apr", value: 168 }, { label: "May", value: 180 }, { label: "Jun", value: 145 }, { label: "Jul", value: 138 }, { label: "Aug", value: 190 }, { label: "Sep", value: 210 }, { label: "Oct", value: 245 }, { label: "Nov", value: 268 }, { label: "Dec", value: 290 }, { label: "Jan", value: 315 }, { label: "Feb", value: 340 },
        ]},
    },
    {
        id: "revenue",
        name: "Revenue Growth",
        description: "Monthly revenue trend",
        "1m": { growth: 9.8, data: [
            { label: "Week 1", value: 180 }, { label: "Week 2", value: 210 }, { label: "Week 3", value: 195 }, { label: "Week 4", value: 230 },
        ]},
        "6m": { growth: 28.6, data: [
            { label: "Sep", value: 520 }, { label: "Oct", value: 580 }, { label: "Nov", value: 640 }, { label: "Dec", value: 710 }, { label: "Jan", value: 760 }, { label: "Feb", value: 815 },
        ]},
        "1y": { growth: 52.3, data: [
            { label: "Mar", value: 380 }, { label: "Apr", value: 400 }, { label: "May", value: 430 }, { label: "Jun", value: 350 }, { label: "Jul", value: 340 }, { label: "Aug", value: 460 }, { label: "Sep", value: 520 }, { label: "Oct", value: 580 }, { label: "Nov", value: 640 }, { label: "Dec", value: 710 }, { label: "Jan", value: 760 }, { label: "Feb", value: 815 },
        ]},
    },
    {
        id: "completion_rate",
        name: "Completion Rate",
        description: "Percentage of assignments completed on time",
        "1m": { growth: 2.1, data: [
            { label: "Week 1", value: 91 }, { label: "Week 2", value: 93 }, { label: "Week 3", value: 92 }, { label: "Week 4", value: 94 },
        ]},
        "6m": { growth: 5.4, data: [
            { label: "Sep", value: 88 }, { label: "Oct", value: 89 }, { label: "Nov", value: 90 }, { label: "Dec", value: 91 }, { label: "Jan", value: 93 }, { label: "Feb", value: 94 },
        ]},
        "1y": { growth: 8.2, data: [
            { label: "Mar", value: 85 }, { label: "Apr", value: 86 }, { label: "May", value: 86 }, { label: "Jun", value: 87 }, { label: "Jul", value: 87 }, { label: "Aug", value: 88 }, { label: "Sep", value: 88 }, { label: "Oct", value: 89 }, { label: "Nov", value: 90 }, { label: "Dec", value: 91 }, { label: "Jan", value: 93 }, { label: "Feb", value: 94 },
        ]},
    },
];

export interface WriterWorkload {
    name: string;
    assigned: number;
    completed: number;
    avgTurnaround: number; // hours
}

export const ADMIN_WRITER_WORKLOADS: WriterWorkload[] = [
    { name: "Ananya Verma", assigned: 47, completed: 44, avgTurnaround: 36 },
    { name: "Deepak Joshi", assigned: 38, completed: 35, avgTurnaround: 42 },
    { name: "Priya Patel", assigned: 42, completed: 40, avgTurnaround: 30 },
    { name: "Kavita Rao", assigned: 35, completed: 33, avgTurnaround: 48 },
    { name: "Vikram Singh", assigned: 40, completed: 37, avgTurnaround: 38 },
    { name: "Sanjay Kumar", assigned: 28, completed: 26, avgTurnaround: 44 },
    { name: "Neha Sharma", assigned: 33, completed: 31, avgTurnaround: 34 },
    { name: "Rohit Agarwal", assigned: 30, completed: 28, avgTurnaround: 40 },
    { name: "Misha Gupta", assigned: 36, completed: 34, avgTurnaround: 32 },
    { name: "Aryan Das", assigned: 25, completed: 24, avgTurnaround: 46 },
];

/* ═══════════════════════ Admin Assignments ═══════════════════════ */

export const ADMIN_STATUS_STEPS = [
    "Posted",
    "Processing",
    "Assigned to PM",
    "Assigned to Freelancer",
    "In Progress",
    "Completed (Marks Pending)",
    "Completed",
    "Review Received",
] as const;

export const ADMIN_STREAMS = [
    "Business & Management",
    "Engineering",
    "Medical & Health Sciences",
    "Law",
    "Computer Science",
    "Arts & Humanities",
    "Commerce & Accounting",
    "Science",
] as const;

export const ADMIN_PM_LIST = [
    "Arjun Mehta",
    "Sneha Reddy",
    "Kunal Bhatia",
    "Ritu Kapoor",
] as const;

export const ADMIN_FREELANCER_LIST = [
    "Ananya Verma",
    "Deepak Joshi",
    "Priya Patel",
    "Kavita Rao",
    "Vikram Singh",
    "Neha Sharma",
    "Rohit Agarwal",
    "Misha Gupta",
] as const;

export interface AdminAssignment {
    id: string;
    title: string;
    description: string;
    type: string;
    subtype: string;
    subject: string;
    stream: string;
    academicLevel: string;
    wordCount: number;
    deadline: string;
    submittedAt: string;
    stage: AssignmentStageKey;
    freelancerAmount: number;
    totalAmount: number;
    referencingStyle: string;
    marks: number | null;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    pmName: string;
    pmPhone: string;
    freelancerName: string;
    freelancerPhone: string;
    currentStep: number;
}

export const ADMIN_ASSIGNMENTS: AdminAssignment[] = [
    {
        id: "ASG-2001",
        title: "Impact of AI on Supply Chain Management",
        description: "A comprehensive research paper analyzing how artificial intelligence technologies—machine learning, predictive analytics, and robotic process automation—are transforming supply chain operations across global enterprises.",
        type: "Research Paper", subtype: "Analytical",
        subject: "Supply Chain Management", stream: "Business & Management",
        academicLevel: "Postgraduate", wordCount: 5000,
        deadline: "2025-02-28T23:59:00", submittedAt: "2025-02-10T14:30:00",
        stage: "completed", freelancerAmount: 3500, totalAmount: 5200,
        referencingStyle: "APA 7th", marks: 82,
        studentName: "Aarav Gupta", studentEmail: "aarav.gupta@university.edu", studentPhone: "+919812345001",
        pmName: "Arjun Mehta", pmPhone: "+919812300001",
        freelancerName: "Ananya Verma", freelancerPhone: "+919812400001",
        currentStep: 7,
    },
    {
        id: "ASG-2002",
        title: "Structural Analysis of Reinforced Concrete Beams",
        description: "Detailed structural analysis examining the load-bearing capacity and failure modes of reinforced concrete beams under varying stress conditions. Include FEM simulations and compare with analytical solutions.",
        type: "Technical Report", subtype: "Experimental",
        subject: "Structural Engineering", stream: "Engineering",
        academicLevel: "Undergraduate", wordCount: 3500,
        deadline: "2025-03-15T23:59:00", submittedAt: "2025-02-20T09:15:00",
        stage: "in_progress", freelancerAmount: 2800, totalAmount: 4200,
        referencingStyle: "IEEE", marks: null,
        studentName: "Meera Iyer", studentEmail: "meera.iyer@college.edu", studentPhone: "+919812345002",
        pmName: "Sneha Reddy", pmPhone: "+919812300002",
        freelancerName: "Deepak Joshi", freelancerPhone: "+919812400002",
        currentStep: 4,
    },
    {
        id: "ASG-2003",
        title: "Clinical Pathways in Diabetic Patient Management",
        description: "Evaluate current clinical pathways for managing Type 2 diabetes in Indian healthcare settings. Review evidence-based guidelines and propose improvements for resource-limited primary care centers.",
        type: "Case Study", subtype: "Clinical",
        subject: "Internal Medicine", stream: "Medical & Health Sciences",
        academicLevel: "Postgraduate", wordCount: 4000,
        deadline: "2025-03-20T23:59:00", submittedAt: "2025-02-25T11:00:00",
        stage: "assigned", freelancerAmount: 3200, totalAmount: 4800,
        referencingStyle: "Vancouver", marks: null,
        studentName: "Arjun Nair", studentEmail: "arjun.nair@university.edu", studentPhone: "+919812345003",
        pmName: "Kunal Bhatia", pmPhone: "+919812300003",
        freelancerName: "Priya Patel", freelancerPhone: "+919812400003",
        currentStep: 3,
    },
    {
        id: "ASG-2004",
        title: "Constitutional Validity of Sedition Laws",
        description: "A critical legal analysis of Section 124A of the Indian Penal Code examining its constitutional validity under Article 19(1)(a). Include landmark Supreme Court judgments and comparative analysis with UK and US sedition laws.",
        type: "Dissertation", subtype: "Legal Analysis",
        subject: "Constitutional Law", stream: "Law",
        academicLevel: "Postgraduate", wordCount: 8000,
        deadline: "2025-02-20T23:59:00", submittedAt: "2025-01-15T16:45:00",
        stage: "completed", freelancerAmount: 6000, totalAmount: 9500,
        referencingStyle: "OSCOLA", marks: 91,
        studentName: "Diya Banerjee", studentEmail: "diya.banerjee@college.edu", studentPhone: "+919812345004",
        pmName: "Ritu Kapoor", pmPhone: "+919812300004",
        freelancerName: "Kavita Rao", freelancerPhone: "+919812400004",
        currentStep: 6,
    },
    {
        id: "ASG-2005",
        title: "Machine Learning Approaches to Sentiment Analysis",
        description: "Implement and compare NLP-based sentiment analysis models (LSTM, BERT, and traditional ML classifiers) on a custom-scraped social media dataset. Include accuracy metrics and confusion matrices.",
        type: "Project Report", subtype: "Implementation",
        subject: "Natural Language Processing", stream: "Computer Science",
        academicLevel: "Undergraduate", wordCount: 4500,
        deadline: "2025-03-10T23:59:00", submittedAt: "2025-02-15T08:30:00",
        stage: "under_review", freelancerAmount: 3800, totalAmount: 5500,
        referencingStyle: "APA 7th", marks: null,
        studentName: "Ishaan Tiwari", studentEmail: "ishaan.tiwari@university.edu", studentPhone: "+919812345005",
        pmName: "Arjun Mehta", pmPhone: "+919812300001",
        freelancerName: "Vikram Singh", freelancerPhone: "+919812400005",
        currentStep: 5,
    },
    {
        id: "ASG-2006",
        title: "Postcolonial Themes in Arundhati Roy's Fiction",
        description: "Analyze postcolonial narratives in Arundhati Roy's major novels, examining themes of caste, class, gender, and environmental justice. Apply frameworks from Said, Spivak, and Bhabha.",
        type: "Essay", subtype: "Literary Analysis",
        subject: "English Literature", stream: "Arts & Humanities",
        academicLevel: "Undergraduate", wordCount: 3000,
        deadline: "2025-03-25T23:59:00", submittedAt: "2025-03-05T10:20:00",
        stage: "submitted", freelancerAmount: 2000, totalAmount: 3200,
        referencingStyle: "MLA 9th", marks: null,
        studentName: "Kavya Menon", studentEmail: "kavya.menon@college.edu", studentPhone: "+919812345006",
        pmName: "Sneha Reddy", pmPhone: "+919812300002",
        freelancerName: "Neha Sharma", freelancerPhone: "+919812400006",
        currentStep: 1,
    },
    {
        id: "ASG-2007",
        title: "GST Impact on Small & Medium Enterprises",
        description: "Evaluate the impact of Goods and Services Tax implementation on SME operations in India. Analyze compliance costs, input tax credit utilization, and working capital challenges using primary survey data.",
        type: "Research Paper", subtype: "Empirical",
        subject: "Taxation", stream: "Commerce & Accounting",
        academicLevel: "Postgraduate", wordCount: 5500,
        deadline: "2025-03-08T23:59:00", submittedAt: "2025-02-12T13:00:00",
        stage: "revision", freelancerAmount: 4000, totalAmount: 6200,
        referencingStyle: "Harvard", marks: null,
        studentName: "Nikhil Reddy", studentEmail: "nikhil.reddy@university.edu", studentPhone: "+919812345007",
        pmName: "Kunal Bhatia", pmPhone: "+919812300003",
        freelancerName: "Rohit Agarwal", freelancerPhone: "+919812400007",
        currentStep: 4,
    },
    {
        id: "ASG-2008",
        title: "Quantum Entanglement and Teleportation Protocols",
        description: "Review the theoretical foundations of quantum entanglement and its application in quantum teleportation protocols. Discuss experimental confirmations and implications for quantum computing.",
        type: "Literature Review", subtype: "Theoretical",
        subject: "Quantum Physics", stream: "Science",
        academicLevel: "Postgraduate", wordCount: 4000,
        deadline: "2025-02-15T23:59:00", submittedAt: "2025-01-20T15:30:00",
        stage: "completed", freelancerAmount: 3400, totalAmount: 5000,
        referencingStyle: "APA 7th", marks: 75,
        studentName: "Pooja Mehta", studentEmail: "pooja.mehta@college.edu", studentPhone: "+919812345008",
        pmName: "Ritu Kapoor", pmPhone: "+919812300004",
        freelancerName: "Ananya Verma", freelancerPhone: "+919812400001",
        currentStep: 7,
    },
    {
        id: "ASG-2009",
        title: "Autonomous Vehicle Navigation Using LiDAR",
        description: "Design and simulate a LiDAR-based obstacle detection and path planning system for autonomous vehicles. Implement SLAM algorithms and test in simulated urban environments.",
        type: "Project Report", subtype: "Implementation",
        subject: "Robotics & Automation", stream: "Engineering",
        academicLevel: "Postgraduate", wordCount: 6000,
        deadline: "2025-03-30T23:59:00", submittedAt: "2025-03-01T07:45:00",
        stage: "in_progress", freelancerAmount: 5000, totalAmount: 7500,
        referencingStyle: "IEEE", marks: null,
        studentName: "Riya Singh", studentEmail: "riya.singh@university.edu", studentPhone: "+919812345009",
        pmName: "Arjun Mehta", pmPhone: "+919812300001",
        freelancerName: "Deepak Joshi", freelancerPhone: "+919812400002",
        currentStep: 4,
    },
    {
        id: "ASG-2010",
        title: "Brand Loyalty in Indian FMCG Sector",
        description: "Investigate factors influencing brand loyalty among Indian consumers in the FMCG sector. Conduct a quantitative study using structured questionnaires and analyze using SEM-PLS methodology.",
        type: "Dissertation", subtype: "Empirical",
        subject: "Marketing Management", stream: "Business & Management",
        academicLevel: "Postgraduate", wordCount: 10000,
        deadline: "2025-02-25T23:59:00", submittedAt: "2025-01-10T12:00:00",
        stage: "completed", freelancerAmount: 7500, totalAmount: 12000,
        referencingStyle: "APA 7th", marks: 88,
        studentName: "Siddharth Roy", studentEmail: "siddharth.roy@college.edu", studentPhone: "+919812345010",
        pmName: "Sneha Reddy", pmPhone: "+919812300002",
        freelancerName: "Kavita Rao", freelancerPhone: "+919812400004",
        currentStep: 6,
    },
    {
        id: "ASG-2011",
        title: "Epidemiology of Antibiotic Resistance in India",
        description: "Map the epidemiological landscape of antimicrobial resistance across Indian tertiary care hospitals. Analyze resistance patterns for key pathogen groups and discuss public health interventions.",
        type: "Research Paper", subtype: "Epidemiological",
        subject: "Microbiology", stream: "Medical & Health Sciences",
        academicLevel: "Postgraduate", wordCount: 5500,
        deadline: "2025-04-05T23:59:00", submittedAt: "2025-03-10T09:00:00",
        stage: "submitted", freelancerAmount: 4200, totalAmount: 6500,
        referencingStyle: "Vancouver", marks: null,
        studentName: "Tanvi Desai", studentEmail: "tanvi.desai@university.edu", studentPhone: "+919812345011",
        pmName: "Kunal Bhatia", pmPhone: "+919812300003",
        freelancerName: "Priya Patel", freelancerPhone: "+919812400003",
        currentStep: 0,
    },
    {
        id: "ASG-2012",
        title: "Cybersecurity Framework for Banking Systems",
        description: "Design a comprehensive cybersecurity framework for Indian banking systems addressing threats from phishing, ransomware, and insider attacks. Include risk assessment matrices and incident response protocols.",
        type: "Technical Report", subtype: "Framework Design",
        subject: "Information Security", stream: "Computer Science",
        academicLevel: "Undergraduate", wordCount: 4000,
        deadline: "2025-03-18T23:59:00", submittedAt: "2025-02-28T14:20:00",
        stage: "assigned", freelancerAmount: 3000, totalAmount: 4500,
        referencingStyle: "IEEE", marks: null,
        studentName: "Varun Joshi", studentEmail: "varun.joshi@college.edu", studentPhone: "+919812345012",
        pmName: "Ritu Kapoor", pmPhone: "+919812300004",
        freelancerName: "Vikram Singh", freelancerPhone: "+919812400005",
        currentStep: 2,
    },
    {
        id: "ASG-2013",
        title: "Environmental Law and Corporate Accountability",
        description: "Examine the efficacy of Indian environmental legislation in holding corporations accountable for ecological damage. Analyze the National Green Tribunal's role and landmark environmental judgments.",
        type: "Research Paper", subtype: "Legal Analysis",
        subject: "Environmental Law", stream: "Law",
        academicLevel: "Undergraduate", wordCount: 3500,
        deadline: "2025-02-10T23:59:00", submittedAt: "2025-01-05T11:30:00",
        stage: "completed", freelancerAmount: 2500, totalAmount: 3800,
        referencingStyle: "OSCOLA", marks: 67,
        studentName: "Anisha Kapoor", studentEmail: "anisha.kapoor@university.edu", studentPhone: "+919812345013",
        pmName: "Arjun Mehta", pmPhone: "+919812300001",
        freelancerName: "Neha Sharma", freelancerPhone: "+919812400006",
        currentStep: 7,
    },
    {
        id: "ASG-2014",
        title: "Heat Transfer Analysis in Solar Collectors",
        description: "Perform numerical analysis of heat transfer characteristics in flat-plate and evacuated tube solar collectors. Model using CFD and validate against experimental data from literature.",
        type: "Technical Report", subtype: "Computational",
        subject: "Thermal Engineering", stream: "Engineering",
        academicLevel: "Postgraduate", wordCount: 4500,
        deadline: "2025-03-01T23:59:00", submittedAt: "2025-02-05T16:00:00",
        stage: "cancelled", freelancerAmount: 3200, totalAmount: 4800,
        referencingStyle: "IEEE", marks: null,
        studentName: "Karthik Subramanian", studentEmail: "karthik.s@college.edu", studentPhone: "+919812345014",
        pmName: "Sneha Reddy", pmPhone: "+919812300002",
        freelancerName: "Vikram Singh", freelancerPhone: "+919812400005",
        currentStep: 1,
    },
    {
        id: "ASG-2015",
        title: "Renaissance Art and Religious Symbolism",
        description: "Explore the interplay between religious symbolism and artistic innovation in Italian Renaissance art. Focus on works by Botticelli, Michelangelo, and Raphael, analyzing commission contexts and theological implications.",
        type: "Essay", subtype: "Art Historical",
        subject: "Art History", stream: "Arts & Humanities",
        academicLevel: "Undergraduate", wordCount: 2500,
        deadline: "2025-03-22T23:59:00", submittedAt: "2025-03-02T08:00:00",
        stage: "in_progress", freelancerAmount: 1800, totalAmount: 2800,
        referencingStyle: "Chicago", marks: null,
        studentName: "Nandini Sharma", studentEmail: "nandini.sharma@university.edu", studentPhone: "+919812345015",
        pmName: "Kunal Bhatia", pmPhone: "+919812300003",
        freelancerName: "Rohit Agarwal", freelancerPhone: "+919812400007",
        currentStep: 3,
    },
];

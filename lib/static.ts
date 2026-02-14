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


import {
    FileText,
    GraduationCap,
    BookOpen,
    PenTool,
    Shield,
    Clock,
    Zap,
    CheckCircle2,
} from "lucide-react";

export const assignmentTypes = [
    {
        id: "assignment",
        title: "Assignment / Coursework",
        description:
            "Essays, reports, case studies, research papers, and all coursework types",
        icon: FileText,
        popular: true,
        subtypes: [
            "Essay",
            "Research Paper",
            "Case Study",
            "Report",
            "Literature Review",
            "Presentation",
            "Lab Report",
            "Annotated Bibliography",
            "Reflection Paper",
            "Book Review",
            "Other",
        ],
    },
    {
        id: "dissertation",
        title: "Masters Dissertation",
        description:
            "Complete dissertations, individual chapters, or professional editing",
        icon: GraduationCap,
        popular: false,
        subtypes: [
            "Full Dissertation",
            "Dissertation Proposal",
            "Individual Chapter",
            "Literature Review",
            "Methodology",
            "Data Analysis",
            "Editing & Proofreading",
        ],
    },
    {
        id: "phd",
        title: "PhD Thesis & Proposal",
        description:
            "Doctoral research from proposal writing to defense preparation",
        icon: BookOpen,
        popular: false,
        subtypes: [
            "PhD Proposal",
            "Full Thesis",
            "Individual Chapter",
            "Systematic Review",
            "Statistical Analysis",
            "Research Framework",
            "Editing & Proofreading",
        ],
    },
    {
        id: "application",
        title: "University Applications",
        description:
            "SOPs, personal statements, LORs, and compelling admission essays",
        icon: PenTool,
        popular: false,
        subtypes: [
            "Statement of Purpose (SOP)",
            "Personal Statement",
            "Letter of Recommendation (LOR)",
            "Admission Essay",
            "CV / Resume",
            "Scholarship Essay",
        ],
    },
];

export const academicLevels = [
    "High School",
    "Undergraduate (Year 1-2)",
    "Undergraduate (Year 3-4)",
    "Postgraduate / Masters",
    "PhD / Doctoral",
    "Professional",
];

export const referencingStyles = [
    "APA 7th Edition",
    "Harvard",
    "MLA",
    "Chicago / Turabian",
    "IEEE",
    "Vancouver",
    "OSCOLA",
    "AMA",
    "Not sure / Other",
];

export const guarantees = [
    { icon: Shield, text: "Plagiarism‑free" },
    { icon: Clock, text: "On‑time delivery" },
    { icon: Zap, text: "Free revisions" },
    { icon: CheckCircle2, text: "Secure payment" },
];

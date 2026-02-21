/* Shared constants used across all sections */

export const stageColor: Record<string, { bg: string; text: string; dot: string }> = {
    submitted: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    assigned_pm: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
    assigned_freelancer: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    in_progress: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
    completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    marks_received: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
};

export const stageLabel: Record<string, string> = {
    submitted: "Submitted",
    assigned_pm: "Assigned PM",
    assigned_freelancer: "Assigned Freelancer",
    in_progress: "In Progress",
    completed: "Completed",
    marks_received: "Marks Received",
};

export const fmtDate = (iso: string) => {
    if (!iso || iso === "—") return "—";
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export const fmtMoney = (n: number) => {
    if (n == null) return "—";
    return "₹" + n.toLocaleString("en-IN");
};

export const fmtRelative = (iso: string) => {
    if (!iso || iso === "—") return "";
    const diff = Date.now() - new Date(iso).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return "Today";
    if (d === 1) return "Yesterday";
    return `${d} days ago`;
};

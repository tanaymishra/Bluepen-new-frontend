
export const metadata = {
    title: "Revision Policy - Bluepen",
    description: "Understand our revision and changes policy.",
};

export default function ChangesPage() {
    return (
        <article className="prose prose-slate max-w-none font-poppins text-gray-700">
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 mb-6">Revision & Modification Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">1. Free Revisions</h2>
            <p>
                We offer free revisions if the delivered work does not meet the initial requirements provided at the time of order placement. You are entitled to unlimited revisions within 14 days of receiving the final draft.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">2. Requesting a Revision</h2>
            <p>
                To request a revision, please contact your assigned expert or our support team with specific details on what needs to be changed. Vague requests may delay the revision process.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">3. Changes to Initial Requirements</h2>
            <p>
                If you request changes that deviate from the original instructions (e.g., adding new sections, changing the topic, or increasing word count), additional charges may apply. These are considered "new requirements" rather than revisions.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">4. Turnaround Time for Revisions</h2>
            <p>
                We aim to complete revisions within 24-48 hours. Urgent revisions can be expedited upon request, depending on expert availability.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">5. Dispute Resolution</h2>
            <p>
                If you are unsatisfied with the revisions, our Quality Assurance team will review the case. If the work is found to be compliant with initial instructions, further revisions may be denied or charged.
            </p>
        </article>
    );
}

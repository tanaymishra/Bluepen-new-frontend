
export const metadata = {
    title: "Refund Policy - Bluepen",
    description: "Read our refund and cancellation policy.",
};

export default function RefundPage() {
    return (
        <article className="prose prose-slate max-w-none font-poppins text-gray-700">
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 mb-6">Refund & Cancellation Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">1. Refund Eligibility</h2>
            <p>
                Refunds are issued based on the specific circumstances of each case. We offer full or partial refunds for issues such as non-delivery, significant quality concerns, or plagarism.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">2. Non-Delivery</h2>
            <p>
                If we fail to deliver your work by the agreed deadline without prior notice or extension, you are entitled to a refund.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">3. Plagiarism</h2>
            <p>
                If a Turnitin report (or equivalent) confirms plagiarism above the acceptable threshold (typically 10-15%), we will revise the work for free or issue a refund.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">4. Cancellation</h2>
            <p>
                You may cancel an order before an expert has been assigned for a full refund. Once an expert has started working, cancellation may only be eligible for a partial refund (e.g., 50%) depending on the progress made.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">5. Processing Time</h2>
            <p>
                Refund requests are processed within 5-7 business days. Once approved, the refund will be credited back to your original payment method.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">6. Disputes</h2>
            <p>
                If you file a chargeback or payment dispute without first contacting us to resolve the issue, your account may be suspended and future orders blocked.
            </p>
        </article>
    );
}

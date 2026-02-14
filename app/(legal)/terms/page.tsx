
export const metadata = {
    title: "Terms of Service - Bluepen",
    description: "Read our terms of service.",
};

export default function TermsPage() {
    return (
        <article className="prose prose-slate max-w-none font-poppins text-gray-700">
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 mb-6">Terms of Service</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">2. Service Description</h2>
            <p>
                Bluepen provides an online platform connecting students with academic experts for assistance with various educational assignments. The services provided are intended for research and reference purposes only.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">3. User Obligations</h2>
            <p>
                Users agree to provide accurate and complete information when registering for an account. Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">4. Academic Integrity</h2>
            <p>
                We strongly condemn plagiarism. The materials provided by our experts are meant to be used as model papers or for research purposes. Submitting these materials as your own work without proper citation is strictly prohibited.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">5. Revisions and Refunds</h2>
            <p>
                Please refer to our Revision Policy and Refund Policy for detailed information regarding modifications to delivered work and refund eligibility.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">6. Contact Us</h2>
            <p>
                If you have any questions about these Terms, please contact us at support@bluepen.co.in.
            </p>
        </article>
    );
}


export const metadata = {
    title: "Privacy Policy - Bluepen",
    description: "Learn how we protect your personal information.",
};

export default function PrivacyPage() {
    return (
        <article className="prose prose-slate max-w-none font-poppins text-gray-700">
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">1. Information We Collect</h2>
            <p>
                We collect personal information that you provide to us directly, such as when you create an account, submit an assignment request, or contact customer support. This may include your name, email address, phone number, and academic details.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">2. How We Use Your Information</h2>
            <p>
                We use your information to provide, maintain, and improve our services, communicate with you about your account or orders, and ensure compliance with our terms. We do not sell your personal data to third parties.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">3. Data Security</h2>
            <p>
                We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is completely secure.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">4. Cookies</h2>
            <p>
                We use cookies and similar technologies to enhance your experience, analyze site usage, and assist in our marketing efforts. You can modify your browser settings to disable cookies if you prefer.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">5. Third-Party Links</h2>
            <p>
                Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of such websites.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">6. Changes to This Policy</h2>
            <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
        </article>
    );
}

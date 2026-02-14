
export const metadata = {
    title: "Referral Program - Bluepen",
    description: "Learn about our referral program and rewards.",
};

export default function ReferralPage() {
    return (
        <article className="prose prose-slate max-w-none font-poppins text-gray-700">
            <h1 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 mb-6">Referral Program Terms</h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">1. How It Works</h2>
            <p>
                Invite your friends to use Bluepen with your unique referral code or link. When they make their first successful order, you both earn rewards.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">2. Rewards</h2>
            <p>
                - <strong>Referrer:</strong> You receive a 15% credit on your next order for each friend who completes a purchase.<br />
                - <strong>Referee:</strong> Your friend gets 10% off their first order.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">3. Eligibility</h2>
            <p>
                The referral program is open to all registered users. You cannot refer yourself or use multiple accounts to game the system. Orders must be valid and paid in full to qualify.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">4. Abuse and Termination</h2>
            <p>
                Bluepen reserves the right to disqualify any user from the referral program if we suspect fraudulent activity or abuse of these terms. We may revoke any earned credits and suspend accounts involved in such activities.
            </p>

            <h2 className="text-2xl font-bold font-montserrat text-gray-800 mt-8 mb-4">5. Modifications</h2>
            <p>
                We may update or terminate the referral program at any time without prior notice. Any unclaimed rewards will be subject to the terms in effect at the time of earning.
            </p>
        </article>
    );
}

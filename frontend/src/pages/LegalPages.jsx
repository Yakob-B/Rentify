import React from 'react'
import PageHeader from '../components/PageHeader'

const LegalContent = ({ title, lastUpdated, children }) => (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
        <PageHeader title={title} subtitle={`Last Updated: ${lastUpdated}`} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12 prose dark:prose-invert max-w-none">
                {children}
            </div>
        </div>
    </div>
)

export const PrivacyPolicy = () => {
    return (
        <LegalContent title="Privacy Policy" lastUpdated="December 12, 2025">
            <h3>1. Information We Collect</h3>
            <p>
                We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.
            </p>

            <h3>2. How We Use Your Information</h3>
            <p>
                We use the information we collect to facilitate the rental process, including:
            </p>
            <ul>
                <li>Connect owners and renters.</li>
                <li>Process payments and refunds.</li>
                <li>Send you support and administrative messages.</li>
                <li>Detect and prevent fraud.</li>
            </ul>

            <h3>3. Sharing of Information</h3>
            <p>
                We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows:
            </p>
            <ul>
                <li>With third party service providers to provide services such as payment processing and data hosting.</li>
                <li>With other users (e.g. sharing renter info with owners for bookings).</li>
            </ul>

            <h3>4. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us.</p>
        </LegalContent>
    )
}

export const TermsOfService = () => {
    return (
        <LegalContent title="Terms of Service" lastUpdated="December 12, 2025">
            <h3>1. Acceptance of Terms</h3>
            <p>
                By accessing or using the Rentify platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the services.
            </p>

            <h3>2. Description of Service</h3>
            <p>
                Rentify provides a platform that connects people who have items to rent ("Owners") with people seeking to rent those items ("Renters"). Rentify allows Owners to list items and Renters to book them.
            </p>

            <h3>3. User Conduct</h3>
            <p>
                You describe to use the service only for lawful purposes. You are solely responsible for your conduct and any data, text, information, usernames, graphics, images, photos, profiles, audio and video clips, links and other content that you submit, post, and display on the Rentify service.
            </p>

            <h3>4. Limitation of Liability</h3>
            <p>
                Rentify shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
            </p>
        </LegalContent>
    )
}

export const CookiePolicy = () => {
    return (
        <LegalContent title="Cookie Policy" lastUpdated="December 12, 2025">
            <h3>1. What are cookies?</h3>
            <p>
                Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser. These cookies help us make the website function properly, make it more secure, provide better user experience, and understand how the website performs.
            </p>

            <h3>2. How do we use cookies?</h3>
            <p>
                As with most of the online services, our website uses first-party and third-party cookies for several purposes. First-party cookies are mostly necessary for the website to function the right way (like keeping you logged in), and they do not collect any of your personally identifiable data.
            </p>

            <h3>3. What types of cookies do we use?</h3>
            <ul>
                <li><strong>Essential:</strong> Some cookies are essential for you to be able to experience the full functionality of our site. They allow us to maintain user sessions and prevent any security threats.</li>
                <li><strong>Functional:</strong> These are the cookies that help certain non-essential functionalities on our website. These functionalities include embedding content like videos or sharing content of the website on social media platforms.</li>
            </ul>
        </LegalContent>
    )
}

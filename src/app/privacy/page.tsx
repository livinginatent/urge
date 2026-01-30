import Link from "next/link";
import { NavBar } from "@/components/navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#a1a1aa] scroll-smooth">
      <NavBar />

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <header className="mb-10 border-b-2 border-[#27272a] pb-6">
          <p className="text-[10px] tracking-[0.3em] text-[#52525b] uppercase mb-3">
            Legal / Privacy Policy
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            How URGE Handles Your Data
          </h1>
          <p className="mt-4 text-sm text-[#52525b]">
            No dark patterns. No surprise tracking. Just what we collect, why,
            and what you can do about it.
          </p>
        </header>

        <section className="space-y-8 text-sm leading-relaxed">
          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-3 uppercase tracking-[0.2em] text-xs">
              1. What We Collect
            </h2>
            <p className="mb-3">
              To run URGE, we collect only what we need to provide the service:
            </p>
            
            <div className="space-y-3">
              <div>
                <p className="text-white font-semibold mb-1">Account Information:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Email address (required for account creation and authentication)</li>
                  <li>Username (unique identifier you choose)</li>
                  <li>Account creation and last update timestamps</li>
                  <li>Authentication credentials (hashed passwords managed by Supabase Auth)</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Habit Tracking Data:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Streak data: current streak count, longest streak, start dates, reset timestamps</li>
                  <li>Urge events: when you resist or give in, with optional notes</li>
                  <li>Relapse records: streak length at time of relapse, triggers, feelings, and optional notes</li>
                  <li>Journal entries: up to 3 entries per day, each limited to 500 characters</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Subscription &amp; Payment Data:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Subscription status (active, cancelled, expired, etc.)</li>
                  <li>Payment provider customer ID (linked to your account)</li>
                  <li>Subscription ID and end dates</li>
                  <li>Payment processing is handled entirely by our payment provider—we never see or store your payment card details</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Technical Data:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                 
                  <li>Browser and device information (for compatibility and support)</li>
                  <li>Session data (to keep you logged in)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-3 uppercase tracking-[0.2em] text-xs">
              2. How We Use Your Data
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-white font-semibold mb-1">Core Service Delivery:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Authenticate your account and maintain your login session</li>
                  <li>Calculate and display your current streak and longest streak</li>
                  <li>Log and track your urges (resisted or gave in) with timestamps</li>
                  <li>Record relapses with associated context (triggers, feelings, notes)</li>
                  <li>Store and display your journal entries (up to 3 per day)</li>
                  <li>Send you 3 automated accountability emails per day (The Sentinel)</li>
                  <li>Manage your subscription status and billing</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Service Improvement:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Aggregate anonymized usage patterns to understand how the service is used</li>
                  <li>Identify bugs and technical issues</li>
                  <li>Improve features and user experience</li>
                  <li>No personal identifiers are included in aggregated analytics</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Security &amp; Legal:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Prevent fraud, abuse, and unauthorized access</li>
                  <li>Comply with legal obligations and respond to valid legal requests</li>
                  <li>Enforce our Terms of Service</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-3 uppercase tracking-[0.2em] text-xs">
              3. What We Don&apos;t Do
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">No selling your data:</strong> We never sell, rent, or trade your personal information to third parties for marketing or any other purpose.</li>
              <li><strong className="text-white">No advertising networks:</strong> We don&apos;t use advertising networks, ad trackers, or behavioral profiling systems.</li>
              <li><strong className="text-white">No hidden trackers:</strong> We don&apos;t embed third-party tracking scripts that follow you across the web.</li>
              <li><strong className="text-white">No data mining:</strong> We don&apos;t analyze your journal entries or personal notes for marketing or other commercial purposes.</li>
              <li><strong className="text-white">No sharing with social media:</strong> We don&apos;t integrate with social media platforms or share your data with them.</li>
              <li><strong className="text-white">No cross-site tracking:</strong> We don&apos;t use technologies like fingerprinting to track you across different websites.</li>
            </ul>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-3 uppercase tracking-[0.2em] text-xs">
              4. Third-Party Services
            </h2>
            <p className="mb-3">
              URGE relies on the following third-party services to operate. Each service only receives the data necessary to perform its function:
            </p>
            
            <div className="space-y-3">
              <div>
                <p className="text-white font-semibold mb-1">Supabase (Database &amp; Authentication):</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Stores all your account data, streaks, relapses, journals, and urges</li>
                  <li>Handles user authentication and session management</li>
                  <li>Hosts our PostgreSQL database</li>
                  <li>Subject to Supabase&apos;s privacy policy and security standards</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Payment Provider (Dodo Payments):</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Processes subscription payments</li>
                  <li>Stores payment method information (we never see your card details)</li>
                  <li>Manages subscription lifecycle (active, cancelled, etc.)</li>
                  <li>Subject to the payment provider&apos;s privacy policy</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Email Service Provider:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Sends automated accountability emails (The Sentinel)</li>
                  <li>Receives your email address and email preferences</li>
                  <li>May track email opens and clicks for delivery confirmation</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Hosting Provider (Vercel):</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Hosts the URGE application</li>
                  <li>May log IP addresses and request metadata for security and performance</li>
                  <li>Subject to Vercel&apos;s privacy policy</li>
                </ul>
              </div>
            </div>

            <p className="mt-3 text-[#52525b] text-xs">
              All third-party providers are contractually required to handle your data securely and only use it for the purposes we specify. We regularly review our third-party relationships to ensure they meet our privacy standards.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-3 uppercase tracking-[0.2em] text-xs">
              5. Cookies &amp; Local Storage
            </h2>
            <p className="mb-3">
              We use cookies and browser storage to provide essential functionality:
            </p>
            
            <div className="space-y-2">
              <div>
                <p className="text-white font-semibold mb-1">Authentication Cookies:</p>
                <p className="ml-2">
                  Required to keep you logged in. These are session-based and expire when you log out or after a period of inactivity.
                </p>
              </div>

            

              <div>
                <p className="text-white font-semibold mb-1">No Third-Party Cookies:</p>
                <p className="ml-2">
                  We don&apos;t set third-party cookies or allow third parties to set cookies on our site.
                </p>
              </div>
            </div>

            <p className="mt-3">
              If you block all cookies, URGE will not function correctly as authentication requires cookies to maintain your session.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-3 uppercase tracking-[0.2em] text-xs">
              6. Data Retention &amp; Deletion
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-white font-semibold mb-2">While Your Account Exists:</p>
                <p className="mb-2">
                  We retain all your data (account information, streaks, relapses, journals, urges) for as long as your account is active. This allows you to access your complete history and track your progress over time.
                </p>
              </div>

              <div>
                <p className="text-white font-semibold mb-2">Account Deletion:</p>
                <p className="mb-2">
                  <strong className="text-[#E11D48]">When you delete your account, we immediately and permanently delete all of your data:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Your user account and profile information</li>
                  <li>All streak data (current streak, longest streak, timestamps)</li>
                  <li>All relapse records (including notes, triggers, feelings)</li>
                  <li>All journal entries</li>
                  <li>All urge events (resisted and gave in)</li>
                  <li>Subscription information (after any required billing period)</li>
                </ul>
                <p className="mt-2">
                  This deletion is permanent and cannot be undone. Due to database cascade relationships, when your user account is deleted, all related records (streaks, relapses, journals, urges) are automatically deleted as well.
                </p>
              </div>

              <div>
                <p className="text-white font-semibold mb-2">Backup Retention:</p>
                <p className="mb-2">
                  Database backups may retain your data for up to 30 days after account deletion. These backups are encrypted and are only used for disaster recovery. After 30 days, backups containing your data are permanently purged.
                </p>
              </div>

              <div>
                <p className="text-white font-semibold mb-2">Payment Records:</p>
                <p className="mb-2">
                  We may be required by law to retain certain payment transaction records for a period (typically 7 years for tax and accounting purposes). These records contain minimal information (transaction ID, amount, date) and do not include your personal habit tracking data.
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-3 uppercase tracking-[0.2em] text-xs">
              7. Your Rights
            </h2>
            <p className="mb-3">
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            
            <div className="space-y-3">
              <div>
                <p className="text-white font-semibold mb-1">Right to Access:</p>
                <p className="ml-2">
                  You can request a copy of all personal data we hold about you, including your account information, streaks, relapses, journals, and urge events. You can access much of this data directly through your dashboard.
                </p>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Right to Correction:</p>
                <p className="ml-2">
                  You can update your account information (email, username) at any time through your settings. You can edit or delete your journal entries and notes.
                </p>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Right to Deletion:</p>
                <p className="ml-2">
                  You can delete your account at any time through your settings. This immediately and permanently deletes all your data as described in Section 6.
                </p>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Right to Data Portability:</p>
                <p className="ml-2">
                  You can request an export of your data in a machine-readable format (typically JSON). Contact us to request a data export.
                </p>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Right to Object:</p>
                <p className="ml-2">
                  You can object to certain processing of your data. For example, you can unsubscribe from accountability emails, though this may limit core functionality.
                </p>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Right to Withdraw Consent:</p>
                <p className="ml-2">
                  Where we rely on your consent for data processing, you can withdraw it at any time. This does not affect the lawfulness of processing before withdrawal.
                </p>
              </div>
            </div>

            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <span className="text-white font-semibold">privacy@urges.app</span>. We will respond to your request within 30 days, or sooner where required by law.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-3 uppercase tracking-[0.2em] text-xs">
              8. Security Measures
            </h2>
            <p className="mb-3">
              We implement multiple layers of security to protect your personal data:
            </p>
            
            <div className="space-y-2">
              <div>
                <p className="text-white font-semibold mb-1">Encryption:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>All data in transit is encrypted using TLS/SSL</li>
                  <li>Passwords are hashed using industry-standard algorithms (never stored in plain text)</li>
                  <li>Database backups are encrypted at rest</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Access Controls:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Database access is restricted to authorized personnel only</li>
                  <li>Multi-factor authentication required for administrative access</li>
                  <li>Regular security audits and access reviews</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Infrastructure Security:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Hosting on secure, SOC 2 compliant infrastructure (Vercel, Supabase)</li>
                  <li>Regular security updates and patches</li>
                  <li>Firewall protection and intrusion detection</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-1">Incident Response:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>We monitor for security breaches and unauthorized access</li>
                  <li>If a breach occurs, we will notify affected users within 72 hours as required by law</li>
                  <li>We maintain an incident response plan</li>
                </ul>
              </div>
            </div>

            <p className="mt-3 text-[#52525b] text-xs">
              No system is 100% secure, but we treat your data with the seriousness it deserves. If you discover a security vulnerability, please report it to privacy@urges.app.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-3 uppercase tracking-[0.2em] text-xs">
              9. Children&apos;s Privacy
            </h2>
            <p>
              URGE is not intended for users under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we discover we have collected data from a child, we will delete it promptly.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-3 uppercase tracking-[0.2em] text-xs">
              10. International Data Transfers
            </h2>
            <p className="mb-2">
              URGE is operated from the United States. If you are located outside the United States, your data will be transferred to and processed in the United States. By using URGE, you consent to this transfer.
            </p>
            <p>
              We ensure that any international data transfers comply with applicable data protection laws. Our third-party service providers (Supabase, Vercel, payment processors) may also process data in various locations worldwide, but they are contractually bound to protect your data according to our standards.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-3 uppercase tracking-[0.2em] text-xs">
              11. Data Breach Notification
            </h2>
            <p className="mb-2">
              In the event of a data breach that compromises your personal information, we will:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Notify affected users within 72 hours of discovering the breach (or sooner if required by law)</li>
              <li>Provide clear information about what data was compromised</li>
              <li>Explain the steps we are taking to address the breach</li>
              <li>Offer guidance on steps you can take to protect yourself</li>
              <li>Report the breach to relevant data protection authorities where required</li>
            </ul>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-3 uppercase tracking-[0.2em] text-xs">
              12. Changes to This Policy
            </h2>
            <p className="mb-2">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other reasons. When we make changes:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>We will update the &quot;Last Updated&quot; date at the bottom of this policy</li>
              <li>For material changes, we will notify you via email or through a prominent notice in the application</li>
              <li>We will provide a summary of significant changes</li>
            </ul>
            <p className="mt-2">
              Your continued use of URGE after changes become effective constitutes acceptance of the updated policy. If you disagree with the changes, you may delete your account at any time.
            </p>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <h2 className="text-white font-semibold mb-3 uppercase tracking-[0.2em] text-xs">
              13. Contact &amp; Questions
            </h2>
            <p className="mb-3">
              For privacy questions, data requests, or concerns about how we handle your data, contact us:
            </p>
            <div className="space-y-2">
              <p>
                <strong className="text-white">Email:</strong>{" "}
                <span className="text-white font-semibold">privacy@urges.app</span>
              </p>
              <p>
                <strong className="text-white">Response Time:</strong> We aim to respond to all privacy inquiries within 30 days, often sooner.
              </p>
              <p>
                <strong className="text-white">Language:</strong> No legalese required—plain language is welcome. We&apos;re here to help.
              </p>
            </div>
          </div>

          <div className="border-2 border-[#27272a] bg-[#0a0a0a] p-5">
            <p className="text-[10px] text-[#52525b] uppercase tracking-widest">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        <footer className="mt-12 text-[10px] text-[#52525b] uppercase tracking-[0.25em] flex justify-between gap-4">
          <span>URGE / PRIVACY FIRST</span>
          <Link href="/" className="text-[#a1a1aa] hover:text-white">
            BACK TO HOME
          </Link>
        </footer>
      </main>
    </div>
  );
}


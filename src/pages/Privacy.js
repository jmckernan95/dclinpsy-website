/**
 * Privacy Policy Page
 * GDPR-compliant privacy policy for the DClinPsy SJT Practice App
 */

import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> August 2025
          </p>

          <div className="prose max-w-none">
            {/* Executive Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-800 mb-3">Privacy Summary</h2>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• All your data is stored locally on your device - nothing is sent to external servers</li>
                <li>• You have complete control over your data with export and deletion options</li>
                <li>• Research participation is entirely optional and anonymous</li>
                <li>• We use industry-standard encryption for sensitive information</li>
                <li>• No cookies, tracking, or third-party analytics are used</li>
              </ul>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                The DClinPsy Situational Judgment Test Practice application ("the App", "we", "us") is committed to protecting your privacy. 
                This policy explains how we collect, use, and protect your personal information when you use our educational application.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Controller:</strong> This application operates as a client-side web application with no centralized data controller. 
                You are effectively the controller of your own data, which is stored locally on your device.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Data We Collect</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 Account Information</h3>
                  <p className="text-gray-700 mb-2">When you create an account, we collect:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li><strong>Profile name:</strong> Your chosen display name (not necessarily your real name)</li>
                    <li><strong>Email address:</strong> Used solely for account identification and recovery</li>
                    <li><strong>Date of birth:</strong> Required for age verification (18+), stored encrypted</li>
                    <li><strong>Password:</strong> Stored as a cryptographic hash for security</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2 Practice Test Data</h3>
                  <p className="text-gray-700 mb-2">As you use the application, we store:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Test results and scores</li>
                    <li>Question responses and rankings</li>
                    <li>Performance analytics and trends</li>
                    <li>Category-specific performance data</li>
                    <li>Test completion timestamps</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.3 Optional Research Data</h3>
                  <p className="text-gray-700 mb-2">If you consent to participate in research, we may collect:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Educational background (degree, university, classification)</li>
                    <li>Demographic information (with "prefer not to say" options)</li>
                    <li>DClinPsy application status and outcomes</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Note:</strong> Research participation is entirely optional and can be skipped during registration or completed later.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Your Data</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1 Essential Functions</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Authenticate you and maintain your session</li>
                    <li>Store and retrieve your practice test history</li>
                    <li>Generate performance analytics and study recommendations</li>
                    <li>Provide personalized progress tracking</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 Research Purposes (Optional)</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Understand educational pathways to DClinPsy success</li>
                    <li>Identify which question categories need development</li>
                    <li>Improve the effectiveness of the application</li>
                    <li>Generate anonymous insights about DClinPsy preparation</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-2">
                    Research data is anonymized and used solely for improving educational resources.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Storage and Security</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Local Storage</h3>
                  <p className="text-gray-700 mb-4">
                    All your data is stored locally in your web browser using browser storage mechanisms. 
                    <strong>No data is transmitted to external servers or third parties.</strong>
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Data remains on your device and under your control</li>
                    <li>Clearing browser data will remove your account and test history</li>
                    <li>Data is not synchronized across multiple devices</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 Security Measures</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li><strong>Password Security:</strong> Passwords are hashed using PBKDF2 with SHA-256</li>
                    <li><strong>Data Encryption:</strong> Sensitive data like date of birth is encrypted using AES-GCM</li>
                    <li><strong>Rate Limiting:</strong> Login attempts are limited to prevent brute force attacks</li>
                    <li><strong>Session Management:</strong> Sessions expire automatically for security</li>
                    <li><strong>Input Sanitization:</strong> All user inputs are sanitized to prevent XSS attacks</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Your Rights Under GDPR</h2>
              
              <p className="text-gray-700 mb-4">
                As this application stores data locally on your device, you have complete control over your personal information. 
                Your rights include:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📋 Right to Access</h4>
                  <p className="text-sm text-gray-700">Export all your data in JSON format through your profile settings.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">✏️ Right to Rectification</h4>
                  <p className="text-sm text-gray-700">Contact us to correct any inaccurate personal data.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🗑️ Right to Erasure</h4>
                  <p className="text-sm text-gray-700">Delete your account and all associated data permanently.</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📤 Right to Portability</h4>
                  <p className="text-sm text-gray-700">Export your data in a machine-readable format.</p>
                </div>
              </div>

              <p className="text-gray-700">
                Since all data is stored locally on your device, you can exercise these rights immediately through 
                the application interface. No requests to external parties are necessary.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Cookies and Tracking</h2>
              
              <p className="text-gray-700 mb-4">
                <strong>We do not use cookies, web beacons, or any tracking technologies.</strong> The application functions 
                entirely through browser local storage and does not track your activity outside of the application.
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>No third-party analytics services (like Google Analytics) are used</li>
                <li>No advertising networks or social media trackers are present</li>
                <li>No behavioral tracking or profiling is performed</li>
                <li>Your browsing activity outside this app is not monitored</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Age Restrictions</h2>
              
              <p className="text-gray-700 mb-4">
                This application is designed for individuals aged 18 and above who are preparing for DClinPsy applications. 
                We implement age verification during registration:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Date of birth is required during registration</li>
                <li>Users under 18 are prevented from creating accounts</li>
                <li>Date of birth is encrypted and stored securely</li>
                <li>Age verification helps ensure appropriate use of clinical content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Data Sharing</h2>
              
              <p className="text-gray-700 mb-4">
                <strong>We do not share, sell, or transfer your personal data to any third parties.</strong>
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>No data is transmitted to external servers</li>
                <li>No third-party services have access to your information</li>
                <li>Research data, if provided, is used only for anonymous statistical analysis</li>
                <li>No personal identifiers are included in any research outputs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Changes to This Policy</h2>
              
              <p className="text-gray-700 mb-4">
                We may update this privacy policy to reflect changes in our practices or for legal, operational, or regulatory reasons. 
                When we make changes:
              </p>

              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>The "Last updated" date at the top will be revised</li>
                <li>Significant changes will be highlighted in the application</li>
                <li>You will be notified when you next log in</li>
                <li>Continued use constitutes acceptance of the updated policy</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact Information</h2>
              
              <p className="text-gray-700 mb-4">
                If you have questions about this privacy policy or our data practices:
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 mb-2"><strong>Privacy Questions:</strong></p>
                <p className="text-gray-700 mb-2">Email: <a href="mailto:privacy@example.com" className="text-blue-600 hover:underline">privacy@example.com</a></p>
                <p className="text-gray-700 mb-2">General Support: <a href="mailto:help@example.com" className="text-blue-600 hover:underline">help@example.com</a></p>
                <p className="text-gray-700">Response time: Within 30 days as required by GDPR</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Legal Basis for Processing</h2>
              
              <p className="text-gray-700 mb-4">Under GDPR, our legal basis for processing your personal data is:</p>

              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Consent:</strong> You have explicitly consented to the processing during account registration</li>
                <li><strong>Legitimate Interest:</strong> Providing educational services and improving the application</li>
                <li><strong>Contract Performance:</strong> Delivering the educational services you have requested</li>
              </ul>

              <p className="text-gray-700 mt-4">
                You can withdraw your consent at any time by deleting your account, which will remove all your personal data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Disclaimer</h2>
              
              <p className="text-gray-700 mb-4">
                This application is an educational tool designed to supplement formal DClinPsy preparation programs. 
                It is not affiliated with the British Psychological Society (BPS), Health and Care Professions Council (HCPC), 
                or any UK university DClinPsy programs.
              </p>

              <p className="text-gray-700">
                Always refer to official BPS and HCPC guidelines for authoritative information on professional standards and requirements.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            This privacy policy is designed to be clear and transparent about our data practices.
          </p>
          <Link
            to="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Return to App
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
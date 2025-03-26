export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold mb-4">Introduction</h2>
            <p>
              Footle is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
            <p>
              We collect minimal personal information to provide you with the best possible experience:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Game statistics (number of guesses, win/loss records)</li>
              <li>Browser information (for technical purposes)</li>
              <li>IP address (for analytics and security)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
            <p>
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Improve the game experience</li>
              <li>Analyze usage patterns</li>
              <li>Maintain game statistics</li>
              <li>Ensure fair play</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Data Storage</h2>
            <p>
              We store your game data locally in your browser using localStorage. This data includes:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Your game history</li>
              <li>Statistics</li>
              <li>Preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Third-Party Services</h2>
            <p>
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Google Analytics (for website analytics)</li>
              <li>Social media sharing features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Access your personal data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of analytics</li>
              <li>Clear your local storage data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              <a href="mailto:privacy@footle.online" className="text-blue-400 hover:text-blue-300">
                privacy@footle.online
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Last Updated</h2>
            <p>
              This Privacy Policy was last updated on {new Date().toLocaleDateString()}.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
} 
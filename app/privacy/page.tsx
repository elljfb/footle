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
              We collect minimal information to provide you with the best possible experience:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Game statistics (number of guesses, win/loss records, streaks)</li>
              <li>Leaderboard submissions (nickname, scores, and completion times)</li>
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
              <li>Display your personal game statistics and progress</li>
              <li>Show leaderboard rankings to all players</li>
              <li>Improve the game experience</li>
              <li>Analyze usage patterns</li>
              <li>Ensure fair play</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Data Storage</h2>
            <p className="mb-4">
              We use two types of data storage:
            </p>
            
            <h3 className="text-lg font-semibold mb-2">Local Storage (Private)</h3>
            <p>
              Your personal game data is stored locally in your browser using localStorage. This data never leaves your device and includes:
            </p>
            <ul className="list-disc pl-6 mt-2 mb-4 space-y-2">
              <li>Your game history and daily results</li>
              <li>Personal statistics (games played, win percentage, streaks)</li>
              <li>Guess distribution charts</li>
              <li>Game state and preferences</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">Database Storage (Shared - Supabase)</h3>
            <p>
              When you voluntarily submit your score to the leaderboard, we store the following information in our database:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Your chosen nickname (public)</li>
              <li>Number of guesses</li>
              <li>Completion time</li>
              <li>Date of submission</li>
              <li>Game type (main game or specific league)</li>
            </ul>
            <p className="mt-2 text-sm text-gray-400">
              Note: Leaderboard data is public and visible to all players. Leaderboard entries older than 30 days may be automatically deleted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Third-Party Services</h2>
            <p>
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Supabase (for leaderboard data storage and management)</li>
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
              <li>View your personal statistics at any time</li>
              <li>Clear your local storage data through your browser settings</li>
              <li>Choose whether to submit scores to the public leaderboard</li>
              <li>Submit to the leaderboard with any nickname you choose</li>
              <li>Request deletion of your leaderboard entries by contacting us</li>
              <li>Opt-out of analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              <a href="mailto:dailyguessthefootballer@gmail.com" className="text-blue-400 hover:text-blue-300">
                dailyguessthefootballer@gmail.com
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
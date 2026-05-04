import LeaderboardClient from "./LeaderboardClient";

export const metadata = {
  title: 'Community Leaderboard | EcoSwap',
  description: 'See the top plant swappers and enthusiasts in our community.',
};

export default function LeaderboardPage() {
  return (
    <div className="bg-cream min-h-screen">
      <LeaderboardClient />
    </div>
  );
}

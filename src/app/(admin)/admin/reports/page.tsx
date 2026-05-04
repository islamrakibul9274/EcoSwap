import ReportsClient from "./ReportsClient";

export const metadata = {
  title: 'Moderation Queue | EcoSwap Admin',
  description: 'Manage flagged content and user reports.',
};

export default function ReportsPage() {
  return (
    <div className="w-full">
      <ReportsClient />
    </div>
  );
}

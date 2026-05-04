import WishlistClient from "./WishlistClient";

export const metadata = {
  title: 'My Wishlist | EcoSwap',
  description: 'View and manage the plants you have saved for later.',
};

export default function WishlistPage() {
  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-primary mb-2">My Wishlist</h1>
        <p className="text-foreground/60">Plants you've saved for future swaps.</p>
      </div>

      <WishlistClient />
    </div>
  );
}

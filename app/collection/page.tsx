import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Collection',
  description: 'Your local Diceborn character collection.',
};

export default function CollectionPage() {
  return (
    <section className="route-shell" aria-labelledby="collection-title">
      <p className="eyebrow">Local Collection</p>
      <h1 id="collection-title">Your characters will live here.</h1>
      <p className="route-lede">No accounts, backend, cloud storage, or public gallery are included in this foundation patch.</p>
      <div className="filter-placeholder" aria-label="Filter controls placeholder">
        <button type="button">All</button>
        <button type="button">Class</button>
        <button type="button">Race</button>
        <button type="button">Style</button>
      </div>
      <div className="empty-state panel-card">
        <h2>No local characters yet</h2>
        <p>Create a character to begin a browser-only collection in a later Alpha patch.</p>
        <Button asChild variant="primary"><Link href="/generate">Create Character</Link></Button>
      </div>
    </section>
  );
}

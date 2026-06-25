import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FeedbackState } from '@/components/ui/FeedbackState';
import { Panel } from '@/components/ui/Panel';
import { Tag } from '@/components/ui/Tag';

export const metadata = {
  title: 'Collection',
  description: 'Your local Diceborn character collection.',
};

export default function CollectionPage() {
  return (
    <section className="route-shell" aria-labelledby="collection-title">
      <div className="route-heading">
        <p className="eyebrow">Local Collection</p>
        <h1 id="collection-title" className="type-display">Your characters will live here.</h1>
        <p className="route-lede">No accounts, backend, cloud storage, or public gallery are included in this Alpha foundation.</p>
      </div>

      <div className="filter-placeholder" aria-label="Filter controls placeholder">
        <button type="button">All</button>
        <button type="button">Class</button>
        <button type="button">Race</button>
        <button type="button">Style</button>
      </div>

      <Panel variant="empty" className="empty-state">
        <Tag variant="count">0 saved</Tag>
        <FeedbackState title="Saved to your collection.">Saved characters will appear here once local collection behavior is implemented.</FeedbackState>
        <Button asChild variant="primary"><Link href="/generate">Create Character</Link></Button>
      </Panel>
    </section>
  );
}

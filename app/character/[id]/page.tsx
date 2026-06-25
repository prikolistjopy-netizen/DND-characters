import { Accordion } from '@/components/ui/Accordion';
import { ArtworkPlaceholder } from '@/components/ui/ArtworkPlaceholder';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Tag } from '@/components/ui/Tag';

export const metadata = {
  title: 'Character',
  description: 'View a Diceborn character result.',
};

export default function CharacterPage({ params }: Readonly<{ params: { id: string } }>) {
  return (
    <section className="route-shell character-layout" aria-labelledby="character-title">
      <ArtworkPlaceholder alt="Character artwork placeholder" />
      <Panel as="article" variant="elevated" className="character-detail">
        <p className="eyebrow">Character</p>
        <h1 id="character-title" className="type-display">Diceborn Character</h1>
        <div className="tag-row" aria-label="Character status">
          <Tag variant="status">Alpha shell</Tag>
          <Tag>Local preview</Tag>
        </div>
        <dl className="metadata-list">
          <div><dt>ID</dt><dd>{params.id}</dd></div>
          <div><dt>Class</dt><dd>Pending generator result</dd></div>
          <div><dt>Race</dt><dd>Pending generator result</dd></div>
        </dl>
        <div className="action-row">
          <Button variant="primary">Copy Prompt</Button>
          <Button variant="secondary">Save Local Copy</Button>
        </div>
        <Accordion title="Prompt and seed details">
          Prompt and structured DicebornGenerationResult details will render here during the Generator UX patch.
        </Accordion>
      </Panel>
    </section>
  );
}

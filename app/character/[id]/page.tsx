import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Character',
  description: 'View a Diceborn character result.',
};

export default function CharacterPage({ params }: Readonly<{ params: { id: string } }>) {
  return (
    <section className="route-shell character-layout" aria-labelledby="character-title">
      <div className="visual-placeholder" aria-label="Character visual placeholder" />
      <article className="character-detail panel-card">
        <p className="eyebrow">Character</p>
        <h1 id="character-title">Diceborn Character</h1>
        <dl className="metadata-list">
          <div><dt>ID</dt><dd>{params.id}</dd></div>
          <div><dt>Class</dt><dd>Pending generator result</dd></div>
          <div><dt>Race</dt><dd>Pending generator result</dd></div>
        </dl>
        <div className="action-row">
          <Button variant="primary">Copy Prompt</Button>
          <Button variant="secondary">Save Local Copy</Button>
        </div>
        <section className="prompt-placeholder" aria-label="Prompt details placeholder">Prompt and structured DicebornGenerationResult details will render here.</section>
      </article>
    </section>
  );
}

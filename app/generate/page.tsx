import { GeneratorClient } from './GeneratorClient';

export const metadata = {
  title: 'Generate',
  description: 'Create and shape a cinematic Diceborn fantasy character.',
};

export default function GeneratePage({
  searchParams,
}: {
  searchParams?: { mode?: string };
}) {
  const initialMode = searchParams?.mode === 'custom' ? 'custom' : 'random';

  return (
    <section className="route-shell" aria-labelledby="generate-title">
      <div className="visually-hidden">
        <h1 id="generate-title">Create a Diceborn character</h1>
        <p>Roll a complete cinematic fantasy character or guide the generation with supported preferences.</p>
      </div>
      <GeneratorClient initialMode={initialMode} />
    </section>
  );
}

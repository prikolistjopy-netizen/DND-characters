import facts from '../../data/vnext/facts.json';
import affordances from '../../data/vnext/affordances.json';
import rules from '../../data/vnext/rules.json';
import semanticFacts from '../../data/vnext/semantic-facts.json';
import type { PilotClassId, PilotSpeciesId, PowerVisibility, SemanticRule } from './contracts';

export type ClassFact = { id: PilotClassId; label: string; affordances: string[]; evidence: string[] };
export type SpeciesFact = { id: PilotSpeciesId; label: string; markers: string[]; avoid: string[] };
export type CultureFact = { id: string; label: string; materials: string[]; tensions: string[] };
export type EnvironmentFact = { id: string; label: string; weather: string; architecture: string };
export type PowerSourceFact = { id: string; label: string; classes: PilotClassId[]; visibility: PowerVisibility[] };
export type ProfessionFact = { id: string; label: string; tools: string[]; habits: string[]; wear: string[]; responsibilities: string[]; scenes: string[]; materials: string[]; tensions: string[] };

type FactJson = {
  classes: ClassFact[];
  species: SpeciesFact[];
  cultures: CultureFact[];
  environments: EnvironmentFact[];
  psychology: { drives: string[]; values: string[]; fears: string[]; contradictions: string[]; coping: string[]; restraint: string[] };
  tensionTemplates: { roleContradictions: string[]; socialTensions: string[]; innerConflicts: string[]; sacredProfane: string[]; expectations: string[] };
  powerSources: PowerSourceFact[];
};

type AffordanceJson = { professions: ProfessionFact[] };
type RuleJson = { rules: SemanticRule[] };

export const vnextFacts = facts as FactJson;
export const vnextAffordances = affordances as AffordanceJson;
export const vnextRules = (rules as RuleJson).rules;
export const vnextSemanticFacts = semanticFacts as { schemaVersion: string; pilotScope: { powerVisibilityModes: PowerVisibility[]; professions: string[]; classes: PilotClassId[]; species: PilotSpeciesId[] }; featureFlags: Record<string, boolean> };

export function getProfession(id: string) {
  return vnextAffordances.professions.find((profession) => profession.id === id);
}

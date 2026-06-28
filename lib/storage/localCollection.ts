import type { DicebornGenerationResult } from '@/lib/generator';

export const LOCAL_COLLECTION_KEY = 'diceborn.localCollection.v1';

export type LocalCollectionRecord = DicebornGenerationResult & {
  savedAt: string;
  customName?: string;
};

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function listLocalCharacters(): LocalCollectionRecord[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_COLLECTION_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalCollectionRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalCharacters(records: LocalCollectionRecord[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(LOCAL_COLLECTION_KEY, JSON.stringify(records));
}

export function saveLocalCharacter(result: DicebornGenerationResult): LocalCollectionRecord {
  const existing = listLocalCharacters();
  const current = existing.find((record) => record.id === result.id);
  const record: LocalCollectionRecord = {
    ...result,
    savedAt: current?.savedAt ?? new Date().toISOString(),
    customName: current?.customName,
  };
  writeLocalCharacters([record, ...existing.filter((item) => item.id !== result.id)]);
  return record;
}

export function readLocalCharacter(id: string): LocalCollectionRecord | null {
  return listLocalCharacters().find((record) => record.id === id) ?? null;
}

export function renameLocalCharacter(id: string, customName: string): LocalCollectionRecord | null {
  const records = listLocalCharacters();
  const index = records.findIndex((record) => record.id === id);
  if (index < 0) return null;
  records[index] = { ...records[index], customName: customName.trim() || undefined };
  writeLocalCharacters(records);
  return records[index];
}

export function duplicateLocalCharacter(id: string): LocalCollectionRecord | null {
  const source = readLocalCharacter(id);
  if (!source) return null;
  const copy: LocalCollectionRecord = {
    ...source,
    id: `${source.id}-copy-${Date.now().toString(36)}`,
    generatedAt: new Date().toISOString(),
    savedAt: new Date().toISOString(),
    customName: source.customName ? `${source.customName} Copy` : `${source.character.title} Copy`,
  };
  writeLocalCharacters([copy, ...listLocalCharacters()]);
  return copy;
}

export function deleteLocalCharacter(id: string): void {
  writeLocalCharacters(listLocalCharacters().filter((record) => record.id !== id));
}

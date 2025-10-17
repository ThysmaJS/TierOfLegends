import fr from './dictionaries/fr.json';

export type Dictionaries = typeof fr;

export async function getDictionary(locale: string): Promise<Dictionaries> {
  // For now we only ship FR; could expand with dynamic imports per locale.
  if (locale.startsWith('fr')) return fr as Dictionaries;
  return fr as Dictionaries;
}

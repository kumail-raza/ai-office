const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "for", "with",
  "is", "are", "was", "were", "be", "been", "at", "by", "as", "it", "its", "i",
  "you", "your", "my", "me", "we", "our", "that", "this", "these", "those",
  "from", "into", "about", "how", "what", "which", "who", "do", "does", "can",
]);

/** Crude but effective plural stemmer so "projects" matches "project". */
export function stem(word: string): string {
  if (word.length <= 3) return word;
  if (word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.endsWith("es")) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

/** Lowercase, split on non-alphanumerics, drop stopwords, and stem. */
export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? [])
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
    .map(stem);
}

export function repeat(tokens: string[], times: number): string[] {
  const output: string[] = [];
  for (let count = 0; count < times; count += 1) output.push(...tokens);
  return output;
}

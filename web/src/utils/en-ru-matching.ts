const rusToEngMap: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
}

const engToRusMap: Record<string, string> = {
  a: 'а',
  b: 'б',
  c: 'ц',
  d: 'д',
  e: 'е',
  f: 'ф',
  g: 'г',
  h: 'х',
  i: 'и',
  j: 'ж',
  k: 'к',
  l: 'л',
  m: 'м',
  n: 'н',
  o: 'о',
  p: 'п',
  q: 'к',
  r: 'р',
  s: 'с',
  t: 'т',
  u: 'у',
  v: 'в',
  w: 'в',
  x: 'кс',
  y: 'й',
  z: 'з',
}

function transliterate(text: string, map: Record<string, string>): string {
  return text
    .toLowerCase()
    .split('')
    .map((char) => map[char] || char)
    .join('')
}

/**
 * Checks if a text contains a search query using cross-language matching.
 * Supports Russian ↔ English transliteration for better search experience.
 */
export function matchesCrossLanguage(text: string, searchQuery: string): boolean {
  if (!searchQuery) return true

  const textLower = text.toLowerCase()
  const queryLower = searchQuery.toLowerCase()

  const textAsEng = transliterate(textLower, rusToEngMap)
  const queryAsEng = transliterate(queryLower, rusToEngMap)
  if (textAsEng.includes(queryAsEng)) return true

  const textAsRus = transliterate(textLower, engToRusMap)
  const queryAsRus = transliterate(queryLower, engToRusMap)
  return textAsRus.includes(queryAsRus)
}

/**
 * Filters an array of suggestions based on cross-language matching.
 */
export function filterSuggestions(suggestions: string[], searchText: string): string[] {
  if (!searchText) return suggestions

  return suggestions.filter(
    (suggestion) => matchesCrossLanguage(suggestion, searchText) && suggestion !== searchText,
  )
}

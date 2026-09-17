/** @typedef {import('./types.js').Operation} Operation */

const LABELS = {
  add_morpheme: { en: 'Add morpheme', ru: 'Добавление морфемы' },
  remove_morpheme: { en: 'Remove morpheme', ru: 'Удаление морфемы' },
  replace_morpheme: { en: 'Replace morpheme', ru: 'Замена морфемы' },
  stem_change: { en: 'Stem change', ru: 'Изменение основы' },
  change_feature: { en: 'Change grammatical feature', ru: 'Изменение грамматического признака' },
};

/**
 * @param {Operation} operation
 * @param {Map<string, import('./types.js').Morpheme>} morphemes
 * @param {'en'|'ru'} language
 */
export function describeOperation(operation, morphemes, language) {
  const label = LABELS[operation.type]?.[language] ?? operation.type;

  if (operation.type === 'add_morpheme' && operation.morpheme) {
    const morpheme = morphemes.get(operation.morpheme)?.form ?? operation.morpheme;
    return `${label}: ${morpheme}`;
  }

  if (operation.type === 'replace_morpheme') {
    const from = operation.fromMorpheme ? (morphemes.get(operation.fromMorpheme)?.form ?? operation.fromMorpheme) : '?';
    const to = operation.toMorpheme ? (morphemes.get(operation.toMorpheme)?.form ?? operation.toMorpheme) : '?';
    return `${label}: ${from} → ${to}`;
  }

  if (operation.type === 'stem_change') return `${label}: ${operation.from ?? '?'} → ${operation.to ?? '?'}`;
  if (operation.type === 'change_feature') return `${label}: ${operation.feature ?? '?'} ${operation.from ?? '?'} → ${operation.to ?? '?'}`;

  return label;
}

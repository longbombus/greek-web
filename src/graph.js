import './types.js';

const DATA_ROOT = './data';

/** @param {string} text */
function parseTsv(text) {
  const lines = text.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  if (lines.length === 0 || !lines[0]) return [];

  const headers = lines[0].split('\t');
  return lines.slice(1).filter(Boolean).map((line) => {
    const values = line.split('\t');
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}

/** @param {string} text */
function parseJsonl(text) {
  return text.split(/\r?\n/).filter((line) => line.trim().length > 0).map((line) => JSON.parse(line));
}

/** @param {string} path */
async function loadText(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
  return response.text();
}

/** @template T @param {Map<string, T[]>} index @param {string} key @param {T} value */
function pushIndex(index, key, value) {
  const values = index.get(key);
  if (values) values.push(value);
  else index.set(key, [value]);
}

/** @returns {Promise<import('./types.js').GraphData>} */
export async function loadGraph() {
  const [lexemesText, formsText, morphemesText, derivationsText, inflectionsText] = await Promise.all([
    loadText(`${DATA_ROOT}/lexemes.tsv`),
    loadText(`${DATA_ROOT}/forms.tsv`),
    loadText(`${DATA_ROOT}/morphemes.tsv`),
    loadText(`${DATA_ROOT}/derivations.jsonl`),
    loadText(`${DATA_ROOT}/inflections.jsonl`),
  ]);

  /** @type {Map<string, import('./types.js').Lexeme>} */
  const lexemes = new Map();
  for (const row of parseTsv(lexemesText)) {
    const lexeme = {
      id: row.id,
      language: row.language,
      lemma: row.lemma,
      pos: /** @type {import('./types.js').PartOfSpeech} */ (row.pos),
      features: row.features,
      glossEn: row.gloss_en,
      glossRu: row.gloss_ru,
      noteEn: row.note_en,
      noteRu: row.note_ru,
    };
    lexemes.set(lexeme.id, lexeme);
  }

  /** @type {Map<string, import('./types.js').WordForm>} */
  const forms = new Map();
  for (const row of parseTsv(formsText)) {
    const form = {
      id: row.id,
      lexemeId: row.lexeme_id,
      form: row.form,
      features: row.features,
      noteEn: row.note_en,
      noteRu: row.note_ru,
    };
    forms.set(form.id, form);
  }

  /** @type {Map<string, import('./types.js').Morpheme>} */
  const morphemes = new Map();
  for (const row of parseTsv(morphemesText)) {
    const morpheme = {
      id: row.id,
      language: row.language,
      form: row.form,
      kind: /** @type {import('./types.js').MorphemeKind} */ (row.kind),
      function: /** @type {import('./types.js').MorphemeFunction} */ (row.function),
      glossEn: row.gloss_en,
      glossRu: row.gloss_ru,
      noteEn: row.note_en,
      noteRu: row.note_ru,
    };
    morphemes.set(morpheme.id, morpheme);
  }

  /** @type {import('./types.js').Derivation[]} */
  const derivations = parseJsonl(derivationsText);
  /** @type {import('./types.js').Inflection[]} */
  const inflections = parseJsonl(inflectionsText);

  /** @type {Map<string, import('./types.js').Derivation[]>} */
  const outgoingDerivations = new Map();
  /** @type {Map<string, import('./types.js').Derivation[]>} */
  const incomingDerivations = new Map();
  for (const relation of derivations) {
    pushIndex(outgoingDerivations, relation.source, relation);
    pushIndex(incomingDerivations, relation.target, relation);
  }

  /** @type {Map<string, import('./types.js').Inflection[]>} */
  const inflectionsByLexeme = new Map();
  for (const relation of inflections) pushIndex(inflectionsByLexeme, relation.lexeme, relation);

  return {
    lexemes,
    forms,
    morphemes,
    derivations,
    inflections,
    outgoingDerivations,
    incomingDerivations,
    inflectionsByLexeme,
  };
}

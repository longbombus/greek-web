import { loadGraph } from './graph.js';
import { describeOperation } from './operations.js';

/** @type {import('./types.js').GraphData | null} */
let graph = null;
/** @type {'ru'|'en'} */
let uiLanguage = 'ru';
/** @type {string | null} */
let selectedLexemeId = null;

const searchInput = /** @type {HTMLInputElement} */ (document.querySelector('#search'));
const listElement = /** @type {HTMLDivElement} */ (document.querySelector('#lexeme-list'));
const detailsElement = /** @type {HTMLDivElement} */ (document.querySelector('#details'));

document.querySelector('#lang-ru')?.addEventListener('click', () => {
  uiLanguage = 'ru';
  render();
});

document.querySelector('#lang-en')?.addEventListener('click', () => {
  uiLanguage = 'en';
  render();
});

searchInput.addEventListener('input', renderLexemeList);

function renderLexemeList() {
  if (!graph) return;
  const query = searchInput.value.trim().toLocaleLowerCase('el');
  const lexemes = [...graph.lexemes.values()]
    .filter((lexeme) => !query || lexeme.lemma.toLocaleLowerCase('el').includes(query))
    .sort((a, b) => a.lemma.localeCompare(b.lemma, 'el'));

  listElement.replaceChildren(...lexemes.map((lexeme) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = lexeme.id === selectedLexemeId ? 'lexeme active' : 'lexeme';
    button.textContent = `${lexeme.lemma} · ${lexeme.pos}`;
    button.addEventListener('click', () => {
      selectedLexemeId = lexeme.id;
      render();
    });
    return button;
  }));
}

/** @param {string} text */
function textBlock(text) {
  const element = document.createElement('p');
  element.textContent = text;
  return element;
}

/**
 * @param {import('./types.js').Operation[]} operations
 * @returns {HTMLElement}
 */
function renderOperations(operations) {
  const wrapper = document.createElement('div');
  wrapper.className = 'operations';

  if (operations.length === 0) {
    wrapper.append(textBlock(uiLanguage === 'ru' ? 'Механизм пока не описан.' : 'Mechanism is not described yet.'));
    return wrapper;
  }

  for (const operation of operations) {
    const item = document.createElement('div');
    item.className = 'operation';
    item.textContent = describeOperation(operation, graph?.morphemes ?? new Map(), uiLanguage);
    wrapper.append(item);
  }
  return wrapper;
}

/** @param {import('./types.js').Lexeme} lexeme */
function renderLexemeDetails(lexeme) {
  if (!graph) return;
  const fragment = document.createDocumentFragment();

  const title = document.createElement('h2');
  title.textContent = lexeme.lemma;
  fragment.append(title);

  const meta = document.createElement('p');
  meta.className = 'muted';
  meta.textContent = [lexeme.pos, lexeme.features].filter(Boolean).join(' · ');
  fragment.append(meta);

  fragment.append(textBlock(uiLanguage === 'ru' ? lexeme.glossRu : lexeme.glossEn));
  const note = uiLanguage === 'ru' ? lexeme.noteRu : lexeme.noteEn;
  if (note) fragment.append(textBlock(note));

  const outgoing = graph.outgoingDerivations.get(lexeme.id) ?? [];
  const incoming = graph.incomingDerivations.get(lexeme.id) ?? [];
  const inflections = graph.inflectionsByLexeme.get(lexeme.id) ?? [];

  fragment.append(renderSection('Derivations →', outgoing.map((relation) => {
    const target = graph?.lexemes.get(relation.target);
    return renderRelationCard(target?.lemma ?? relation.target, relation.operations, uiLanguage === 'ru' ? relation.noteRu : relation.noteEn, () => {
      selectedLexemeId = relation.target;
      render();
    });
  })));

  fragment.append(renderSection('← Derived from', incoming.map((relation) => {
    const source = graph?.lexemes.get(relation.source);
    return renderRelationCard(source?.lemma ?? relation.source, relation.operations, uiLanguage === 'ru' ? relation.noteRu : relation.noteEn, () => {
      selectedLexemeId = relation.source;
      render();
    });
  })));

  fragment.append(renderSection(uiLanguage === 'ru' ? 'Формы' : 'Forms', inflections.map((relation) => {
    const form = graph?.forms.get(relation.form);
    return renderRelationCard(form?.form ?? relation.form, relation.operations, form?.features ?? '', null);
  })));

  detailsElement.replaceChildren(fragment);
}

/**
 * @param {string} title
 * @param {HTMLElement[]} children
 */
function renderSection(title, children) {
  const section = document.createElement('section');
  section.className = 'section';
  const heading = document.createElement('h3');
  heading.textContent = title;
  section.append(heading);
  if (children.length === 0) section.append(textBlock('—'));
  else section.append(...children);
  return section;
}

/**
 * @param {string} title
 * @param {import('./types.js').Operation[]} operations
 * @param {string | undefined} note
 * @param {(() => void) | null} onClick
 */
function renderRelationCard(title, operations, note, onClick) {
  const card = document.createElement(onClick ? 'button' : 'div');
  card.className = 'relation-card';
  if (card instanceof HTMLButtonElement) card.type = 'button';

  const heading = document.createElement('strong');
  heading.textContent = title;
  card.append(heading, renderOperations(operations));
  if (note) card.append(textBlock(note));
  if (onClick) card.addEventListener('click', onClick);
  return card;
}

function render() {
  renderLexemeList();
  if (!graph || !selectedLexemeId) return;
  const lexeme = graph.lexemes.get(selectedLexemeId);
  if (lexeme) renderLexemeDetails(lexeme);
}

try {
  graph = await loadGraph();
  selectedLexemeId = graph.lexemes.keys().next().value ?? null;
  render();
} catch (error) {
  detailsElement.textContent = error instanceof Error ? error.message : String(error);
}

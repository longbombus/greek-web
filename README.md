# greek-web

Static word-formation explorer for Modern Greek.

The project keeps the linguistic dataset as plain text files and loads it into an in-memory graph in the browser. No backend or database is required for the initial version.

## Stack

- Plain JavaScript ES modules
- JSDoc types + `jsconfig.json` with `checkJs`
- ESLint
- Vite only for local development and production bundling
- Static TSV/JSONL language dataset

## Dataset

The canonical dataset currently consists of five files in `public/data/`:

- `lexemes.tsv` — dictionary lexemes
- `forms.tsv` — inflected word forms that belong to lexemes
- `morphemes.tsv` — reusable morphemes used when explaining transformations
- `derivations.jsonl` — lexeme → lexeme derivational relations
- `inflections.jsonl` — lexeme → form inflectional relations

Relations contain an `operations` array. Operations describe how a transition is realized, for example adding a morpheme or changing a stem. The relation itself is the linguistic fact; operations are the explanation of that fact.

The loader builds the following runtime indexes:

```text
lexemes: Map<id, Lexeme>
forms: Map<id, WordForm>
morphemes: Map<id, Morpheme>

derivations: Derivation[]
inflections: Inflection[]

outgoingDerivations: Map<lexemeId, Derivation[]>
incomingDerivations: Map<lexemeId, Derivation[]>
inflectionsByLexeme: Map<lexemeId, Inflection[]>
```

## Development

```bash
npm install
npm run dev
```

Checks and production build:

```bash
npm run lint
npm run build
```

Open the debug explorer, search for a lexeme, and follow derivational links or inspect known forms and their operations.

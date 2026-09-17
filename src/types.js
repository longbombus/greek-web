/**
 * @typedef {'NOUN'|'VERB'|'ADJ'|'ADV'|'PRON'|'DET'|'NUM'|'ADP'|'CONJ'|'PART'|'INTJ'|'OTHER'} PartOfSpeech
 */

/**
 * @typedef {Object} Lexeme
 * @property {string} id
 * @property {string} language
 * @property {string} lemma
 * @property {PartOfSpeech} pos
 * @property {string} features
 * @property {string} glossEn
 * @property {string} glossRu
 * @property {string} noteEn
 * @property {string} noteRu
 */

/**
 * @typedef {Object} WordForm
 * @property {string} id
 * @property {string} lexemeId
 * @property {string} form
 * @property {string} features
 * @property {string} noteEn
 * @property {string} noteRu
 */

/**
 * @typedef {'ROOT'|'PREFIX'|'SUFFIX'|'AUGMENT'|'ENDING'|'OTHER'} MorphemeKind
 */

/**
 * @typedef {'DERIVATIONAL'|'INFLECTIONAL'|'BOTH'} MorphemeFunction
 */

/**
 * @typedef {Object} Morpheme
 * @property {string} id
 * @property {string} language
 * @property {string} form
 * @property {MorphemeKind} kind
 * @property {MorphemeFunction} function
 * @property {string} glossEn
 * @property {string} glossRu
 * @property {string} noteEn
 * @property {string} noteRu
 */

/**
 * @typedef {'add_morpheme'|'remove_morpheme'|'replace_morpheme'|'stem_change'|'change_feature'} OperationType
 */

/**
 * @typedef {Object} Operation
 * @property {OperationType} type
 * @property {string=} morpheme
 * @property {string=} fromMorpheme
 * @property {string=} toMorpheme
 * @property {string=} from
 * @property {string=} to
 * @property {string=} feature
 */

/**
 * @typedef {Object} Derivation
 * @property {string} id
 * @property {string} source
 * @property {string} target
 * @property {'derivation'} type
 * @property {Operation[]} operations
 * @property {string=} noteEn
 * @property {string=} noteRu
 */

/**
 * @typedef {Object} Inflection
 * @property {string} id
 * @property {string} lexeme
 * @property {string} form
 * @property {'inflection'} type
 * @property {Operation[]} operations
 * @property {string=} noteEn
 * @property {string=} noteRu
 */

/**
 * @typedef {Object} GraphData
 * @property {Map<string, Lexeme>} lexemes
 * @property {Map<string, WordForm>} forms
 * @property {Map<string, Morpheme>} morphemes
 * @property {Derivation[]} derivations
 * @property {Inflection[]} inflections
 * @property {Map<string, Derivation[]>} outgoingDerivations
 * @property {Map<string, Derivation[]>} incomingDerivations
 * @property {Map<string, Inflection[]>} inflectionsByLexeme
 */

export {};

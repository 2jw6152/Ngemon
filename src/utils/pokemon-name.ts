const HIDDEN_VARIANT_SUFFIX_RE = /\s*\((A|G|H)\)\s*$/i;

export const toDisplayPokemonName = (name: string) => name.replace(HIDDEN_VARIANT_SUFFIX_RE, '').trim();

export const hasFrameSuffix = (name: string) => /_\d+$/i.test(name.trim());

/**
 * The {@link heroCardVariant} constant
 * @description Allowed variants for the {@link HeroCard} component, controlling the icon trio shown
 */
export const heroCardVariant = {
  HOME: 'home',
  SOBRE: 'sobre',
  PROJETOS: 'projetos',
  CONTATO: 'contato',
  AJUDAR: 'ajudar',
} as const

/**
 * The {@link HeroCardVariant} type
 * @description Union of allowed {@link heroCardVariant} values
 */
export type HeroCardVariant = (typeof heroCardVariant)[keyof typeof heroCardVariant]

/**
 * The {@link heroCardCopy} constant
 * @description Static copy used by the {@link HeroCard} component
 */
export const heroCardCopy = {
  IMAGE_ALT: 'Impacto na comunidade',
} as const
